import { prisma, BookingStatus, DeliveryStatus } from "@/lib/prisma";
import { generateTicketPDF } from "./pdf";
import { sendBookingConfirmation } from "./email";
import { sendBookingSms } from "./sms";
import { sendBookingWhatsApp } from "./whatsapp";
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
    const verifyUrl = firstTicket
      ? `${baseUrl}/ticket/${booking.id}`
      : `${baseUrl}/booking/success?bookingId=${booking.id}`;

    const formattedDate = formatDate(booking.event.startDateTime);
    const formattedTime = formatTime(booking.event.startDateTime);
    const venueStr = `${booking.event.venue}, ${booking.event.city}`;

    // 1. Generate PDF Ticket
    const pdfData = {
      bookingRef: booking.bookingRef,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
      ticketType,
      quantity,
      totalInPaise: booking.grandTotal,
      eventName: booking.event.name,
      eventDate: formattedDate,
      eventTime: formattedTime,
      venue: venueStr,
      verifyUrl,
      status: "CONFIRMED",
    };

    const pdfBuffer = await generateTicketPDF(pdfData).catch((e: any) => {
      console.error("[pdf] failed to generate PDF:", e?.message || e);
      return null;
    });

    // 2. Dispatch Email Confirmation & Track Status
    const emailData = {
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      bookingRef: booking.bookingRef,
      ticketType,
      quantity,
      totalInPaise: booking.grandTotal,
      eventDate: formattedDate,
      eventTime: formattedTime,
      venue: venueStr,
      ticketUrl: verifyUrl,
    };

    const emailRes = await sendBookingConfirmation(
      emailData,
      pdfBuffer || undefined
    );

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        emailDeliveryStatus: emailRes.success
          ? DeliveryStatus.SENT
          : DeliveryStatus.FAILED,
        emailSentAt: emailRes.success ? new Date() : undefined,
        emailError: emailRes.error || null,
      },
    });

    // 3. Dispatch SMS Confirmation & Track Status
    const smsRes = await sendBookingSms(booking.customerPhone, {
      bookingRef: booking.bookingRef,
      ticketType,
      eventDate: formattedDate,
      ticketUrl: verifyUrl,
    });

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        smsDeliveryStatus: smsRes.success
          ? DeliveryStatus.SENT
          : DeliveryStatus.FAILED,
        smsSentAt: smsRes.success ? new Date() : undefined,
        smsProviderId: smsRes.providerId || null,
        smsError: smsRes.error || null,
      },
    });

    // 4. Dispatch WhatsApp if customer already opted-in
    if (booking.whatsappOptIn) {
      const waRes = await sendBookingWhatsApp(booking.customerPhone, {
        customerName: booking.customerName,
        bookingRef: booking.bookingRef,
        ticketType,
        quantity,
        eventDate: formattedDate,
        venue: venueStr,
        ticketUrl: verifyUrl,
      });

      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          whatsappDeliveryStatus: waRes.success
            ? DeliveryStatus.SENT
            : DeliveryStatus.FAILED,
          whatsappSentAt: waRes.success ? new Date() : undefined,
          whatsappProviderId: waRes.providerId || null,
          whatsappError: waRes.error || null,
        },
      });
    }
  } catch (e: any) {
    console.error("[postConfirm]", e instanceof Error ? e.message : "unknown");
  }
}
