import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

const randomFrom = (arr: string[]) =>
  arr[Math.floor(Math.random() * arr.length)]

function isUnsafeOutput(text: string): boolean {
  if (!text) return true
  const patterns = [
    /\b(ai|bot|assistant|model|trained)\b/i,
    /\b\d{10,}\b/,
    /instagram|insta|snapchat|whatsapp/i,
    /nude|sex|fuck|boobs|ass|dick|horny/i
  ]
  return patterns.some(p => p.test(text))
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get("Authorization")
    if (!authHeader) throw new Error("No auth header")

    const token = authHeader.replace(/^Bearer\s+/i, "")

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    )

    const { chatId, message, personaId } = await req.json()

    const { data: { user } } = await supabase.auth.getUser(token)
    if (!user) throw new Error("Unauthorized")

    // Check limit
    const { data: limits } = await supabase
      .from("usage_limits")
      .select("messages_today")
      .eq("user_id", user.id)
      .single()

    if (limits?.messages_today >= 30) {
      return new Response(
        JSON.stringify({
          content: randomFrom([
            "Aaj kaafi baat ho gayi 😊 kal continue karein?",
            "Thoda break lete hain, baad mein baat karte hain 💛"
          ]),
          limitReached: true
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const { data: persona } = await supabase
      .from("personas")
      .select("*")
      .eq("id", personaId)
      .single()

    const { data: history } = await supabase
      .from("messages")
      .select("content, sender_type")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: false })
      .limit(12)

    const pastMessages = (history || []).reverse().map(m => ({
      role: m.sender_type === "user" ? "user" : "model",
      parts: [{ text: m.content }]
    }))

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${Deno.env.get("GEMINI_API_KEY")}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{
                text: `You are ${persona.name}, chatting on a dating app.
Rules:
- English + Hinglish only
- Casual, imperfect, human
- NEVER mention AI
- NEVER share phone or socials
- If sexual, slow it down`
              }]
            },
            ...pastMessages,
            { role: "user", parts: [{ text: message }] }
          ]
        })
      }
    )

    const geminiData = await geminiRes.json()
    let aiText =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!aiText || isUnsafeOutput(aiText)) {
      aiText = randomFrom([
        "Sorry, thoda busy ho gayi thi 😅",
        "Can you repeat that? Thoda miss ho gaya",
        "Haha ek second, distraction ho gaya 🙈"
      ])
    }

    await supabase.from("messages").insert({
      chat_id: chatId,
      sender_type: "persona",
      content: aiText
    })

    await supabase.rpc("increment_messages", {
      user_id_param: user.id
    })

    return new Response(
      JSON.stringify({ content: aiText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )

  } catch (err: any) {
    console.error("Chat error:", err)
    return new Response(
      JSON.stringify({
        content: randomFrom([
          "Sorry, thoda busy ho gayi thi 😅",
          "Can you repeat that?",
          "Hmm ek second..."
        ])
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
