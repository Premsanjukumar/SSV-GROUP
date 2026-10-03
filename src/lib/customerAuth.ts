/**
 * Customer Authentication & Session Management using Jose JWT
 */

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const CUSTOMER_SESSION_COOKIE = "ssv_customer_session";
const SESSION_DURATION_SECONDS = 30 * 24 * 60 * 60; // 30 days

export interface CustomerSessionPayload {
  customerId: string;
  email?: string | null;
  phone?: string | null;
  name?: string | null;
  exp?: number;
}

function getSecretKey(): Uint8Array {
  const secret =
    process.env.AUTH_SECRET || "ssv-secure-customer-auth-secret-dandiya-2026-key";
  return new TextEncoder().encode(secret);
}

export async function signCustomerToken(
  payload: Omit<CustomerSessionPayload, "exp">
): Promise<string> {
  return new SignJWT({
    customerId: payload.customerId,
    email: payload.email || undefined,
    phone: payload.phone || undefined,
    name: payload.name || undefined,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifyCustomerToken(
  token: string
): Promise<CustomerSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return {
      customerId: payload.customerId as string,
      email: (payload.email as string) || null,
      phone: (payload.phone as string) || null,
      name: (payload.name as string) || null,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}

export async function getCustomerSession(): Promise<CustomerSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CUSTOMER_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyCustomerToken(token);
}

export function getCustomerFromRequest(
  req: NextRequest
): Promise<CustomerSessionPayload | null> {
  const token = req.cookies.get(CUSTOMER_SESSION_COOKIE)?.value;
  if (!token) return Promise.resolve(null);
  return verifyCustomerToken(token);
}

export function setCustomerCookie(res: NextResponse, token: string) {
  res.cookies.set(CUSTOMER_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export function clearCustomerCookie(res: NextResponse) {
  res.cookies.set(CUSTOMER_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
