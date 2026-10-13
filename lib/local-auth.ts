const accountsKey = "alharamain-local-accounts";
const sessionKey = "alharamain-local-session";
const passwordIterations = 120_000;

export type LocalUser = {
  name: string;
  email: string;
  createdAt: string;
};

type LocalAccount = LocalUser & {
  salt: string;
  passwordHash: string;
};

function decode(value: string) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

function encode(value: Uint8Array) {
  return btoa(Array.from(value, (byte) => String.fromCharCode(byte)).join(""));
}

async function hashPassword(password: string, salt: Uint8Array) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const saltBuffer = new ArrayBuffer(salt.byteLength);
  new Uint8Array(saltBuffer).set(salt);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: saltBuffer, iterations: passwordIterations }, key, 256);
  return encode(new Uint8Array(bits));
}

function readAccounts(): LocalAccount[] {
  const value = localStorage.getItem(accountsKey);
  if (!value) return [];
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed) || parsed.some((account) =>
    typeof account !== "object" || account === null ||
    !("name" in account) || typeof account.name !== "string" ||
    !("email" in account) || typeof account.email !== "string" ||
    !("createdAt" in account) || typeof account.createdAt !== "string" ||
    !("salt" in account) || typeof account.salt !== "string" ||
    !("passwordHash" in account) || typeof account.passwordHash !== "string",
  )) throw new Error("Saved local accounts could not be read.");
  return parsed;
}

export async function registerLocalAccount(name: string, email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const accounts = readAccounts();
  if (accounts.some((account) => account.email === normalizedEmail)) {
    throw new Error("An account with this email already exists. Please sign in.");
  }
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const account: LocalAccount = {
    name: name.trim(),
    email: normalizedEmail,
    createdAt: new Date().toISOString(),
    salt: encode(salt),
    passwordHash: await hashPassword(password, salt),
  };
  localStorage.setItem(accountsKey, JSON.stringify([...accounts, account]));
  localStorage.setItem(sessionKey, normalizedEmail);
  return { name: account.name, email: account.email, createdAt: account.createdAt };
}

export async function loginLocalAccount(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const account = readAccounts().find((item) => item.email === normalizedEmail);
  if (!account) throw new Error("Email or password is incorrect.");
  const actualHash = await hashPassword(password, decode(account.salt));
  const actual = decode(actualHash);
  const expected = decode(account.passwordHash);
  if (actual.length !== expected.length || !actual.every((byte, index) => byte === expected[index])) {
    throw new Error("Email or password is incorrect.");
  }
  localStorage.setItem(sessionKey, normalizedEmail);
  return { name: account.name, email: account.email, createdAt: account.createdAt };
}

export function getLocalSession(): LocalUser | null {
  const email = localStorage.getItem(sessionKey);
  if (!email) return null;
  const account = readAccounts().find((item) => item.email === email);
  if (!account) {
    localStorage.removeItem(sessionKey);
    return null;
  }
  return { name: account.name, email: account.email, createdAt: account.createdAt };
}

export function clearLocalSession() {
  localStorage.removeItem(sessionKey);
}
