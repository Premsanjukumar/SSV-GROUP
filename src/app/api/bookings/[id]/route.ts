import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        bookingItems: { include: { ticketType: true } },
        payment: true,
      },
    });

    if (booking) {
      const item = booking.bookingItems[0];
      return NextResponse.json({
        booking: {
          bookingId: booking.id,
          bookingRef: booking.bookingRef,
          customerName: booking.customerName,
          customerEmail: booking.customerEmail,
          ticketType: item?.ticketType.name || "Single Pass",
          quantity: item?.quantity || 1,
          subtotalInPaise: booking.totalAmount,
          discountInPaise: Math.max(0, booking.totalAmount - booking.grandTotal),
          totalInPaise: booking.grandTotal,
          shoppingBenefitOptIn: booking.shoppingBenefitOptIn,
          notes: booking.notes,
          status: booking.status,
          eventDate: "14 October 2026, Wednesday",
          venue: "RS Open Ground, Beside Beldale Petrol Pump, Gumpa, Bidar",
        },
      });
    }
  } catch {
    /* fallback to demo response if DB is offline */
  }

  // Demo fallback
  return NextResponse.json({
    booking: {
      bookingId: id,
      bookingRef: "SSV-DANDIYA-DEMO01",
      customerName: "Guest Visitor",
      customerEmail: "guest@example.com",
      ticketType: "Single Pass",
      quantity: 1,
      totalInPaise: 29900,
      shoppingBenefitOptIn: true,
      status: "PENDING",
      eventDate: "14 October 2026, Wednesday",
      venue: "RS Open Ground, Beside Beldale Petrol Pump, Gumpa, Bidar",
    },
  });
}

import { BenefitChoiceSchema } from "@/validators";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await req.json();
    const parsed = BenefitChoiceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid benefit choice payload" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      select: { id: true, status: true, paymentStatus: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // STRICT SECURITY: Do NOT allow changing choice once booking is confirmed or paid!
    if (booking.status === "CONFIRMED" || booking.paymentStatus === "PAID") {
      return NextResponse.json(
        { error: "Cannot change benefit choice after payment confirmation" },
        { status: 400 }
      );
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        shoppingBenefitOptIn: parsed.data.shoppingBenefitOptIn,
      },
      select: {
        id: true,
        shoppingBenefitOptIn: true,
      },
    });

    return NextResponse.json({
      success: true,
      shoppingBenefitOptIn: updated.shoppingBenefitOptIn,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update benefit choice" },
      { status: 500 }
    );
  }
}
