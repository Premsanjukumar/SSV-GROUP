import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSessionFromRequest } from "@/lib/auth";
import { verifyAndCheckInTicket } from "@/services/payment";

const ScanSchema = z.object({
  token: z.string().min(5).max(300),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const parsed = ScanSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { valid: false, status: "INVALID", message: "Invalid scan token format" },
        { status: 400 }
      );
    }

    const result = await verifyAndCheckInTicket(parsed.data.token, session.adminId);
    return NextResponse.json(result);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Scan failed";
    console.error("[ADMIN_SCAN_ERROR]", errorMsg);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
