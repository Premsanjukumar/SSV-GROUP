import { prisma, BookingStatus } from "@/lib/prisma";
import { generateTicketPDF } from "./pdf";
import { sendBookingConfirmation } from "./email";
import { formatDate, formatTime } from "@/lib/utils";

// Runs after a payment is confirmed. Never throws: a failed email or PDF must not undo a paid booking.
export async function afterPayment(bookingId: string) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        event: true,
        bookingItems: { include: { ticketType: true } },
        tickets: true,
      },
    });

    if (!booking || booking.status !== BookingStatus.CONFIRMED) return;
    if (booking.confirmedAt) return; // already sent/processed

    await prisma.booking.update({
      where: { id: bookingId },
      data: { confirmedAt: new Date() },
    });

    const ticketItem = booking.bookingItems[0];
    const ticketType = ticketItem?.ticketType.name || "Pass";
    const quantity = ticketItem?.quantity || 1;
    const firstTicket = booking.tickets[0];

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verifyUrl = firstTicket ? `${baseUrl}/verify/${firstTicket.token}` : `${baseUrl}/booking/success?ref=${booking.bookingRef}`;

    const pdfData = {
      bookingRef: booking.bookingRef,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
      ticketType,
      quantity,
      totalInPaise: booking.grandTotal,
      eventName: booking.event.name,
      eventDate: formatDate(booking.event.startDateTime),
      eventTime: formatTime(booking.event.startDateTime),
      venue: `${booking.event.venue}, ${booking.event.city}`,
      verifyUrl,
      status: "CONFIRMED",
    };

    const pdfBuffer = await generateTicketPDF(pdfData).catch((e: any) => {
      console.error("[pdf] failed to generate PDF:", e?.message || e);
      return null;
    });

    const emailData = {
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      bookingRef: booking.bookingRef,
      ticketType,
      quantity,
      totalInPaise: booking.grandTotal,
      eventDate: formatDate(booking.event.startDateTime),
      eventTime: formatTime(booking.event.startDateTime),
      venue: `${booking.event.venue}, ${booking.event.city}`,
      ticketUrl: verifyUrl,
    };

    await sendBookingConfirmation(emailData, pdfBuffer || undefined);
  } catch (e: any) {
    console.error("[postConfirm]", e instanceof Error ? e.message : "unknown");
  }
}
