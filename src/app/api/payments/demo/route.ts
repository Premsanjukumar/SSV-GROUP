import { NextRequest } from "next/server";
import { afterPayment } from "@/services/postConfirm";
import { z } from "zod";
import { paymentMode } from "@/lib/config";
import { confirmPayment } from "@/services/booking";
import { ok, fail } from "@/lib/http";

export async function POST(req: NextRequest) {
  try {
    if (process.env.NODE_ENV === "production" || paymentMode({ ...process.env } as Record<string, string | undefined>) !== "demo") return ok({ error: "Not found." }, 404);
    const b = z.object({ bookingId: z.string().min(1) }).safeParse(await req.json().catch(() => null));
    if (!b.success) return ok({ error: "Invalid request." }, 400);
    const id = await confirmPayment(b.data.bookingId); await afterPayment(id); return ok({ bookingId: id, demo: true });
  } catch (e) { return fail(e); }
}
