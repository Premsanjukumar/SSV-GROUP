/**
 * OTP Generation, Hashing, Rate-Limiting, and Verification Service
 * Ensures raw OTPs are never persisted to the database and enforces 5-minute expiry,
 * 60s resend cooldown, and max 5 failed attempts per OTP.
 */

import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendOtpEmail } from "./email";
import { sendOtpSms, normalizePhone } from "./sms";

const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds
const MAX_ATTEMPTS = 5;

function getAuthSecret(): string {
  return process.env.AUTH_SECRET || "ssv-secure-auth-secret-dandiya-2026-key";
}

export function generateSecureOtp(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

export function hashOtp(otp: string): string {
  return crypto
    .createHmac("sha256", getAuthSecret())
    .update(otp.trim())
    .digest("hex");
}

export interface RequestOtpParams {
  type: "EMAIL" | "PHONE";
  identifier: string;
}

export interface VerifyOtpParams {
  type: "EMAIL" | "PHONE";
  identifier: string;
  otp: string;
  name?: string;
}

export async function requestOtp(
  params: RequestOtpParams
): Promise<{ success: boolean; message: string; cooldownSeconds?: number }> {
  const type = params.type;
  const rawId = params.identifier.trim();
  const identifier =
    type === "PHONE" ? normalizePhone(rawId) : rawId.toLowerCase();

  if (!identifier) {
    return { success: false, message: "Please provide a valid email or mobile number" };
  }

  // Check recent OTP for cooldown
  const recentOtp = await prisma.otpVerification.findFirst({
    where: {
      identifier,
      type,
      isUsed: false,
    },
    orderBy: { createdAt: "desc" },
  });

  if (recentOtp) {
    const elapsed = Date.now() - recentOtp.createdAt.getTime();
    if (elapsed < RESEND_COOLDOWN_MS) {
      const waitSec = Math.ceil((RESEND_COOLDOWN_MS - elapsed) / 1000);
      return {
        success: false,
        message: `Please wait ${waitSec}s before requesting a new code`,
        cooldownSeconds: waitSec,
      };
    }

    // Invalidate previous active OTPs for this identifier
    await prisma.otpVerification.updateMany({
      where: { identifier, type, isUsed: false },
      data: { isUsed: true },
    });
  }

  // Generate new OTP and hash it
  const plainOtp = generateSecureOtp();
  const otpHash = hashOtp(plainOtp);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);

  // Store in database
  await prisma.otpVerification.create({
    data: {
      identifier,
      type,
      otpHash,
      expiresAt,
      maxAttempts: MAX_ATTEMPTS,
      attempts: 0,
      isUsed: false,
    },
  });

  // Dispatch OTP
  if (type === "EMAIL") {
    const emailResult = await sendOtpEmail(identifier, plainOtp);
    if (!emailResult.success) {
      return {
        success: false,
        message: emailResult.error || "Failed to deliver OTP to your email",
      };
    }
    return {
      success: true,
      message: `A 6-digit verification code has been sent to ${identifier}`,
      cooldownSeconds: 60,
    };
  } else {
    const smsResult = await sendOtpSms(identifier, plainOtp);
    if (!smsResult.success) {
      return {
        success: false,
        message: smsResult.error || "Failed to deliver SMS OTP",
      };
    }
    return {
      success: true,
      message: `A 6-digit verification code has been sent to +91 ${identifier}`,
      cooldownSeconds: 60,
    };
  }
}

export async function verifyOtp(params: VerifyOtpParams): Promise<{
  success: boolean;
  customer?: any;
  error?: string;
}> {
  const type = params.type;
  const rawId = params.identifier.trim();
  const identifier =
    type === "PHONE" ? normalizePhone(rawId) : rawId.toLowerCase();
  const inputOtp = params.otp.trim();

  if (!inputOtp || inputOtp.length !== 6) {
    return { success: false, error: "Please enter a 6-digit verification code" };
  }

  const otpRecord = await prisma.otpVerification.findFirst({
    where: {
      identifier,
      type,
      isUsed: false,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!otpRecord) {
    return {
      success: false,
      error: "No active verification code found. Please request a new OTP.",
    };
  }

  // Check expiry
  if (new Date() > otpRecord.expiresAt) {
    await prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: { isUsed: true },
    });
    return {
      success: false,
      error: "Verification code has expired. Please request a new OTP.",
    };
  }

  // Check attempts
  if (otpRecord.attempts >= otpRecord.maxAttempts) {
    await prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: { isUsed: true },
    });
    return {
      success: false,
      error: "Too many failed attempts. Please request a new verification code.",
    };
  }

  // Compare hash
  const inputHash = hashOtp(inputOtp);
  if (inputHash !== otpRecord.otpHash) {
    await prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: { attempts: { increment: 1 } },
    });
    const remaining = otpRecord.maxAttempts - (otpRecord.attempts + 1);
    return {
      success: false,
      error: `Incorrect verification code. ${remaining > 0 ? `${remaining} attempt(s) remaining.` : "Please request a new OTP."}`,
    };
  }

  // Mark OTP as used
  await prisma.otpVerification.update({
    where: { id: otpRecord.id },
    data: { isUsed: true },
  });

  // Find or create customer
  let customer = await prisma.customer.findFirst({
    where: type === "EMAIL" ? { email: identifier } : { phone: identifier },
  });

  if (!customer) {
    customer = await prisma.customer.create({
      data: {
        email: type === "EMAIL" ? identifier : undefined,
        phone: type === "PHONE" ? identifier : undefined,
        name: params.name?.trim() || undefined,
        isEmailVerified: type === "EMAIL",
        isPhoneVerified: type === "PHONE",
        lastLoginAt: new Date(),
      },
    });
  } else {
    // Update verification flags and last login
    customer = await prisma.customer.update({
      where: { id: customer.id },
      data: {
        isEmailVerified: type === "EMAIL" ? true : customer.isEmailVerified,
        isPhoneVerified: type === "PHONE" ? true : customer.isPhoneVerified,
        name: params.name?.trim() || customer.name,
        lastLoginAt: new Date(),
      },
    });
  }

  return { success: true, customer };
}
