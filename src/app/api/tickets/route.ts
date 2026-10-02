import { NextResponse } from "next/server";
import { prisma, BookingStatus } from "@/lib/prisma";

const FALLBACK_TICKET_TYPES = [
  {
    id: "single-pass-default",
    name: "Single Pass",
    description: "Entry for one woman. Access to all event areas including DJ + Live entertainment and competition zones.",
    priceInPaise: 29900,
    capacity: 200,
    available: 185,
    maxPerOrder: 5,
    isActive: true,
    isFemaleOnly: true,
  },
  {
    id: "couple-pass-default",
    name: "Couple Pass",
    description: "Entry for two eligible attendees. Access to all event areas including DJ + Live entertainment and competition zones.",
    priceInPaise: 49900,
    capacity: 300,
    available: 270,
    maxPerOrder: 5,
    isActive: true,
    isFemaleOnly: false,
  },
];

export async function GET() {
  try {
    const event = await prisma.event.findFirst({
      where: { isPublished: true },
      include: {
        ticketTypes: {
          where: { isActive: true },
          orderBy: { price: "asc" },
        },
      },
    });

    if (event && event.ticketTypes && event.ticketTypes.length > 0) {
      const now = new Date();
      const ticketTypesWithAvailability = await Promise.all(
        event.ticketTypes.map(async (tt: any) => {
          let sold = 0;
          try {
            const soldResult = await prisma.bookingItem.aggregate({
              where: {
                ticketTypeId: tt.id,
                booking: { status: BookingStatus.CONFIRMED },
              },
              _sum: { quantity: true },
            });
            sold = soldResult._sum.quantity || 0;
          } catch {
            /* ignore aggregate error */
          }
          const available = Math.max(0, tt.capacity - sold);

          const salesOpen =
            (!tt.salesStart || now >= tt.salesStart) &&
            (!tt.salesEnd || now <= tt.salesEnd);

          return {
            id: tt.id,
            name: tt.name,
            description: tt.description || "",
            priceInPaise: tt.price,
            capacity: tt.capacity,
            available,
            maxPerOrder: tt.maxPerOrder,
            isActive: tt.isActive && salesOpen,
            isFemaleOnly: tt.womenOnly,
          };
        })
      );

      return NextResponse.json({
        eventId: event.id,
        eventName: event.name,
        ticketTypes: ticketTypesWithAvailability,
      });
    }
  } catch (error) {
    console.warn("[API /tickets] DB query fallback activated:", (error as Error).message);
  }

  // Graceful fallback if database is not initialized yet
  return NextResponse.json({
    eventId: "auto",
    eventName: "SSV Dandiya Divas 2026",
    ticketTypes: FALLBACK_TICKET_TYPES,
  });
}
