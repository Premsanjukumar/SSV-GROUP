/**
 * WhatsApp Business API Service — SSV Dandiya Divas 2026
 * Handles opt-in WhatsApp ticket message delivery with production providers and dev mock.
 */

import { normalizePhone } from "./sms";

export interface WhatsAppResult {
  success: boolean;
  providerId?: string;
  error?: string;
}

export interface BookingWhatsAppPayload {
  customerName: string;
  bookingRef: string;
  ticketType: string;
  quantity: number;
  eventDate: string;
  venue: string;
  ticketUrl: string;
}

export async function sendBookingWhatsApp(
  rawPhone: string,
  data: BookingWhatsAppPayload
): Promise<WhatsAppResult> {
  const phone = normalizePhone(rawPhone);
  const isMock =
    process.env.WHATSAPP_MODE === "mock" ||
    (!process.env.WHATSAPP_API_KEY && process.env.NODE_ENV !== "production");

  const formattedMsg = `🎉 *SSV Dandiya Divas 2026 — Ticket Confirmation*

Namaste ${data.customerName}! 🙏

Your booking has been successfully confirmed:
• *Booking ID:* ${data.bookingRef}
• *Pass Type:* ${data.ticketType} (Qty: ${data.quantity})
• *Date:* ${data.eventDate} (5:00 PM Onwards)
• *Venue:* ${data.venue}

🎟️ *View & Download QR Ticket:*
${data.ticketUrl}

_Please present the QR code at the entrance gate._
SSV Group • Bidar, Karnataka`;

  if (isMock) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[WHATSAPP:DEV-MOCK] Sent to +91${phone}:\n${formattedMsg}`);
    }
    return { success: true, providerId: `mock-wa-${Date.now()}` };
  }

  const {
    WHATSAPP_PROVIDER,
    WHATSAPP_API_URL,
    WHATSAPP_API_KEY,
    WHATSAPP_PHONE_NUMBER_ID,
  } = process.env;

  if (!WHATSAPP_API_KEY) {
    return {
      success: false,
      error: "WhatsApp Business API is not configured in production.",
    };
  }

  try {
    // Meta / Cloud API Provider
    if (
      WHATSAPP_PROVIDER === "meta" ||
      WHATSAPP_API_URL?.includes("graph.facebook.com")
    ) {
      const phoneId = WHATSAPP_PHONE_NUMBER_ID || "me";
      const endpoint =
        WHATSAPP_API_URL ||
        `https://graph.facebook.com/v20.0/${phoneId}/messages`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: `91${phone}`,
          type: "text",
          text: { body: formattedMsg },
        }),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        return {
          success: false,
          error: json.error?.message || "Meta WhatsApp API error",
        };
      }
      return {
        success: true,
        providerId: json.messages?.[0]?.id || "meta-wa-ok",
      };
    }

    // Generic WhatsApp Gateway
    if (WHATSAPP_API_URL) {
      const res = await fetch(WHATSAPP_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: `+91${phone}`,
          message: formattedMsg,
          data,
        }),
      });
      if (!res.ok) {
        return { success: false, error: `WhatsApp gateway HTTP ${res.status}` };
      }
      const json = await res.json().catch(() => ({}));
      return { success: true, providerId: (json as any)?.id || "wa-ok" };
    }

    return { success: false, error: "Unsupported WhatsApp provider" };
  } catch (err: any) {
    console.error("[WHATSAPP] Dispatch error:", err?.message || err);
    return { success: false, error: err?.message || "WhatsApp send failed" };
  }
}
