import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const AUTH_COOKIE = "ssv_admin_session";
export const SESSION_DURATION = 8 * 60 * 60; // 8 hours in seconds

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET || "ssv-dandiya-divas-2026-auth-secret-key-prod";
  return new TextEncoder().encode(secret);
}

export interface AdminSession {
  adminId: string;
  email: string;
  name: string;
}

export async function createSession(payload: AdminSession): Promise<string> {
  const secret = getSecret();
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(secret);
  return token;
}

export async function verifySession(
  token: string
): Promise<AdminSession | null> {
  try {
    const secret = getSecret();
    const { payload } = await jwtVerify(token, secret);
    return {
      adminId: payload.adminId as string,
      email: payload.email as string,
      name: payload.name as string,
    };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;
    if (!token) return null;
    return await verifySession(token);
  } catch {
    return null;
  }
}

export async function getAdminSessionFromRequest(
  req: NextRequest
): Promise<AdminSession | null> {
  try {
    const token = req.cookies.get(AUTH_COOKIE)?.value;
    if (!token) return null;
    return await verifySession(token);
  } catch {
    return null;
  }
}

export function createSessionCookie(token: string): string {
  const isProduction = process.env.NODE_ENV === "production";
  const maxAge = SESSION_DURATION;
  return `${AUTH_COOKIE}=${token}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax${
    isProduction ? "; Secure" : ""
  }`;
}

export function clearSessionCookie(): string {
  return `${AUTH_COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`;
}
