import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSessionFromRequest } from "@/lib/auth";
import { verifyAndCheckInTicket } from "@/services/payment";

const ManualCheckinSchema = z.object({
  reference: z.string().min(3).max(60),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const parsed = ManualCheckinSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Please enter a valid booking ID or reference." }, { status: 400 });
    }

    const query = parsed.data.reference.trim().toUpperCase();

    // Find ticket by Booking Reference or Booking ID
    const ticket = await prisma.ticket.findFirst({
      where: {
        OR: [
          { booking: { bookingRef: query } },
          { booking: { id: query.toLowerCase() } },
          { token: query },
        ],
      },
      orderBy: { checkedIn: "asc" }, // prioritize unchecked tickets
    });

    if (!ticket) {
      return NextResponse.json({
        valid: false,
        status: "NOT_FOUND",
        message: "No ticket found for this booking reference.",
      });
    }

    // Log manual checkin audit entry
    await prisma.auditLog.create({
      data: {
        adminId: session.adminId,
        action: "MANUAL_CHECKIN",
        details: { ticketId: ticket.id, query },
      },
    }).catch(() => null);

    const result = await verifyAndCheckInTicket(ticket.token, session.adminId);
    return NextResponse.json(result);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Manual checkin error";
    console.error("[MANUAL_CHECKIN_ERROR]", errorMsg);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
