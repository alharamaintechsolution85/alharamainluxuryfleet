import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const message = typeof payload?.message === "string" ? payload.message.trim().slice(0, 500) : "";
  if (!message) return NextResponse.json({ error: "Enter a question." }, { status: 400 });

  const systemPrompt = "You are the Al Haramain Luxury Fleet concierge for a UAE chauffeur and luxury rental company. Answer briefly in the language the guest uses, English or Arabic. Be warm and factual. Fleet examples include Mercedes S-Class, Maybach, BMW 7 Series, Audi A8, Range Rover, Lexus LX, Cadillac Escalade, Exeed VX/RX, Toyota HiAce VIP, Rolls-Royce Cullinan, Lamborghini Urus, Porsche 911, Bentley Flying Spur, and Ferrari Roma. Coverage: Dubai, Abu Dhabi, Ras Al Khaimah, Sharjah, Ajman, Fujairah, and desert excursions. Prices shown on the website are indicative; always ask a concierge to confirm availability and final rates. Never claim to process payment or confirm a booking. Contact +971 55 716 2816 or alharamainluxuryfleet@gmail.com.";

  if (process.env.GROQ_API_KEY) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "system", content: systemPrompt }, { role: "user", content: message }], temperature: 0.4, max_tokens: 350 }),
        cache: "no-store",
      });
      if (response.ok) {
        const data = await response.json();
        const answer = data.choices?.[0]?.message?.content;
        if (typeof answer === "string") return NextResponse.json({ answer });
      }
    } catch {
      // Fall through to the secondary provider when Groq is unavailable.
    }
  }

  if (process.env.GEMINI_API_KEY) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemInstruction: { parts: [{ text: systemPrompt }] }, contents: [{ parts: [{ text: message }] }], generationConfig: { maxOutputTokens: 350, temperature: 0.4 } }),
        cache: "no-store",
      });
      if (response.ok) {
        const data = await response.json();
        const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (typeof answer === "string") return NextResponse.json({ answer });
      }
    } catch {
      // The caller receives a safe fallback below.
    }
  }

  return NextResponse.json({ answer: "Our digital concierge is offline. Call +971 55 716 2816 or email alharamainluxuryfleet@gmail.com and our team will help." });
}
