import nodemailer from "nodemailer";
import { formatCurrency } from "@/lib/utils";

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
}

function getEmailConfig(): EmailConfig | null {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } =
    process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  return {
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    user: SMTP_USER,
    pass: SMTP_PASS,
    from: EMAIL_FROM || "SSV Group <noreply@ssvgroup.in>",
  };
}

function createTransporter(config: EmailConfig) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
}

export interface BookingConfirmationData {
  customerName: string;
  customerEmail: string;
  bookingRef: string;
  ticketType: string;
  quantity: number;
  totalInPaise: number;
  eventDate: string;
  eventTime: string;
  venue: string;
  ticketUrl: string;
}

function buildConfirmationHTML(data: BookingConfirmationData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmed — SSV Dandiya Divas 2026</title>
  <style>
    body { margin: 0; padding: 0; background: #1a0505; font-family: Georgia, serif; }
    .container { max-width: 600px; margin: 0 auto; background: #fff; }
    .header { background: linear-gradient(135deg, #6D0B0B, #8B0000, #C0392B); padding: 40px 30px; text-align: center; }
    .header h1 { color: #D4A017; font-size: 28px; margin: 0; letter-spacing: 2px; }
    .header p { color: #FFF8DC; margin: 8px 0 0; font-size: 14px; letter-spacing: 3px; }
    .gold-bar { background: linear-gradient(90deg, #D4A017, #F5C842, #D4A017); height: 3px; }
    .body { padding: 40px 30px; background: #fff; }
    .greeting { font-size: 18px; color: #333; margin-bottom: 20px; }
    .booking-box { background: #FFF8F0; border: 2px solid #D4A017; border-radius: 12px; padding: 24px; margin: 24px 0; }
    .booking-ref { font-size: 24px; font-weight: bold; color: #8B0000; text-align: center; letter-spacing: 3px; margin-bottom: 20px; font-family: monospace; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; font-size: 15px; }
    .detail-label { color: #666; }
    .detail-value { color: #333; font-weight: 600; }
    .cta-button { display: block; background: linear-gradient(135deg, #8B0000, #C0392B); color: #D4A017; text-align: center; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: bold; letter-spacing: 1px; margin: 24px 0; }
    .instruction { background: #f0f8f0; border-left: 4px solid #2D5016; padding: 16px; border-radius: 4px; font-size: 14px; color: #444; }
    .footer { background: #1a0505; color: #888; text-align: center; padding: 30px; font-size: 13px; }
    .footer a { color: #D4A017; }
    .sponsor-note { color: #aaa; font-size: 12px; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎊 SSV GROUP</h1>
      <p>DANDIYA DIVAS 2026</p>
    </div>
    <div class="gold-bar"></div>
    <div class="body">
      <p class="greeting">Namaste, <strong>${data.customerName}</strong>! 🙏</p>
      <p style="color:#555; line-height:1.6;">
        Your booking for <strong>SSV Dandiya Divas 2026</strong> has been confirmed. 
        We're thrilled to have you join us for an unforgettable Navratri celebration!
      </p>

      <div class="booking-box">
        <div class="booking-ref">${data.bookingRef}</div>
        <div class="detail-row">
          <span class="detail-label">Event</span>
          <span class="detail-value">SSV Dandiya Divas 2026</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Date</span>
          <span class="detail-value">${data.eventDate}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Time</span>
          <span class="detail-value">${data.eventTime}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Venue</span>
          <span class="detail-value">${data.venue}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Ticket Type</span>
          <span class="detail-value">${data.ticketType}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Quantity</span>
          <span class="detail-value">${data.quantity}</span>
        </div>
        <div class="detail-row" style="border-bottom:none;">
          <span class="detail-label">Amount Paid</span>
          <span class="detail-value" style="color:#8B0000; font-size:18px;">${formatCurrency(data.totalInPaise)}</span>
        </div>
      </div>

      <a href="${data.ticketUrl}" class="cta-button">
        🎟️ VIEW YOUR DIGITAL TICKET
      </a>

      <div class="instruction">
        <strong>📱 Important:</strong> Please present your QR ticket at the entry gate. 
        You can view and download your ticket anytime at the link above. 
        A PDF version is also available on your ticket page.
      </div>

      <p style="margin-top:24px; color:#666; font-size:14px; line-height:1.6;">
        For any queries, contact us at:<br>
        📞 <strong>8618156721</strong> &nbsp;|&nbsp; <strong>9482629007</strong>
      </p>
    </div>
    <div class="gold-bar"></div>
    <div class="footer">
      <p>
        <strong style="color:#D4A017;">SSV GROUP</strong><br>
        Tradition • Music • Dance • Togetherness
      </p>
      <p class="sponsor-note">
        This email was sent to ${data.customerEmail} for booking ${data.bookingRef}.
        Please do not reply to this email.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export async function sendBookingConfirmation(
  data: BookingConfirmationData,
  pdfBuffer?: Buffer
): Promise<{ success: boolean; error?: string }> {
  const isMock =
    process.env.EMAIL_MODE === "mock" ||
    (!process.env.SMTP_HOST && process.env.NODE_ENV !== "production");

  if (isMock) {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        `[EMAIL:DEV-MOCK] Confirmation sent to ${data.customerEmail} for ${data.bookingRef}`
      );
    }
    return { success: true };
  }

  const config = getEmailConfig();

  if (!config) {
    console.warn(
      "[EMAIL] SMTP not configured — skipping confirmation email for booking:",
      data.bookingRef
    );
    return { success: false, error: "SMTP not configured" };
  }

  try {
    const transporter = createTransporter(config);
    const html = buildConfirmationHTML(data);

    const attachments = pdfBuffer
      ? [
          {
            filename: `SSV-Ticket-${data.bookingRef}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ]
      : [];

    await transporter.sendMail({
      from: config.from,
      to: data.customerEmail,
      subject: `✅ Booking Confirmed — SSV Dandiya Divas 2026 [${data.bookingRef}]`,
      html,
      attachments,
    });

    console.log(
      `[EMAIL] Confirmation sent to ${data.customerEmail} for ${data.bookingRef}`
    );
    return { success: true };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("[EMAIL] Failed to send confirmation:", msg);
    return { success: false, error: msg };
  }
}

export async function sendOtpEmail(
  email: string,
  otp: string
): Promise<{ success: boolean; error?: string }> {
  const isMock =
    process.env.EMAIL_MODE === "mock" ||
    (!process.env.SMTP_HOST && process.env.NODE_ENV !== "production");

  if (isMock) {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        `[EMAIL:DEV-MOCK] OTP for ${email}: ${otp} (expires in 5 minutes)`
      );
    }
    return { success: true };
  }

  const config = getEmailConfig();

  if (!config) {
    return { success: false, error: "SMTP service not configured in production." };
  }

  try {
    const transporter = createTransporter(config);
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Your Verification Code — SSV Dandiya Divas 2026</title>
  <style>
    body { font-family: Georgia, serif; background: #1a0505; margin: 0; padding: 0; }
    .box { max-width: 500px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #6D0B0B, #8B0000); padding: 30px; text-align: center; }
    .header h1 { color: #D4A017; margin: 0; font-size: 22px; letter-spacing: 2px; }
    .content { padding: 30px 25px; color: #333; }
    .otp-card { background: #FFF8F0; border: 2px dashed #D4A017; border-radius: 8px; text-align: center; padding: 20px; margin: 20px 0; }
    .otp-code { font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #8B0000; font-family: monospace; }
    .footer { text-align: center; color: #888; font-size: 12px; padding: 20px; background: #fdfdfd; }
  </style>
</head>
<body>
  <div class="box">
    <div class="header">
      <h1>🎊 SSV DANDIYA DIVAS 2026</h1>
    </div>
    <div class="content">
      <p style="font-size: 16px;">Namaste! 🙏</p>
      <p style="color: #555; line-height: 1.5;">Use the verification code below to securely log in and continue with your ticket booking:</p>
      
      <div class="otp-card">
        <div style="font-size: 12px; text-transform: uppercase; color: #8B0000; font-weight: bold; margin-bottom: 8px;">Your One-Time Password (OTP)</div>
        <div class="otp-code">${otp}</div>
      </div>

      <p style="color: #666; font-size: 13px;">⏱️ <strong>Note:</strong> This verification code expires in <strong>5 minutes</strong>. For your security, never share this code with anyone.</p>
    </div>
    <div class="footer">
      © 2026 SSV Group • Bidar, Karnataka • Secure Customer Authentication
    </div>
  </div>
</body>
</html>
    `.trim();

    await transporter.sendMail({
      from: config.from,
      to: email,
      subject: `🔐 ${otp} is your SSV Dandiya Divas Verification Code`,
      html,
    });

    return { success: true };
  } catch (error: any) {
    console.error("[EMAIL] OTP send error:", error?.message || error);
    return { success: false, error: error?.message || "Email send failed" };
  }
}

