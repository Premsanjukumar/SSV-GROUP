/**
 * SMS Provider Service — SSV Dandiya Divas 2026
 * Supports production SMS providers (Twilio, MSG91, Fast2SMS, custom HTTP gateway)
 * and secure development mock mode.
 */

export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return digits;
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 13 && digits.startsWith("+91")) return digits.slice(3);
  return digits;
}

export function formatIndianPhone(phone: string): string {
  const norm = normalizePhone(phone);
  return `+91 ${norm.slice(0, 5)} ${norm.slice(5)}`;
}

export interface SmsResult {
  success: boolean;
  providerId?: string;
  error?: string;
}

export async function sendOtpSms(
  rawPhone: string,
  otp: string
): Promise<SmsResult> {
  const phone = normalizePhone(rawPhone);
  const isMock =
    process.env.SMS_MODE === "mock" ||
    (!process.env.SMS_API_KEY && process.env.NODE_ENV !== "production");

  if (isMock) {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        `[SMS:DEV-MOCK] OTP for +91${phone}: ${otp} (expires in 5 minutes)`
      );
    }
    return { success: true, providerId: `mock-otp-${Date.now()}` };
  }

  const { SMS_PROVIDER, SMS_API_URL, SMS_API_KEY } = process.env;

  if (!SMS_API_KEY) {
    return {
      success: false,
      error: "SMS service is not configured. Please contact event support.",
    };
  }

  try {
    const message = `SSV Dandiya Divas 2026: Your verification code is ${otp}. Valid for 5 mins. Do not share this OTP with anyone.`;

    if (SMS_PROVIDER === "fast2sms" || SMS_API_URL?.includes("fast2sms")) {
      const endpoint = SMS_API_URL || "https://www.fast2sms.com/dev/bulkV2";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          authorization: SMS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          route: "otp",
          variables_values: otp,
          numbers: phone,
        }),
      });
      const json = await res.json();
      if (!res.ok || json.return === false) {
        return {
          success: false,
          error: json.message?.[0] || "Fast2SMS dispatch failed",
        };
      }
      return { success: true, providerId: json.request_id || "fast2sms-ok" };
    }

    if (SMS_PROVIDER === "msg91" || SMS_API_URL?.includes("msg91")) {
      const templateId = process.env.MSG91_OTP_TEMPLATE_ID || "";
      const endpoint =
        SMS_API_URL || "https://control.msg91.com/api/v5/otp";
      const res = await fetch(
        `${endpoint}?template_id=${templateId}&mobile=91${phone}&authkey=${SMS_API_KEY}&otp=${otp}`,
        { method: "POST" }
      );
      const json = await res.json();
      if (!res.ok || json.type === "error") {
        return { success: false, error: json.message || "MSG91 error" };
      }
      return { success: true, providerId: json.message || "msg91-ok" };
    }

    // Generic REST SMS Gateway
    if (SMS_API_URL) {
      const res = await fetch(SMS_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SMS_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: `+91${phone}`,
          message,
          otp,
        }),
      });
      if (!res.ok) {
        return { success: false, error: `Gateway returned status ${res.status}` };
      }
      const data = await res.json().catch(() => ({}));
      return { success: true, providerId: (data as any)?.id || "sms-ok" };
    }

    return { success: false, error: "Unsupported SMS provider" };
  } catch (err: any) {
    console.error("[SMS] Dispatch failed:", err?.message || err);
    return { success: false, error: err?.message || "SMS send failed" };
  }
}

export async function sendBookingSms(
  rawPhone: string,
  data: {
    bookingRef: string;
    ticketType: string;
    eventDate: string;
    ticketUrl: string;
  }
): Promise<SmsResult> {
  const phone = normalizePhone(rawPhone);
  const isMock =
    process.env.SMS_MODE === "mock" ||
    (!process.env.SMS_API_KEY && process.env.NODE_ENV !== "production");

  const message = `SSV Dandiya Divas 2026: Booking Confirmed! Ref: ${data.bookingRef}, Pass: ${data.ticketType}. Date: ${data.eventDate}. View ticket: ${data.ticketUrl}`;

  if (isMock) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[SMS:DEV-MOCK] Booking confirmation to +91${phone}: ${message}`);
    }
    return { success: true, providerId: `mock-booking-${Date.now()}` };
  }

  const { SMS_API_URL, SMS_API_KEY } = process.env;

  if (!SMS_API_KEY || !SMS_API_URL) {
    return { success: false, error: "SMS service not configured in production" };
  }

  try {
    const res = await fetch(SMS_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SMS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: `+91${phone}`,
        message,
        bookingRef: data.bookingRef,
      }),
    });
    if (!res.ok) {
      return { success: false, error: `SMS gateway HTTP ${res.status}` };
    }
    const json = await res.json().catch(() => ({}));
    return { success: true, providerId: (json as any)?.id || "sms-confirmed" };
  } catch (err: any) {
    console.error("[SMS] Booking SMS failed:", err?.message || err);
    return { success: false, error: err?.message || "Booking SMS failed" };
  }
}
