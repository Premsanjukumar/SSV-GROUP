import { NextRequest, NextResponse } from "next/server";
import { BookingError } from "./pricing";
import { COOKIE, readSession } from "./session";
export const ok = (d: unknown, status = 200) => NextResponse.json(d, { status });
export function fail(e: unknown) {
  if (e instanceof BookingError) return NextResponse.json({ error: e.message, code: e.code }, { status: e.code === "SOLD_OUT" ? 409 : 400 });
  console.error("[api]", e instanceof Error ? e.message : "unknown error"); // never log secrets or send stack traces
  return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
}
export const sameOrigin = (req: NextRequest) => { const o = req.headers.get("origin"); return !o || o === req.nextUrl.origin; };
export async function requireAdmin(req: NextRequest) {
  if (!sameOrigin(req)) return null;
  return readSession(req.cookies.get(COOKIE)?.value, process.env.AUTH_SECRET ?? "");
}
export const clientIp = (req: NextRequest) => req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
