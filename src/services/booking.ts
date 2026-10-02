import { randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { priceOrder, BookingError } from "@/lib/pricing";
import { BookingInput } from "@/lib/validators";
import { newReference, deriveTicketToken, hashToken } from "@/lib/tokens";

async function create(input: BookingInput) {
  return db.$transaction(async (tx: Prisma.TransactionClient) => {
    const tt = await tx.ticketType.findUnique({ where: { id: input.ticketTypeId }, include: { event: true } });
    if (!tt || !tt.event.isPublished) throw new BookingError("UNAVAILABLE", "This event is not available.");
    if (tt.womenOnly && !input.eligibleWomanConfirmed) throw new BookingError("ELIGIBILITY", "Please confirm the Single Pass is for an eligible woman.");
    const price = priceOrder(tt, input.quantity, tt.event.feePaise); // price comes from DB only
    // Atomic reserve: one statement, so two buyers can never both take the last ticket.
    const n = await tx.$executeRaw`UPDATE "TicketType" SET "soldCount"="soldCount"+${input.quantity} WHERE id=${tt.id} AND "soldCount"+${input.quantity}<=capacity`;
    if (n !== 1) throw new BookingError("SOLD_OUT", "SOLD OUT");
    const booking = await tx.booking.create({ data: {
      reference: newReference(), eventId: tt.eventId, name: input.name, mobile: input.mobile, email: input.email, city: input.city,
      totalPaise: price.totalPaise,
      items: { create: [{ ticketTypeId: tt.id, quantity: input.quantity, unitPricePaise: tt.pricePaise }] },
      payments: { create: [{ amountPaise: price.totalPaise }] },
    } });
    return { booking, payment: await tx.payment.findFirstOrThrow({ where: { bookingId: booking.id } }) };
  });
}
export async function createBooking(input: BookingInput) {
  for (let i = 0; ; i++) {
    try { return await create(input); }
    catch (e) { if ((e as { code?: string })?.code === "P2002" && i < 2) continue; throw e; } // reference collision: retry
  }
}

export async function confirmPayment(bookingId: string, razorpayPaymentId?: string) {
  const secret = process.env.AUTH_SECRET ?? "";
  return db.$transaction(async (tx: Prisma.TransactionClient) => {
    const b = await tx.booking.findUnique({ where: { id: bookingId }, include: { items: true } });
    if (!b) throw new BookingError("NOT_FOUND", "Booking not found.");
    if (b.status === "PAID") return b.id; // idempotent: webhook retries and double submits are safe
    if (b.status !== "PENDING") throw new BookingError("STATE", "This booking can no longer be paid. Contact the organizer.");
    await tx.booking.update({ where: { id: b.id }, data: { status: "PAID" } });
    await tx.payment.updateMany({ where: { bookingId: b.id }, data: { status: "PAID", razorpayPaymentId } });
    const tickets = b.items.flatMap((it: { quantity: number }) => Array.from({ length: it.quantity }, () => {
      const id = randomUUID();
      return { id, bookingId: b.id, tokenHash: hashToken(deriveTicketToken(id, secret)) };
    }));
    await tx.ticket.createMany({ data: tickets });
    return b.id;
  });
}

export async function failBooking(bookingId: string) {
  await db.$transaction(async (tx: Prisma.TransactionClient) => {
    const b = await tx.booking.findUnique({ where: { id: bookingId }, include: { items: true } });
    if (!b || b.status !== "PENDING") return;
    await tx.booking.update({ where: { id: b.id }, data: { status: "FAILED" } });
    await tx.payment.updateMany({ where: { bookingId: b.id }, data: { status: "FAILED" } });
    for (const it of b.items) await tx.$executeRaw`UPDATE "TicketType" SET "soldCount"="soldCount"-${it.quantity} WHERE id=${it.ticketTypeId}`;
  });
}
// Call from a cron/scheduled job so unpaid holds do not lock inventory.
export async function releaseExpiredPending(minutes = 15) {
  const old = await db.booking.findMany({ where: { status: "PENDING", createdAt: { lt: new Date(Date.now() - minutes * 60000) } }, select: { id: true } });
  for (const b of old) await failBooking(b.id);
  return old.length;
}
