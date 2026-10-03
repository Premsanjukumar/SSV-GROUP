import { prisma } from "@/lib/prisma";
import { formatDate, formatTime } from "@/lib/utils";

export interface TicketData {
  bookingId: string;
  reference: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  ticketType: string;
  quantity: number;
  totalInPaise: number;
  event: {
    name: string;
    venue: string;
    city: string;
    dateText: string;
    timeText: string;
  };
  tickets: {
    id: string;
    token: string;
    verifyUrl: string;
    checkedIn: boolean;
  }[];
}

/**
 * Authoritative ticket retrieval for digital ticket view & pass generation.
 */
export async function getTicketData(bookingId: string): Promise<TicketData | null> {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        event: true,
        tickets: true,
        bookingItems: { include: { ticketType: true } },
      },
    });

    if (booking) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const ticketTypeNames = booking.bookingItems
        .map((i) => i.ticketType?.name || "Pass")
        .join(", ");
      const totalQuantity = booking.bookingItems.reduce((sum, i) => sum + i.quantity, 0);

      return {
        bookingId: booking.id,
        reference: booking.bookingRef,
        name: booking.customerName,
        email: booking.customerEmail,
        phone: booking.customerPhone,
        status: booking.status,
        ticketType: ticketTypeNames || "General Pass",
        quantity: totalQuantity || 1,
        totalInPaise: booking.grandTotal,
        event: {
          name: booking.event?.name || "SSV Dandiya Divas 2026",
          venue: booking.event?.venue || "RS Open Ground, Beside Beldale Petrol Pump, Gumpa",
          city: booking.event?.city || "Bidar",
          dateText: formatDate(booking.event?.startDateTime || new Date("2026-10-14T18:00:00Z")),
          timeText: formatTime(booking.event?.startDateTime || new Date("2026-10-14T18:00:00Z")),
        },
        tickets: booking.tickets.map((t) => ({
          id: t.id,
          token: t.token,
          verifyUrl: `${baseUrl}/verify/${t.token}`,
          checkedIn: t.checkedIn,
        })),
      };
    }
  } catch (err) {
    console.warn("[getTicketData] Error querying booking:", err instanceof Error ? err.message : err);
  }

  return null;
}
