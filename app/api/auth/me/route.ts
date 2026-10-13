import { NextResponse } from "next/server";
import { AuthError, getAccountRequests, getAuthenticatedAccount } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getAuthenticatedAccount();
    if (!session) return NextResponse.json({ error: "Please sign in to continue." }, { status: 401 });
    const { account, key } = session;
    const requests = await getAccountRequests(key);
    return NextResponse.json({
      user: { name: account.name, email: account.email, createdAt: account.createdAt },
      requests,
    });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("Account dashboard could not be loaded.", error);
    return NextResponse.json({ error: "We could not load your account." }, { status: 503 });
  }
}
