import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getAuthenticatedAccount } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_LENGTH = 300;

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") || 0) > 8_000) {
    return NextResponse.json({ error: "Request too large." }, { status: 413 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (typeof payload !== "object" || payload === null || !("name" in payload) || !("email" in payload)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = typeof payload.name === "string" ? payload.name.trim().slice(0, MAX_LENGTH) : "";
  const email = typeof payload.email === "string" ? payload.email.trim().slice(0, MAX_LENGTH) : "";
  const phone = "phone" in payload && typeof payload.phone === "string" ? payload.phone.trim().slice(0, 40) : "";
  const journey = "journey" in payload && typeof payload.journey === "string" ? payload.journey.trim().slice(0, 80) : "";
  const destination = "destination" in payload && typeof payload.destination === "string" ? payload.destination.trim().slice(0, 80) : "";
  const vehicle = "vehicle" in payload && typeof payload.vehicle === "string" ? payload.vehicle.trim().slice(0, 100) : "";
  const pickupLocation = "pickupLocation" in payload && typeof payload.pickupLocation === "string" ? payload.pickupLocation.trim().slice(0, 100) : "";
  const pickupDate = "pickupDate" in payload && typeof payload.pickupDate === "string" ? payload.pickupDate.slice(0, 10) : "";
  const returnDate = "returnDate" in payload && typeof payload.returnDate === "string" ? payload.returnDate.slice(0, 10) : "";
  const rentalDays = "rentalDays" in payload && typeof payload.rentalDays === "string" ? payload.rentalDays.slice(0, 2) : "";
  const serviceType = "serviceType" in payload && typeof payload.serviceType === "string" ? payload.serviceType.slice(0, 40) : "";
  const securityEscort = "securityEscort" in payload && typeof payload.securityEscort === "string" ? payload.securityEscort.slice(0, 40) : "";

  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || phone.length < 6) {
    return NextResponse.json({ error: "Please provide a name, valid email, and phone number." }, { status: 400 });
  }

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!redisUrl || !redisToken) {
    return NextResponse.json({ error: "Quote storage is not configured." }, { status: 503 });
  }

  const rateLimit = await enforceRateLimit(request, "quotes", 5);
  if (rateLimit.limited) {
    return NextResponse.json({ error: "Too many requests. Please try again in a minute." }, { status: rateLimit.configured ? 429 : 503 });
  }

  try {
    const record = { id: randomUUID(), name, email, phone, journey, destination, vehicle, pickupLocation, pickupDate, returnDate, rentalDays, serviceType, securityEscort, createdAt: new Date().toISOString() };
    const session = (process.env.SESSION_SECRET?.length ?? 0) >= 32
      ? await getAuthenticatedAccount()
      : null;
    const commands: (string | number)[][] = [
      ["LPUSH", "alharamain:quotes", JSON.stringify(record)],
      ["LTRIM", "alharamain:quotes", "0", "999"],
    ];
    if (session) {
      commands.push(
        ["LPUSH", `${session.key}:requests`, JSON.stringify(record)],
        ["LTRIM", `${session.key}:requests`, "0", "19"],
      );
    }

    const response = await fetch(`${redisUrl.replace(/\/$/, "")}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${redisToken}`, "Content-Type": "application/json" },
      body: JSON.stringify(commands),
      cache: "no-store",
      signal: AbortSignal.timeout(4_000),
    });
    const results: unknown = await response.json();
    if (!response.ok || (Array.isArray(results) && results.some((result) => typeof result === "object" && result !== null && "error" in result))) {
      throw new Error("Quote storage request failed");
    }
    return NextResponse.json({ ok: true, id: record.id }, { status: 201 });
  } catch (error) {
    console.error("Quote request could not be saved.", error);
    return NextResponse.json({ error: "We could not save your request. Please call our concierge." }, { status: 502 });
  }
}
