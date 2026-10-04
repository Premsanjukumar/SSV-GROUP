import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import { formatCurrency } from "@/lib/utils";

interface TicketPDFData {
  bookingRef: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  ticketType: string;
  quantity: number;
  totalInPaise: number;
  eventName: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  verifyUrl: string;
  status: string;
  shoppingBenefitOptIn?: boolean;
  couponCode?: string | null;
}

/**
 * Generate a QR code data URL from a verification URL
 */
export async function generateQRCodeDataUrl(url: string): Promise<string> {
  try {
    const qrDataUrl = await QRCode.toDataURL(url, {
      errorCorrectionLevel: "H",
      width: 300,
      margin: 2,
      color: {
        dark: "#6D0B0B",
        light: "#FFFFFF",
      },
    });
    return qrDataUrl;
  } catch (error) {
    console.error("[QR] Failed to generate QR code:", error);
    throw new Error("Failed to generate QR code");
  }
}

/**
 * Generate a PDF ticket buffer
 */
export async function generateTicketPDF(
  data: TicketPDFData
): Promise<Buffer> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  // ---- Background ----
  doc.setFillColor(26, 5, 5); // Dark maroon background
  doc.rect(0, 0, W, H, "F");

  // ---- Top decorative border ----
  doc.setDrawColor(212, 160, 23); // Gold
  doc.setLineWidth(1.5);
  doc.rect(8, 8, W - 16, H - 16, "S");

  doc.setLineWidth(0.5);
  doc.setDrawColor(192, 57, 43); // Red accent
  doc.rect(11, 11, W - 22, H - 22, "S");

  // ---- Header ----
  doc.setFillColor(109, 11, 11); // Maroon
  doc.rect(8, 8, W - 16, 45, "F");

  // SSV Group logo text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(212, 160, 23); // Gold
  doc.text("SSV GROUP", W / 2, 26, { align: "center" });

  doc.setFontSize(14);
  doc.setTextColor(255, 248, 220); // Cream
  doc.text("DANDIYA DIVAS 2026", W / 2, 36, { align: "center" });

  doc.setFontSize(9);
  doc.setTextColor(200, 150, 80);
  doc.text("Tradition  •  Music  •  Dance  •  Togetherness", W / 2, 44, {
    align: "center",
  });

  // ---- Gold divider ----
  doc.setDrawColor(212, 160, 23);
  doc.setLineWidth(0.8);
  doc.line(15, 55, W - 15, 55);

  // ---- TICKET CONFIRMED badge ----
  doc.setFillColor(45, 80, 22); // Dark green
  doc.roundedRect(W / 2 - 30, 59, 60, 10, 3, 3, "F");
  doc.setFontSize(9);
  doc.setTextColor(144, 238, 144);
  doc.setFont("helvetica", "bold");
  doc.text("✓  TICKET CONFIRMED", W / 2, 66, { align: "center" });

  // ---- Booking Reference ----
  doc.setFontSize(18);
  doc.setTextColor(212, 160, 23);
  doc.setFont("helvetica", "bold");
  doc.text(data.bookingRef, W / 2, 82, { align: "center" });

  doc.setFontSize(8);
  doc.setTextColor(150, 100, 80);
  doc.text("BOOKING REFERENCE", W / 2, 88, { align: "center" });

  // ---- Gold divider ----
  doc.line(15, 93, W - 15, 93);

  // ---- QR Code ----
  let qrX = W - 70;
  let qrY = 98;
  try {
    const qrDataUrl = await generateQRCodeDataUrl(data.verifyUrl);
    doc.addImage(qrDataUrl, "PNG", qrX, qrY, 55, 55);

    doc.setFontSize(7);
    doc.setTextColor(180, 140, 100);
    doc.text("Scan at entry gate", qrX + 27.5, qrY + 60, { align: "center" });
  } catch {
    // QR failed — still generate PDF
    doc.setFillColor(50, 50, 50);
    doc.rect(qrX, qrY, 55, 55, "F");
    doc.setFontSize(8);
    doc.setTextColor(200, 100, 100);
    doc.text("QR Error", qrX + 27.5, qrY + 30, { align: "center" });
  }

  // ---- Customer Details ----
  const leftX = 15;
  const labelColor: [number, number, number] = [180, 120, 80];
  const valueColor: [number, number, number] = [255, 248, 220];
  let y = 102;
  const rowHeight = 10;

  const details: Array<{ label: string; value: string }> = [
    { label: "NAME", value: data.customerName },
    { label: "EMAIL", value: data.customerEmail },
    { label: "MOBILE", value: data.customerPhone },
    { label: "TICKET TYPE", value: data.ticketType },
    { label: "QUANTITY", value: String(data.quantity) },
    { label: "AMOUNT PAID", value: formatCurrency(data.totalInPaise) },
  ];

  for (const { label, value } of details) {
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...labelColor);
    doc.text(label, leftX, y);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...valueColor);
    const displayValue = value.length > 28 ? value.slice(0, 28) + "…" : value;
    doc.text(displayValue, leftX, y + 5);

    y += rowHeight + 3;
  }

  // ---- Event Details box ----
  const boxY = 175;
  doc.setFillColor(40, 10, 10);
  doc.roundedRect(15, boxY, W - 30, 38, 4, 4, "F");
  doc.setDrawColor(212, 160, 23, 0.5);
  doc.roundedRect(15, boxY, W - 30, 38, 4, 4, "S");

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(212, 160, 23);
  doc.text("EVENT DETAILS", W / 2, boxY + 7, { align: "center" });

  doc.setFontSize(9);
  doc.setTextColor(255, 248, 220);
  doc.text("14 October 2026  •  Wednesday  •  5:00 PM to 10:00 PM", W / 2, boxY + 16, {
    align: "center",
  });

  doc.setFontSize(8);
  doc.setTextColor(200, 160, 100);
  doc.text(
    "RS Open Ground, Beside Beldale Petrol Pump, Gumpa, Bidar",
    W / 2,
    boxY + 25,
    { align: "center" }
  );

  doc.setFontSize(8);
  doc.setTextColor(180, 140, 80);
  const attractionText = data.shoppingBenefitOptIn !== false && data.couponCode
    ? `Special Attraction: SP POWER  •  Foreign Fits Benefit Code: ${data.couponCode}`
    : "Special Attraction: SP POWER";
  doc.text(attractionText, W / 2, boxY + 33, { align: "center" });

  // ---- Instructions ----
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(150, 100, 80);
  const instructionText = data.shoppingBenefitOptIn !== false && data.couponCode
    ? `Please present this QR ticket at entry. Redeem Rs. 200 at Foreign Fits using Coupon: ${data.couponCode}`
    : "Please present this QR ticket at the entry gate.";
  doc.text(instructionText, W / 2, 222, { align: "center" });

  // ---- Footer ----
  doc.setFillColor(109, 11, 11);
  doc.rect(8, H - 28, W - 16, 20, "F");

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 100, 80);
  doc.text("Powered by SSV Group  •  ssvgroup.in", W / 2, H - 18, {
    align: "center",
  });
  doc.text("Contact: 8618156721  |  9482629007", W / 2, H - 13, {
    align: "center",
  });

  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}
