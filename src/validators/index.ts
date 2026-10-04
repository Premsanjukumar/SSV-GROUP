import { z } from "zod";

// ============================================================
// BOOKING VALIDATORS
// ============================================================

export const BookingFormSchema = z.object({
  ticketTypeId: z.string().min(1, "Invalid ticket type"),
  quantity: z.number().int().min(1).max(10),
  customerName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name too long")
    .regex(/^[a-zA-Z\s.'-]+$/, "Name contains invalid characters"),
  customerEmail: z
    .string()
    .email("Enter a valid email address")
    .max(200)
    .toLowerCase(),
  customerPhone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  customerCity: z.string().max(100).optional(),
  femaleConfirmation: z.boolean().optional(),
  attendeeNames: z
    .array(z.string().max(100))
    .optional(),
  eventId: z.string().min(1, "Invalid event"),
  couponCode: z.string().trim().max(50).optional(),
  shoppingBenefitOptIn: z.boolean().optional(),
});

export type BookingFormData = z.infer<typeof BookingFormSchema>;

export const CreateWinnerCouponSchema = z.object({
  winnerName: z.string().min(2, "Winner name must be at least 2 characters").max(100),
  notes: z.string().max(300).optional(),
});

export const RedeemCouponSchema = z.object({
  code: z.string().min(3, "Coupon code is required").max(50),
});

export const BenefitChoiceSchema = z.object({
  shoppingBenefitOptIn: z.boolean(),
});

// ============================================================
// PAYMENT VERIFICATION VALIDATORS
// ============================================================

export const PaymentVerifySchema = z.object({
  bookingId: z.string().min(1),
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
});

export const DemoPaymentSchema = z.object({
  bookingId: z.string().min(1),
});

// ============================================================
// ADMIN VALIDATORS
// ============================================================

export const AdminLoginSchema = z.object({
  email: z.string().email("Enter a valid email").toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export const TicketScanSchema = z.object({
  token: z.string().min(10, "Invalid QR token"),
});

export const ManualCheckinSchema = z.object({
  bookingRef: z
    .string()
    .regex(/^SSV-DANDIYA-[A-Z0-9]{6}$/, "Invalid booking reference"),
});

// ============================================================
// SETTINGS VALIDATORS
// ============================================================

export const UpdateSettingsSchema = z.object({
  contact_phone_1: z.string().regex(/^\d{10}$/).optional(),
  contact_phone_2: z.string().regex(/^\d{10}$/).optional(),
  platform_fee_paise: z.number().int().min(0).optional(),
});

// ============================================================
// TICKET TYPE VALIDATORS
// ============================================================

export const UpdateTicketTypeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  priceInPaise: z.number().int().min(100).optional(), // minimum ₹1
  capacity: z.number().int().min(0).optional(),
  maxPerOrder: z.number().int().min(1).max(20).optional(),
  isActive: z.boolean().optional(),
  salesStart: z.string().datetime().optional(),
  salesEnd: z.string().datetime().optional(),
});
