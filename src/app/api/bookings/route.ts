import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createBooking } from "@/services/payment";
import { BookingFormSchema } from "@/validators";
import { getClientIp, checkRateLimit, sanitizePhone } from "@/lib/utils";

// ============================================================
// POST /api/bookings
// Creates a pending booking with capacity reservation.
// Prices are derived strictly from database records.
// ============================================================

export async function POST(req: NextRequest) {
  if (!process.env.DATABASE_URL) {
    console.error("[CRITICAL_CONFIG_ERROR] DATABASE_URL is not set in environment variables!");
    return NextResponse.json(
      { error: "Database not configured. Please add DATABASE_URL to your Vercel Project Settings -> Environment Variables." },
      { status: 500 }
    );
  }

  const ip = getClientIp(req.headers);

  // Rate limiting: 10 booking initiations per 10 minutes per IP
  const isAllowed = checkRateLimit(`booking-init:${ip}`, 10, 10 * 60 * 1000);
  if (!isAllowed) {
    return NextResponse.json(
      { error: "Too many booking requests. Please wait a few moments before trying again." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body" }, { status: 400 });
  }

  // Validate input schema with Zod
  const result = BookingFormSchema.safeParse({
    ...(body as Record<string, unknown>),
    customerPhone: sanitizePhone(String((body as Record<string, unknown>)?.customerPhone || "")),
  });

  if (!result.success) {
    const firstError = result.error.errors[0];
    return NextResponse.json(
      { error: firstError?.message || "Invalid booking data provided" },
      { status: 400 }
    );
  }

  const data = result.data;

  // Single Pass / Women Only confirmation check
  try {
    let tt = await prisma.ticketType.findUnique({
      where: { id: data.ticketTypeId },
      select: { womenOnly: true, name: true },
    });

    if (!tt && (data.ticketTypeId.includes("single") || data.ticketTypeId.includes("couple"))) {
      tt = await prisma.ticketType.findFirst({
        where: {
          name: { contains: data.ticketTypeId.includes("single") ? "Single" : "Couple", mode: "insensitive" },
          isActive: true,
        },
        select: { womenOnly: true, name: true },
      });
    }

    const isWomenOnly = tt?.womenOnly || tt?.name.toLowerCase().includes("single") || data.ticketTypeId.toLowerCase().includes("single");
    if (isWomenOnly && !data.femaleConfirmation) {
      return NextResponse.json(
        { error: "You must confirm that the Single Pass is for an eligible female attendee." },
        { status: 400 }
      );
    }
  } catch (err) {
    console.warn("[Booking Validation Check Warning]", err instanceof Error ? err.message : err);
  }

  try {
    const booking = await createBooking({
      eventId: data.eventId,
      ticketTypeId: data.ticketTypeId,
      quantity: data.quantity,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      customerCity: data.customerCity,
      attendeeNames: data.attendeeNames,
      ipAddress: ip,
      userAgent: req.headers.get("user-agent") || undefined,
      whatsappOptIn: Boolean((body as { whatsappOptIn?: boolean })?.whatsappOptIn),
      shoppingBenefitOptIn: data.shoppingBenefitOptIn !== false,
      couponCode: data.couponCode,
    });

    return NextResponse.json({
      bookingId: booking.bookingId,
      bookingRef: booking.bookingRef,
      totalInPaise: booking.totalInPaise,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Booking initiation failed";

    if (
      errorMsg.includes("SOLD_OUT") ||
      errorMsg.includes("remaining") ||
      errorMsg.includes("closed") ||
      errorMsg.includes("Maximum") ||
      errorMsg.includes("Coupon") ||
      errorMsg.includes("coupon") ||
      errorMsg.includes("Ticket type") ||
      errorMsg.includes("Ticket sales")
    ) {
      return NextResponse.json(
        { error: errorMsg === "SOLD_OUT" ? "Sorry, this ticket tier is currently sold out." : errorMsg },
        { status: 400 }
      );
    }

    console.error("[BOOKING_CREATION_FAILED]", errorMsg);

    if (
      errorMsg.includes("database") ||
      errorMsg.includes("DATABASE_URL") ||
      errorMsg.includes("Can't reach database") ||
      errorMsg.includes("P1001") ||
      errorMsg.includes("P2024")
    ) {
      return NextResponse.json(
        { error: "Database connection failed. Please ensure DATABASE_URL is added in Vercel Project Settings -> Environment Variables." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: `Unable to create booking: ${errorMsg}` },
      { status: 500 }
    );
  }
}
