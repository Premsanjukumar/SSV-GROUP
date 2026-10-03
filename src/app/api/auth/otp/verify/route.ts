import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyOtp } from "@/services/otp";
import { signCustomerToken, setCustomerCookie } from "@/lib/customerAuth";
import { limited } from "@/lib/rateLimit";

const verifyOtpSchema = z.object({
  type: z.enum(["EMAIL", "PHONE"]),
  identifier: z.string().min(3).max(120),
  otp: z.string().length(6),
  name: z.string().max(100).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local";
    if (limited(`otp_verify_${ip}`, 20, 60 * 1000, 1)) {
      return NextResponse.json(
        { error: "Too many attempts. Please wait a minute." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = verifyOtpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid verification code format." },
        { status: 400 }
      );
    }

    const { type, identifier, otp, name } = parsed.data;

    const result = await verifyOtp({ type, identifier, otp, name });

    if (!result.success || !result.customer) {
      return NextResponse.json(
        { error: result.error || "Verification failed" },
        { status: 400 }
      );
    }

    const customer = result.customer;

    // Generate session JWT
    const token = await signCustomerToken({
      customerId: customer.id,
      email: customer.email,
      phone: customer.phone,
      name: customer.name,
    });

    const res = NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        email: customer.email,
        phone: customer.phone,
        name: customer.name,
        isEmailVerified: customer.isEmailVerified,
        isPhoneVerified: customer.isPhoneVerified,
      },
    });

    setCustomerCookie(res, token);
    return res;
  } catch (error: any) {
    console.error("[API:OTP:VERIFY]", error?.message || error);
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}
