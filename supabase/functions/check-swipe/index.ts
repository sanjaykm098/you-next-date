import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    console.log('Auth Header received:', authHeader ? 'Present' : 'Missing')
    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }

    const token = authHeader.replace(/^Bearer\s+/i, "")

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { personaId, direction } = await req.json()

    // Verify user manually passing token
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    console.log('User retrieval result:', { userStr: user ? 'Found' : 'Missing', authError, tokenLength: token.length })

    if (authError || !user) {
      throw new Error(`Invalid or expired token: ${authError?.message || 'No user found'}`)
    }

    // Check usage limits
    const { data: limits } = await supabaseClient
      .from('usage_limits')
      .select('swipes_today')
      .eq('user_id', user.id)
      .single()

    if (limits && limits.swipes_today >= 20) {
      return new Response(
        JSON.stringify({ error: 'Daily swipe limit reached', limitReached: true }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let isMatch = false
    let chatId = null
    if (direction === 'right') {
      // Simulate match logic (can be more complex later)
      isMatch = Math.random() > 0.4

      if (isMatch) {
        // Create a chat if it doesn't exist
        const { data: chat, error: chatError } = await supabaseClient
          .from('chats')
          .upsert({ user_id: user.id, persona_id: personaId }, { onConflict: 'user_id,persona_id' })
          .select('id')
          .single()

        if (chatError) throw chatError
        chatId = chat.id
      }

      // Update limits
      await supabaseClient.rpc('increment_swipes', { user_id_param: user.id })
    }

    return new Response(
      JSON.stringify({ isMatch, chatId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
