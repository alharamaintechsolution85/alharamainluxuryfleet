import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { enforceRateLimit } from "@/lib/rate-limit";
import { accountKey, AuthError, createAccount, createPasswordHash, createSession, type Account } from "@/lib/auth";

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
  if (typeof payload !== "object" || payload === null || !("name" in payload) || !("email" in payload) || !("password" in payload)) {
    return NextResponse.json({ error: "Enter your name, email, and password." }, { status: 400 });
  }
  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const password = typeof payload.password === "string" ? payload.password : "";
  if (name.length < 2 || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Enter a valid name and email address." }, { status: 400 });
  }
  if (password.length < 12 || password.length > 128) {
    return NextResponse.json({ error: "Use a password between 12 and 128 characters." }, { status: 400 });
  }

  try {
    const limit = await enforceRateLimit(request, "account-signup", 5);
    if (limit.limited) {
      return NextResponse.json(
        { error: limit.configured ? "Too many attempts. Please try again in a minute." : "Account services are not configured." },
        { status: limit.configured ? 429 : 503 },
      );
    }
    const account: Account = {
      id: randomUUID(),
      name,
      email,
      passwordHash: await createPasswordHash(password),
      createdAt: new Date().toISOString(),
    };
    if (!await createAccount(account)) {
      return NextResponse.json({ error: "An account with this email already exists. Please sign in." }, { status: 409 });
    }
    await createSession(accountKey(email));
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("Account registration failed.", error);
    return NextResponse.json({ error: "We could not create your account. Please try again." }, { status: 503 });
  }
}
