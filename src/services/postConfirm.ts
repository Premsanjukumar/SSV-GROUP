import { prisma, BookingStatus, DeliveryStatus } from "@/lib/prisma";
import { generateTicketPDF } from "./pdf";
import { sendBookingConfirmation } from "./email";
import { sendBookingSms } from "./sms";
import { sendBookingWhatsApp } from "./whatsapp";
import { formatDate, formatTime } from "@/lib/utils";

// ============================================================
// DECOUPLED POST-PAYMENT DELIVERY SERVICE
// Dispatches tickets, transactional emails, SMS, and WhatsApp.
// Delivery status is tracked independently per channel.
// Failures NEVER undo confirmed payments.
// ============================================================

export interface DeliveryResult {
  emailSent: boolean;
  smsSent: boolean;
  whatsappSent: boolean;
}

/**
 * Executes post-payment asynchronous fulfillment (Email, SMS, WhatsApp).
 * Safe and decoupled: uses channel-specific delivery status guards.
 */
export async function afterPayment(
  bookingId: string,
  options: { forceEmailResend?: boolean } = {}
): Promise<DeliveryResult> {
  const result: DeliveryResult = {
    emailSent: false,
    smsSent: false,
    whatsappSent: false,
  };

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        event: true,
        bookingItems: { include: { ticketType: true } },
        tickets: { orderBy: { createdAt: "asc" } },
        payment: true,
        coupons: {
          where: { type: "SHOPPING_BENEFIT_200" },
          take: 1,
        },
      },
    });

    if (!booking || booking.status !== BookingStatus.CONFIRMED) {
      console.warn(`[postConfirm] Booking ${bookingId} is not confirmed. Skipping delivery.`);
      return result;
    }

    const ticketItem = booking.bookingItems[0];
    const ticketType = ticketItem?.ticketType?.name || "Single Pass";
    const quantity = ticketItem?.quantity || 1;
    const firstTicket = booking.tickets[0];

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const ticketUrl = firstTicket
      ? `${baseUrl}/ticket/${booking.id}`
      : `${baseUrl}/booking/success?bookingId=${booking.id}`;
    const qrVerifyUrl = firstTicket
      ? `${baseUrl}/verify/${firstTicket.token}`
      : ticketUrl;

    const formattedDate = formatDate(booking.event.startDateTime);
    const formattedTime = formatTime(booking.event.startDateTime);
    const venueStr = `${booking.event.venue}, ${booking.event.city}`;
    const couponCode = booking.coupons?.[0]?.code || null;
    const paymentId =
      booking.razorpayPaymentId ||
      booking.payment?.razorpayPaymentId ||
      "Confirmed via Razorpay";

    // 1. GENERATE PDF TICKET (Reuses existing tickets, embeds secure verify QR)
    let pdfBuffer: Buffer | null = null;
    try {
      pdfBuffer = await generateTicketPDF({
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
        verifyUrl: qrVerifyUrl,
        status: "CONFIRMED",
        shoppingBenefitOptIn: booking.shoppingBenefitOptIn,
        couponCode,
      });
    } catch (pdfErr) {
      console.error("[postConfirm] PDF ticket generation error:", pdfErr instanceof Error ? pdfErr.message : pdfErr);
    }

    // 2. TRANSACTIONAL EMAIL CONFIRMATION (Atomic idempotency + safe error handling)
    const shouldSendEmail =
      booking.customerEmail &&
      (options.forceEmailResend || booking.emailDeliveryStatus !== DeliveryStatus.SENT);

    if (shouldSendEmail) {
      // Atomic claim to prevent double-sends under concurrent webhook + client verify calls
      if (!options.forceEmailResend) {
        const claim = await prisma.booking.updateMany({
          where: {
            id: bookingId,
            emailDeliveryStatus: { notIn: [DeliveryStatus.SENT, DeliveryStatus.QUEUED] },
          },
          data: {
            emailDeliveryStatus: DeliveryStatus.QUEUED,
          },
        });

        // If another process already claimed or sent the email, skip duplicate send
        if (claim.count === 0 && booking.emailDeliveryStatus === DeliveryStatus.SENT) {
          result.emailSent = true;
          return result;
        }
      }

      try {
        const emailRes = await sendBookingConfirmation(
          {
            customerName: booking.customerName,
            customerEmail: booking.customerEmail,
            bookingRef: booking.bookingRef,
            ticketType,
            quantity,
            totalInPaise: booking.grandTotal,
            paymentId,
            eventDate: "14 October 2026",
            eventDay: "Wednesday",
            eventTime: "5:00 PM – 10:00 PM",
            venue: "RS Open Ground, Beside Beldale Petrol Pump, Gumpa, Bidar",
            specialAttraction: "SP POWER",
            ticketUrl,
            shoppingBenefitOptIn: booking.shoppingBenefitOptIn,
            couponCode,
          },
          pdfBuffer || undefined
        );

        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            emailDeliveryStatus: emailRes.success ? DeliveryStatus.SENT : DeliveryStatus.FAILED,
            emailSentAt: emailRes.success ? new Date() : undefined,
            emailError: emailRes.error || null,
          },
        });

        result.emailSent = Boolean(emailRes.success);
      } catch (emailErr) {
        const msg = emailErr instanceof Error ? emailErr.message : "Email sending failed";
        console.error("[postConfirm] Email delivery failed:", msg);
        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            emailDeliveryStatus: DeliveryStatus.FAILED,
            emailError: msg,
          },
        }).catch(() => null);
      }
    } else if (booking.emailDeliveryStatus === DeliveryStatus.SENT) {
      result.emailSent = true;
    }

    // 3. TRANSACTIONAL SMS CONFIRMATION
    if (booking.smsDeliveryStatus !== DeliveryStatus.SENT && booking.customerPhone) {
      try {
        const smsRes = await sendBookingSms(booking.customerPhone, {
          bookingRef: booking.bookingRef,
          ticketType,
          eventDate: formattedDate,
          ticketUrl,
        });

        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            smsDeliveryStatus: smsRes.success ? DeliveryStatus.SENT : DeliveryStatus.FAILED,
            smsSentAt: smsRes.success ? new Date() : undefined,
            smsProviderId: smsRes.providerId || null,
            smsError: smsRes.error || null,
          },
        });

        result.smsSent = Boolean(smsRes.success);
      } catch (smsErr) {
        const msg = smsErr instanceof Error ? smsErr.message : "SMS sending failed";
        console.error("[postConfirm] SMS delivery failed:", msg);
        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            smsDeliveryStatus: DeliveryStatus.FAILED,
            smsError: msg,
          },
        }).catch(() => null);
      }
    } else if (booking.smsDeliveryStatus === DeliveryStatus.SENT) {
      result.smsSent = true;
    }

    // 4. TRANSACTIONAL WHATSAPP CONFIRMATION (Explicit customer opt-in required)
    if (booking.whatsappOptIn && booking.whatsappDeliveryStatus !== DeliveryStatus.SENT && booking.customerPhone) {
      try {
        const waRes = await sendBookingWhatsApp(booking.customerPhone, {
          customerName: booking.customerName,
          bookingRef: booking.bookingRef,
          ticketType,
          quantity,
          eventDate: formattedDate,
          venue: venueStr,
          ticketUrl,
        });

        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            whatsappDeliveryStatus: waRes.success ? DeliveryStatus.SENT : DeliveryStatus.FAILED,
            whatsappSentAt: waRes.success ? new Date() : undefined,
            whatsappProviderId: waRes.providerId || null,
            whatsappError: waRes.error || null,
          },
        });

        result.whatsappSent = Boolean(waRes.success);
      } catch (waErr) {
        const msg = waErr instanceof Error ? waErr.message : "WhatsApp delivery failed";
        console.error("[postConfirm] WhatsApp delivery failed:", msg);
        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            whatsappDeliveryStatus: DeliveryStatus.FAILED,
            whatsappError: msg,
          },
        }).catch(() => null);
      }
    } else if (booking.whatsappDeliveryStatus === DeliveryStatus.SENT) {
      result.whatsappSent = true;
    }
  } catch (err) {
    console.error("[postConfirm] Unexpected processing error:", err instanceof Error ? err.message : err);
  }

  return result;
}
