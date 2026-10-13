import { createHash } from "node:crypto";

export async function enforceRateLimit(request: Request, scope: string, limit: number) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return { configured: false, limited: true };

  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim().slice(0, 128);
  const clientAddress = forwardedFor || request.headers.get("x-real-ip")?.slice(0, 128) || "unknown";
  const clientId = createHash("sha256").update(clientAddress).digest("hex").slice(0, 24);
  const key = `alharamain:rate:${scope}:${clientId}`;

  try {
    const response = await fetch(`${url.replace(/\/$/, "")}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([["INCR", key], ["EXPIRE", key, "60"]]),
      cache: "no-store",
      signal: AbortSignal.timeout(3_000),
    });
    if (!response.ok) return { configured: true, limited: true };

    const results = await response.json();
    const count = Number(results?.[0]?.result);
    return { configured: true, limited: !Number.isFinite(count) || count > limit };
  } catch {
    return { configured: true, limited: true };
  }
}
