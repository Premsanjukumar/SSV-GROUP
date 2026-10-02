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
          totalInPaise: booking.grandTotal,
          status: booking.status,
          eventDate: "14 October 2026, Wednesday",
          venue: "Beside Beladale Petrol Pump, Gumpa, Bidar",
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
      status: "PENDING",
      eventDate: "14 October 2026, Wednesday",
      venue: "Beside Beladale Petrol Pump, Gumpa, Bidar",
    },
  });
}
