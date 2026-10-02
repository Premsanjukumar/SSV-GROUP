import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createBooking } from "@/services/payment";
import { BookingFormSchema } from "@/validators";
import { getClientIp, checkRateLimit, sanitizePhone, generateBookingRef } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);

  // Rate limiting: 5 bookings per 15 minutes per IP
  const isAllowed = checkRateLimit(`booking:${ip}`, 5, 15 * 60 * 1000);
  if (!isAllowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Validate input
  const result = BookingFormSchema.safeParse({
    ...(body as Record<string, unknown>),
    customerPhone: sanitizePhone(String((body as Record<string, unknown>).customerPhone || "")),
  });

  if (!result.success) {
    const firstError = result.error.errors[0];
    return NextResponse.json(
      { error: firstError.message || "Invalid input" },
      { status: 400 }
    );
  }

  const data = result.data;

  // Female-only validation check
  let isWomenOnly = data.ticketTypeId.toLowerCase().includes("single");
  try {
    const tt = await prisma.ticketType.findUnique({
      where: { id: data.ticketTypeId },
      select: { womenOnly: true, name: true },
    });
    if (tt) {
      isWomenOnly = tt.womenOnly || tt.name.toLowerCase().includes("single");
    }
  } catch {
    // DB fallback: rely on ticketTypeId inspection
  }

  if (isWomenOnly && !data.femaleConfirmation) {
    return NextResponse.json(
      { error: "You must confirm eligibility for the Single Pass (Women Only)" },
      { status: 400 }
    );
  }

  try {
    const booking = await createBooking({
      eventId: data.eventId === "auto" ? "ssv-dandiya-2026-demo" : data.eventId,
      ticketTypeId: data.ticketTypeId,
      quantity: data.quantity,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      customerCity: data.customerCity,
      attendeeNames: data.attendeeNames,
    });

    return NextResponse.json({
      bookingId: booking.bookingId,
      bookingRef: booking.bookingRef,
      totalInPaise: booking.totalInPaise,
    });
  } catch (error) {
    console.warn("[API /bookings] DB booking fallback activated:", (error as Error).message);

    // Fallback simulated booking creation if DB is offline
    const unitPrice = data.ticketTypeId.includes("couple") ? 49900 : 29900;
    const totalInPaise = unitPrice * data.quantity;
    const bookingRef = generateBookingRef();
    const demoBookingId = `demo_booking_${Date.now()}`;

    return NextResponse.json({
      bookingId: demoBookingId,
      bookingRef,
      totalInPaise,
    });
  }
}
