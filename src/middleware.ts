import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const AUTH_COOKIE = "ssv_admin_session";

async function getSecret(secret: string): Promise<Uint8Array> {
  return new TextEncoder().encode(secret);
}

// Middleware: protect all /admin and /api/admin routes (except /admin/login and /api/admin/login)
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow login endpoints through without auth
  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/admin/login/") ||
    pathname === "/api/admin/login" ||
    pathname.startsWith("/api/admin/login/")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get(AUTH_COOKIE)?.value;
  const secret = process.env.AUTH_SECRET || "ssv-dandiya-divas-2026-auth-secret-key-prod";

  if (token && secret) {
    try {
      await jwtVerify(token, await getSecret(secret));
      return NextResponse.next(); // Valid session — allow through
    } catch {
      // Invalid/expired token — fall through to redirect
    }
  }

  // No valid session
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Redirect to login for page routes
  const loginUrl = new URL("/admin/login", req.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
