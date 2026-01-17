import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }
    const token = authHeader.replace(/^Bearer\s+/i, "")

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { chatId, message, personaId } = await req.json()

    // 1. Get and Verify User
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    if (authError || !user) {
      throw new Error('Invalid or expired token')
    }

    // Check usage limits
    const { data: limits } = await supabaseClient
      .from('usage_limits')
      .select('messages_today')
      .eq('user_id', user.id)
      .single()

    if (limits && limits.messages_today >= 30) {
      return new Response(
        JSON.stringify({ error: 'Daily message limit reached', limitReached: true }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 2. Get Persona context
    const { data: persona } = await supabaseClient
      .from('personas')
      .select('*')
      .eq('id', personaId)
      .single()

    // 3. Get Chat History (Last 10 messages)
    const { data: history } = await supabaseClient
      .from('messages')
      .select('content, sender_type')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: false })
      .limit(10)

    // Reverse history to be chronological
    const pastMessages = (history || []).reverse().map(msg => ({
      role: msg.sender_type === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }))

    // 4. Call Gemini
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{
              text: `You are ${persona.name}, a ${persona.age} year old. Bio: ${persona.bio}. Your vibes: ${persona.vibes?.join(', ')}. 
            Rules:
            - Chat in English and Hinglish (Roman Hindi).
            - Be casual, imperfect, and human.
            - Never disclose you are an AI.
            - Do not give phone numbers or social handles.
            - Keep responses concise.`
            }]
          },
          ...pastMessages,
          {
            role: 'user',
            parts: [{ text: message }]
          }
        ]
      })
    })

    const geminiData = await response.json()

    // Handle Gemini errors gracefully
    if (!geminiData.candidates || !geminiData.candidates[0]) {
      console.error('Gemini Error:', JSON.stringify(geminiData));
      throw new Error('Failed to generate response from AI');
    }

    const aiResponseText = geminiData.candidates[0].content.parts[0].text

    // 5. Save AI message to DB
    await supabaseClient.from('messages').insert({
      chat_id: chatId,
      sender_type: 'persona',
      content: aiResponseText
    })

    // Increment message count
    await supabaseClient.rpc('increment_messages', { user_id_param: user.id })

    return new Response(
      JSON.stringify({ content: aiResponseText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
