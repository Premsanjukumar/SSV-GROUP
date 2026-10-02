import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { confirmBooking } from "@/services/payment";
import { DemoPaymentSchema } from "@/validators";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const result = DemoPaymentSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Invalid booking ID" }, { status: 400 });
  }

  const { bookingId } = result.data;

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (booking) {
      await confirmBooking({ bookingId, isDemoPayment: true });
    }
  } catch {
    /* ignore fallback error */
  }

  return NextResponse.json({ success: true, bookingId });
}
