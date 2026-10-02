import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAndCheckInTicket } from "@/services/payment";
import { TicketScanSchema } from "@/validators";
import { getAdminSessionFromRequest } from "@/lib/auth";
import { getClientIp } from "@/lib/utils";

export async function POST(req: NextRequest) {
  // Admin auth required for scanner
  const session = await getAdminSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const result = TicketScanSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  const { token } = result.data;
  const ip = getClientIp(req.headers);

  const scanResult = await verifyAndCheckInTicket(token, session.adminId);

  // Log scan to audit
  await prisma.auditLog.create({
    data: {
      adminId: session.adminId,
      action: "TICKET_SCAN",
      details: {
        status: scanResult.status,
        ticketRef: scanResult.ticketInfo?.bookingRef,
      },
      ipAddress: ip,
    },
  }).catch(() => {/* non-critical */});

  return NextResponse.json(scanResult);
}

// Public verify (GET) — no auth, used by the /verify/[token] page
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 400 });
  }

  const ticket = await prisma.ticket.findUnique({
    where: { token },
    include: {
      booking: {
        include: { bookingItems: { include: { ticketType: true } } },
      },
    },
  });

  if (!ticket) {
    return NextResponse.json({
      valid: false,
      status: "NOT_FOUND",
      message: "Ticket not found",
    });
  }

  const booking = ticket.booking;
  const item = booking.bookingItems[0];
  const ticketStatus = ticket.checkedIn ? "USED" : ticket.isValid ? "VALID" : "INVALID";

  return NextResponse.json({
    valid: ticket.isValid && booking.status === "CONFIRMED" && booking.paymentStatus === "PAID",
    ticketStatus,
    bookingStatus: booking.status,
    ticketInfo: {
      bookingRef: booking.bookingRef,
      customerName: booking.customerName,
      ticketType: item?.ticketType.name || "Unknown",
      quantity: item?.quantity || 1,
      eventDate: "14 October 2026, Wednesday",
      eventTime: "5:00 PM Onwards",
      venue: "Beside Beladale Petrol Pump, Gumpa, Bidar",
      checkedInAt: ticket.checkedInAt,
    },
  });
}
