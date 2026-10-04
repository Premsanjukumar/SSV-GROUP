import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/auth";
import { prisma, BookingStatus } from "@/lib/prisma";
import { afterPayment } from "@/services/postConfirm";

// ============================================================
// POST /api/admin/bookings/[id]/resend-email
// Admin endpoint to safely resend ticket email with PDF attachment.
// Reuses existing confirmed booking, tickets, and QR tokens.
// Does NOT create duplicate bookings, payments, or tickets.
// ============================================================

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        tickets: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.status !== BookingStatus.CONFIRMED) {
      return NextResponse.json(
        { error: "Cannot send ticket email for an unconfirmed booking." },
        { status: 400 }
      );
    }

    if (!booking.customerEmail) {
      return NextResponse.json(
        { error: "Booking does not have a customer email address." },
        { status: 400 }
      );
    }

    // Trigger decoupled fulfillment with forceEmailResend
    const result = await afterPayment(booking.id, { forceEmailResend: true });

    return NextResponse.json({
      success: result.emailSent,
      message: result.emailSent
        ? `Ticket email successfully sent to ${booking.customerEmail}`
        : "Failed to deliver email. Please verify SMTP configuration.",
    });
  } catch (error) {
    console.error("[ADMIN RESEND EMAIL ERROR]", error);
    return NextResponse.json(
      { error: "Failed to resend ticket email" },
      { status: 500 }
    );
  }
}
