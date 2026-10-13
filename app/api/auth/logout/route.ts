import { NextResponse } from "next/server";
import { AuthError, destroySession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  try {
    await destroySession();
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("Account sign-out failed.", error);
    return NextResponse.json({ error: "We could not sign you out. Please try again." }, { status: 503 });
  }
}
