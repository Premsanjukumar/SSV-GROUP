// Signed admin session (HMAC-SHA256) using Web Crypto, so it works in middleware and routes.
const enc = new TextEncoder();
const b64 = (b: ArrayBuffer | Uint8Array) => btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(b)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const key = (s: string) => crypto.subtle.importKey("raw", enc.encode(s), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
export const COOKIE = "ssv_admin";
export const SESSION_SECONDS = 8 * 3600;
export interface Session { id: string; email: string; exp: number }
export async function signSession(s: Omit<Session, "exp">, secret: string, now = Date.now()) {
  if (secret.length < 32) throw new Error("AUTH_SECRET must be at least 32 characters.");
  const body = b64(enc.encode(JSON.stringify({ ...s, exp: Math.floor(now / 1000) + SESSION_SECONDS })));
  return `${body}.${b64(await crypto.subtle.sign("HMAC", await key(secret), enc.encode(body)))}`;
}
export async function readSession(token: string | undefined, secret: string, now = Date.now()): Promise<Session | null> {
  if (!token || !secret) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const good = b64(await crypto.subtle.sign("HMAC", await key(secret), enc.encode(body)));
  if (good.length !== sig.length) return null;
  let diff = 0; for (let i = 0; i < good.length; i++) diff |= good.charCodeAt(i) ^ sig.charCodeAt(i);
  if (diff) return null;
  try {
    const p = JSON.parse(atob(body.replace(/-/g, "+").replace(/_/g, "/"))) as Session;
    return p.exp * 1000 > now ? p : null;
  } catch { return null; }
}
