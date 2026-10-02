import { NextRequest, NextResponse } from "next/server";
import { AdminLoginSchema } from "@/validators";
import { createSession, AUTH_COOKIE, SESSION_DURATION } from "@/lib/auth";

// Demo credentials — used when no DB is connected
const DEMO_ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@ssvgroup.in";
const DEMO_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@SSV2026!";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const result = AdminLoginSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
  }

  const { email, password } = result.data;
  const INVALID_MSG = "Invalid email or password";

  // Try DB-backed login first
  try {
    const { prisma } = await import("@/lib/prisma");
    const bcrypt = await import("bcryptjs");

    const admin = await prisma.adminUser.findUnique({ where: { email } });
    if (admin && admin.isActive) {
      const passwordValid = await bcrypt.compare(password, admin.passwordHash);
      if (!passwordValid) {
        return NextResponse.json({ error: INVALID_MSG }, { status: 401 });
      }
      // Update last login (non-critical)
      prisma.adminUser.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } }).catch(() => {});

      const token = await createSession({ adminId: admin.id, email: admin.email, name: admin.name || "Admin" });
      const res = NextResponse.json(
        { success: true, name: admin.name || "Admin" },
        { status: 200 }
      );
      res.cookies.set(AUTH_COOKIE, token, {
        httpOnly: true,
        path: "/",
        maxAge: SESSION_DURATION,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
      return res;
    }
  } catch {
    // DB offline — fall through to demo mode check below
  }

  // Demo/offline mode: compare against env credentials directly
  const emailMatch = email.toLowerCase() === DEMO_ADMIN_EMAIL.toLowerCase();
  const passMatch = password === DEMO_ADMIN_PASSWORD;

  if (!emailMatch || !passMatch) {
    return NextResponse.json({ error: INVALID_MSG }, { status: 401 });
  }

  const token = await createSession({
    adminId: "demo-admin-id",
    email: DEMO_ADMIN_EMAIL,
    name: "SSV Admin",
  });

  const res = NextResponse.json(
    { success: true, name: "SSV Admin" },
    { status: 200 }
  );
  res.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    path: "/",
    maxAge: SESSION_DURATION,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
