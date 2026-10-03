import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requestOtp } from "@/services/otp";
import { limited } from "@/lib/rateLimit";

const sendOtpSchema = z.object({
  type: z.enum(["EMAIL", "PHONE"]),
  identifier: z.string().min(3).max(120),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local";
    if (limited(`otp_send_${ip}`, 10, 60 * 1000, 1)) {
      return NextResponse.json(
        { error: "Too many OTP requests. Please wait a minute." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = sendOtpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please provide a valid email or 10-digit mobile number." },
        { status: 400 }
      );
    }

    const { type, identifier } = parsed.data;

    // Additional format checks
    if (type === "EMAIL") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(identifier)) {
        return NextResponse.json(
          { error: "Please enter a valid email address." },
          { status: 400 }
        );
      }
    } else {
      const phoneDigits = identifier.replace(/\D/g, "");
      if (phoneDigits.length < 10) {
        return NextResponse.json(
          { error: "Please enter a valid 10-digit Indian mobile number." },
          { status: 400 }
        );
      }
    }

    const result = await requestOtp({ type, identifier });

    if (!result.success) {
      return NextResponse.json(
        { error: result.message, cooldownSeconds: result.cooldownSeconds },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      cooldownSeconds: result.cooldownSeconds || 60,
    });
  } catch (error: any) {
    console.error("[API:OTP:SEND]", error?.message || error);
    return NextResponse.json(
      { error: "Failed to send verification code. Please try again." },
      { status: 500 }
    );
  }
}
