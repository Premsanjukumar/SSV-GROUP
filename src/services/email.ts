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

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
}

function getEmailConfig(): EmailConfig | null {
  const host = process.env.SMTP_HOST || (process.env.SMTP_USER ? "smtp.gmail.com" : "");
  const port = parseInt(process.env.SMTP_PORT || "587");
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS || "";
  const from =
    process.env.SMTP_FROM ||
    process.env.EMAIL_FROM ||
    `SSV Group <${user || "noreply@ssvgroup.in"}>`;

  if (!host || !user || !pass) {
    return null;
  }

  return { host, port, secure, user, pass, from };
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
  paymentId?: string;
  eventDate?: string;
  eventDay?: string;
  eventTime?: string;
  venue?: string;
  specialAttraction?: string;
  ticketUrl: string;
  shoppingBenefitOptIn?: boolean;
  couponCode?: string | null;
}

function buildConfirmationHTML(data: BookingConfirmationData): string {
  const dateStr = data.eventDate || "14 October 2026";
  const dayStr = data.eventDay || "Wednesday";
  const timeStr = data.eventTime || "5:00 PM – 10:00 PM";
  const venueStr =
    data.venue || "RS Open Ground, Beside Beldale Petrol Pump, Gumpa, Bidar";
  const attractionStr = data.specialAttraction || "SP POWER";
  const paymentIdStr = data.paymentId || "Confirmed via Razorpay";
  const amountStr = formatCurrency(data.totalInPaise);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🎉 Your SSV GROUP Dandiya Divas 2026 Ticket is Confirmed!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #120202; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #120202; padding: 20px 0;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.5);">
          
          <!-- Festive Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #6D0B0B 0%, #8B0000 50%, #B22222 100%); padding: 36px 24px; text-align: center;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; padding: 4px 14px; background: rgba(212,160,23,0.2); border: 1px solid #D4A017; border-radius: 20px; color: #F5C842; font-size: 11px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px;">
                      Official Ticket Confirmation
                    </div>
                    <h1 style="color: #F5C842; font-size: 26px; font-weight: 800; margin: 0 0 6px 0; letter-spacing: 2px; text-transform: uppercase;">
                      SSV GROUP
                    </h1>
                    <p style="color: #FFF8DC; font-size: 16px; font-weight: 700; margin: 0 0 16px 0; letter-spacing: 3px; text-transform: uppercase;">
                      DANDIYA DIVAS 2026
                    </p>
                    <div style="background-color: #27ae60; color: #ffffff; display: inline-block; padding: 8px 20px; border-radius: 50px; font-size: 13px; font-weight: bold; letter-spacing: 1px; box-shadow: 0 2px 8px rgba(39,174,96,0.3);">
                      🎉 BOOKING CONFIRMED
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Gold Accent Bar -->
          <tr>
            <td style="background: linear-gradient(90deg, #D4A017, #F5C842, #D4A017); height: 4px; font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

          <!-- Email Content Body -->
          <tr>
            <td style="padding: 32px 28px; color: #2D3748;">
              <p style="font-size: 17px; line-height: 1.5; color: #1a202c; margin: 0 0 16px 0;">
                Hello <strong>${data.customerName}</strong>,
              </p>
              <p style="font-size: 15px; line-height: 1.6; color: #4a5568; margin: 0 0 24px 0;">
                Your ticket booking for <strong>SSV GROUP Dandiya Divas 2026</strong> has been successfully confirmed.
              </p>

              <!-- EVENT DETAILS SECTION -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px; border-radius: 10px; overflow: hidden; border: 1px solid #E2E8F0; background-color: #FAFAFA;">
                <tr>
                  <td style="background-color: #6D0B0B; padding: 10px 16px;">
                    <span style="color: #F5C842; font-size: 12px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase;">
                      📅 EVENT DETAILS
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="35%" style="padding: 6px 0; font-size: 13px; color: #718096; font-weight: 600;">Date:</td>
                        <td width="65%" style="padding: 6px 0; font-size: 14px; color: #1A202C; font-weight: 700;">${dateStr}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #718096; font-weight: 600;">Day:</td>
                        <td style="padding: 6px 0; font-size: 14px; color: #1A202C; font-weight: 700;">${dayStr}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #718096; font-weight: 600;">Time:</td>
                        <td style="padding: 6px 0; font-size: 14px; color: #1A202C; font-weight: 700;">${timeStr}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #718096; font-weight: 600; vertical-align: top;">Venue:</td>
                        <td style="padding: 6px 0; font-size: 14px; color: #1A202C; font-weight: 600; line-height: 1.4;">${venueStr}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #718096; font-weight: 600;">Special Attraction:</td>
                        <td style="padding: 6px 0; font-size: 14px; color: #B22222; font-weight: 800;">${attractionStr}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- BOOKING DETAILS SECTION -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px; border-radius: 10px; overflow: hidden; border: 1px solid #D4A017; background-color: #FFFDF9;">
                <tr>
                  <td style="background: linear-gradient(90deg, #D4A017, #B8860B); padding: 10px 16px;">
                    <span style="color: #1a0505; font-size: 12px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase;">
                      🎟️ BOOKING DETAILS
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="35%" style="padding: 6px 0; font-size: 13px; color: #718096; font-weight: 600;">Booking ID:</td>
                        <td width="65%" style="padding: 6px 0; font-size: 15px; color: #6D0B0B; font-weight: 800; font-family: monospace; letter-spacing: 1px;">${data.bookingRef}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #718096; font-weight: 600;">Ticket Type:</td>
                        <td style="padding: 6px 0; font-size: 14px; color: #1A202C; font-weight: 700;">${data.ticketType}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #718096; font-weight: 600;">Quantity:</td>
                        <td style="padding: 6px 0; font-size: 14px; color: #1A202C; font-weight: 700;">${data.quantity}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #718096; font-weight: 600;">Amount Paid:</td>
                        <td style="padding: 6px 0; font-size: 16px; color: #27ae60; font-weight: 800;">${amountStr}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 13px; color: #718096; font-weight: 600;">Payment ID:</td>
                        <td style="padding: 6px 0; font-size: 13px; color: #4A5568; font-weight: 600; font-family: monospace;">${paymentIdStr}</td>
                      </tr>
                      ${
                        data.shoppingBenefitOptIn !== false && data.couponCode
                          ? `
                      <tr>
                        <td style="padding: 8px 0 0 0; font-size: 13px; color: #047857; font-weight: 600;" colspan="2">
                          <div style="background-color: #ECFDF5; border: 1px dashed #10B981; border-radius: 6px; padding: 10px; margin-top: 8px;">
                            <strong style="color: #065F46;">🎁 Foreign Fits ₹200 Shopping Benefit:</strong><br>
                            Use Coupon Code: <strong style="font-family: monospace; color: #047857; font-size: 14px;">${data.couponCode}</strong>
                          </div>
                        </td>
                      </tr>
                      `
                          : ""
                      }
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Notice on PDF Attachment and QR -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px; background-color: #F7FAFC; border-left: 4px solid #6D0B0B; border-radius: 4px;">
                <tr>
                  <td style="padding: 14px 16px;">
                    <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 700; color: #1A202C;">
                      📎 The PDF ticket is attached to this email.
                    </p>
                    <p style="margin: 0; font-size: 13px; color: #4A5568; line-height: 1.5;">
                      Please keep the ticket/QR code safely and show it at the event entry when requested. You can also view or download your ticket anytime via the link below:
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Action Button -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 28px;">
                <tr>
                  <td align="center">
                    <a href="${data.ticketUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #6D0B0B 0%, #8B0000 100%); color: #F5C842; font-size: 15px; font-weight: 800; text-decoration: none; padding: 14px 28px; border-radius: 8px; border: 1px solid #D4A017; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(109,11,11,0.25);">
                      🎟️ VIEW YOUR DIGITAL TICKET
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 14px; color: #4A5568; line-height: 1.6; margin: 0 0 8px 0;">
                Thank you for choosing <strong>SSV GROUP</strong>.
              </p>
              <p style="font-size: 15px; font-weight: 700; color: #6D0B0B; margin: 0 0 24px 0;">
                See you at Dandiya Divas 2026! 🎉
              </p>

              <!-- Helpline Contact -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid #E2E8F0; padding-top: 16px;">
                <tr>
                  <td style="font-size: 12px; color: #718096; line-height: 1.5;">
                    Need assistance? Contact the organizing team:<br>
                    📞 <strong>8618156721</strong> &nbsp;|&nbsp; <strong>9482629007</strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #120202; color: #A0AEC0; padding: 24px; text-align: center; font-size: 12px; line-height: 1.6;">
              <p style="margin: 0 0 6px 0; color: #F5C842; font-weight: 700; letter-spacing: 1px;">
                SSV GROUP • DANDIYA DIVAS 2026
              </p>
              <p style="margin: 0 0 6px 0; color: #CBD5E0;">
                RS Open Ground, Beside Beldale Petrol Pump, Gumpa, Bidar
              </p>
              <p style="margin: 0; color: #718096; font-size: 11px;">
                This ticket confirmation was sent to ${data.customerEmail} for Booking ID ${data.bookingRef}.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function buildConfirmationText(data: BookingConfirmationData): string {
  const dateStr = data.eventDate || "14 October 2026";
  const dayStr = data.eventDay || "Wednesday";
  const timeStr = data.eventTime || "5:00 PM – 10:00 PM";
  const venueStr =
    data.venue || "RS Open Ground, Beside Beldale Petrol Pump, Gumpa, Bidar";
  const attractionStr = data.specialAttraction || "SP POWER";
  const paymentIdStr = data.paymentId || "Confirmed via Razorpay";
  const amountStr = formatCurrency(data.totalInPaise);

  let text = `
SSV GROUP
DANDIYA DIVAS 2026

🎉 BOOKING CONFIRMED

Hello ${data.customerName},

Your ticket booking for SSV GROUP Dandiya Divas 2026 has been successfully confirmed.

EVENT DETAILS

Date:
${dateStr}

Day:
${dayStr}

Time:
${timeStr}

Venue:
${venueStr}

Special Attraction:
${attractionStr}

BOOKING DETAILS

Booking ID:
${data.bookingRef}

Ticket Type:
${data.ticketType}

Quantity:
${data.quantity}

Amount Paid:
${amountStr}

Payment ID:
${paymentIdStr}
`;

  if (data.shoppingBenefitOptIn !== false && data.couponCode) {
    text += `
Foreign Fits Shopping Benefit:
Coupon Code: ${data.couponCode}
(Redeem ₹200 at Foreign Fits imported fashion store)
`;
  }

  text += `
The PDF ticket is attached to this email.

Please keep the ticket/QR code safely and show it at the event entry when requested.

View your digital ticket online:
${data.ticketUrl}

Thank you for choosing SSV GROUP.

See you at Dandiya Divas 2026! 🎉

Support: 8618156721 | 9482629007
`;

  return text.trim();
}

export async function sendBookingConfirmation(
  data: BookingConfirmationData,
  pdfBuffer?: Buffer
): Promise<{ success: boolean; error?: string }> {
  const config = getEmailConfig();

  // If SMTP is not configured in development or test, log safely and succeed
  const isMock =
    process.env.EMAIL_MODE === "mock" ||
    (!config && process.env.NODE_ENV !== "production");

  if (isMock) {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        `[EMAIL:DEV-MOCK] Confirmation sent to ${data.customerEmail} for booking ${data.bookingRef} (PDF attached: ${Boolean(pdfBuffer)})`
      );
    }
    return { success: true };
  }

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
    const text = buildConfirmationText(data);

    const attachments = pdfBuffer
      ? [
          {
            filename: `SSV-Dandiya-Divas-2026-Ticket-${data.bookingRef}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ]
      : [];

    await transporter.sendMail({
      from: config.from,
      to: data.customerEmail,
      subject: "🎉 Your SSV GROUP Dandiya Divas 2026 Ticket is Confirmed!",
      text,
      html,
      attachments,
    });

    console.log(
      `[EMAIL] Confirmation email successfully sent to ${data.customerEmail} for booking ${data.bookingRef}`
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

