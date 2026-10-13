import { createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);
const SESSION_COOKIE = "alharamain_session";
const SESSION_AGE = 60 * 60 * 24 * 30;

export type Account = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

export type PublicAccount = Omit<Account, "passwordHash">;

export class AuthError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

function redisSettings() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const secret = process.env.SESSION_SECRET;
  if (!url || !token || !secret || secret.length < 32) {
    throw new AuthError("Account services are not configured. Please contact our concierge.", 503);
  }
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new AuthError("Account storage is not configured correctly.", 503);
  }
  if (parsedUrl.protocol !== "https:") {
    throw new AuthError("Account storage must use a secure connection.", 503);
  }
  return { url: url.replace(/\/$/, ""), token, secret };
}

async function redisCommand(command: string[]) {
  const { url, token } = redisSettings();
  const response = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify([command]),
    cache: "no-store",
    signal: AbortSignal.timeout(4_000),
  });
  if (!response.ok) throw new AuthError("Account storage is temporarily unavailable.", 503);
  const payload: unknown = await response.json();
  if (!Array.isArray(payload) || typeof payload[0] !== "object" || payload[0] === null) {
    throw new AuthError("Account storage returned an invalid response.", 503);
  }
  const result = payload[0] as { result?: unknown; error?: string };
  if (result.error) throw new AuthError("Account storage is temporarily unavailable.", 503);
  return result.result;
}

function emailKey(email: string) {
  const digest = createHmac("sha256", redisSettings().secret).update(email).digest("hex");
  return `alharamain:account:${digest}`;
}

async function derivePassword(password: string, salt: Buffer) {
  const key = await scryptAsync(password, salt, 64);
  if (!Buffer.isBuffer(key)) throw new AuthError("Password security check failed.", 500);
  return key;
}

export async function createPasswordHash(password: string) {
  const salt = randomBytes(16);
  const hash = await derivePassword(password, salt);
  return `scrypt:${salt.toString("hex")}:${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string | undefined) {
  if (!storedHash) {
    await derivePassword(password, Buffer.alloc(16));
    return false;
  }
  const [algorithm, saltText, hashText] = storedHash.split(":");
  if (algorithm !== "scrypt" || !/^[a-f0-9]{32}$/i.test(saltText || "") || !/^[a-f0-9]{128}$/i.test(hashText || "")) {
    throw new AuthError("Account credentials are invalid.", 503);
  }
  const expected = Buffer.from(hashText, "hex");
  const actual = await derivePassword(password, Buffer.from(saltText, "hex"));
  return timingSafeEqual(actual, expected);
}

export function accountKey(email: string) {
  return emailKey(email);
}

export async function getAccountByKey(key: string) {
  const result = await redisCommand(["GET", key]);
  if (typeof result !== "string") return null;
  try {
    const account: unknown = JSON.parse(result);
    if (
      typeof account === "object" && account !== null &&
      "id" in account && typeof account.id === "string" &&
      "name" in account && typeof account.name === "string" &&
      "email" in account && typeof account.email === "string" &&
      "passwordHash" in account && typeof account.passwordHash === "string" &&
      "createdAt" in account && typeof account.createdAt === "string"
    ) return account as Account;
  } catch {
    throw new AuthError("The saved account record could not be read.", 503);
  }
  throw new AuthError("The saved account record is invalid.", 503);
}

export async function createAccount(account: Account) {
  const result = await redisCommand(["SET", emailKey(account.email), JSON.stringify(account), "NX"]);
  return result === "OK";
}

function signature(sessionId: string, secret: string) {
  return createHmac("sha256", secret).update(sessionId).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

async function sessionIdFromCookie() {
  const { secret } = redisSettings();
  const cookieStore = await cookies();
  const value = cookieStore.get(SESSION_COOKIE)?.value;
  if (!value) return null;
  const [sessionId, suppliedSignature] = value.split(".");
  if (!/^[a-f0-9]{64}$/i.test(sessionId || "") || !suppliedSignature || !safeEqual(suppliedSignature, signature(sessionId, secret))) return null;
  return sessionId;
}

export async function createSession(key: string) {
  const { secret } = redisSettings();
  const sessionId = randomBytes(32).toString("hex");
  await redisCommand(["SET", `alharamain:session:${sessionId}`, key, "EX", String(SESSION_AGE)]);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, `${sessionId}.${signature(sessionId, secret)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_AGE,
  });
}

export async function getAuthenticatedAccount() {
  const sessionId = await sessionIdFromCookie();
  if (!sessionId) return null;
  const key = await redisCommand(["GET", `alharamain:session:${sessionId}`]);
  if (typeof key !== "string" || !/^alharamain:account:[a-f0-9]{64}$/i.test(key)) return null;
  const account = await getAccountByKey(key);
  return account ? { account, key } : null;
}

export async function destroySession() {
  const sessionId = await sessionIdFromCookie();
  if (sessionId) await redisCommand(["DEL", `alharamain:session:${sessionId}`]);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getAccountRequests(key: string) {
  const result = await redisCommand(["LRANGE", `${key}:requests`, "0", "19"]);
  if (!Array.isArray(result)) throw new AuthError("Saved enquiries could not be read.", 503);
  return result.flatMap((item) => {
    if (typeof item !== "string") throw new AuthError("A saved enquiry is invalid.", 503);
    try {
      const request: unknown = JSON.parse(item);
      if (typeof request === "object" && request !== null && "id" in request && "createdAt" in request) {
        return [request];
      }
    } catch {
      throw new AuthError("A saved enquiry could not be read.", 503);
    }
    throw new AuthError("A saved enquiry is invalid.", 503);
  });
}

export async function saveAccountRequest(key: string, record: object) {
  await redisCommand(["LPUSH", `${key}:requests`, JSON.stringify(record)]);
  await redisCommand(["LTRIM", `${key}:requests`, "0", "19"]);
}
