import { NextResponse } from "next/server";
import { enforceRateLimit } from "@/lib/rate-limit";
import { accountKey, AuthError, createSession, getAccountByKey, verifyPassword } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") || 0) > 16_000) {
    return NextResponse.json({ error: "Request too large." }, { status: 413 });
  }
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (typeof payload !== "object" || payload === null || !("email" in payload) || !("password" in payload)) {
    return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
  }
  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const password = typeof payload.password === "string" ? payload.password : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || password.length === 0 || password.length > 128) {
    return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
  }

  try {
    const limit = await enforceRateLimit(request, "account-login", 8);
    if (limit.limited) {
      return NextResponse.json(
        { error: limit.configured ? "Too many attempts. Please try again in a minute." : "Account services are not configured." },
        { status: limit.configured ? 429 : 503 },
      );
    }
    const key = accountKey(email);
    const account = await getAccountByKey(key);
    if (!await verifyPassword(password, account?.passwordHash)) {
      return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
    }
    await createSession(key);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("Account sign-in failed.", error);
    return NextResponse.json({ error: "We could not sign you in. Please try again." }, { status: 503 });
  }
}
