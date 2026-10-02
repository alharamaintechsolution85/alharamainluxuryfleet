import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_LENGTH = 300;

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 8_000) {
    return NextResponse.json({ error: "Request too large." }, { status: 413 });
  }

  const payload = await request.json().catch(() => null);
  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = typeof payload.name === "string" ? payload.name.trim().slice(0, MAX_LENGTH) : "";
  const email = typeof payload.email === "string" ? payload.email.trim().slice(0, MAX_LENGTH) : "";
  const phone = typeof payload.phone === "string" ? payload.phone.trim().slice(0, 40) : "";
  const journey = typeof payload.journey === "string" ? payload.journey.trim().slice(0, 80) : "";
  const destination = typeof payload.destination === "string" ? payload.destination.trim().slice(0, 80) : "";

  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || phone.length < 6) {
    return NextResponse.json({ error: "Please provide a name, valid email, and phone number." }, { status: 400 });
  }

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!redisUrl || !redisToken) {
    return NextResponse.json({ error: "Quote storage is not configured." }, { status: 503 });
  }

  try {
    const record = { id: crypto.randomUUID(), name, email, phone, journey, destination, createdAt: new Date().toISOString() };
    const response = await fetch(`${redisUrl.replace(/\/$/, "")}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${redisToken}`, "Content-Type": "application/json" },
      body: JSON.stringify([
        ["LPUSH", "alharamain:quotes", JSON.stringify(record)],
        ["LTRIM", "alharamain:quotes", "0", "999"],
      ]),
      cache: "no-store",
    });

    if (!response.ok) throw new Error("Quote storage request failed");
    return NextResponse.json({ ok: true, id: record.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "We could not save your request. Please call our concierge." }, { status: 502 });
  }
}
*** Add File: c:\Users\SULTAN COMPUTER\Desktop\cadstudio\app\api\assistant\route.ts
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
      // Fall through to the configured secondary provider.
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
*** Add File: c:\Users\SULTAN COMPUTER\Desktop\cadstudio\public\manifest.json
{
  "name": "Al Haramain Luxury Fleet",
  "short_name": "Al Haramain",
  "description": "Private chauffeur and luxury car hire across the UAE.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#191a18",
  "theme_color": "#191a18",
  "icons": []
}