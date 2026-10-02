// SSV Dandiya Divas 2026 — Shared Types

export interface EventInfo {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  venue: string;
  address?: string;
  city: string;
  startDateTime: string;
  endDateTime?: string;
  status: string;
  posterUrl?: string;
  isPublished: boolean;
  mapsUrl?: string;
}

export interface TicketTypeInfo {
  id: string;
  eventId: string;
  name: string;
  description?: string;
  price: number; // paise
  priceDisplay: string; // "₹299"
  capacity: number;
  soldCount: number;
  available: number;
  maxPerOrder: number;
  isActive: boolean;
  womenOnly: boolean;
  isSoldOut: boolean;
}

export interface BookingFormData {
  ticketTypeId: string;
  quantity: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCity?: string;
  womenConfirmation?: boolean;
  attendeeNames?: string[];
}

export interface OrderSummary {
  event: EventInfo;
  ticketType: TicketTypeInfo;
  quantity: number;
  subtotal: number;
  platformFee: number;
  grandTotal: number;
}

export interface BookingResult {
  bookingId: string;
  bookingRef: string;
  razorpayOrderId?: string;
  amount: number;
  customerName: string;
  customerEmail: string;
}

export interface TicketDisplay {
  id: string;
  bookingRef: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  ticketType: string;
  quantity: number;
  totalAmount: number;
  grandTotal: number;
  eventName: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  city: string;
  paymentStatus: string;
  bookingStatus: string;
  qrCode: string; // base64 data URL
  token: string;
  checkedIn: boolean;
  checkedInAt?: string;
}

export interface AdminStats {
  totalBookings: number;
  totalTicketsSold: number;
  totalRevenue: number; // paise
  singlePassesSold: number;
  couplePassesSold: number;
  checkedIn: number;
  totalCapacity: number;
}

export interface ScanResult {
  success: boolean;
  result: "valid" | "already_used" | "invalid" | "cancelled" | "not_paid";
  message: string;
  booking?: {
    ref: string;
    customerName: string;
    ticketType: string;
    quantity: number;
  };
  checkedInAt?: string;
}
