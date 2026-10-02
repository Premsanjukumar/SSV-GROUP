import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin, ok, fail } from "@/lib/http";
import { scanToken } from "@/services/scan";
import { prismaScanDb } from "@/services/scanDb";
import { deriveTicketToken } from "@/lib/tokens";

export async function POST(req: NextRequest) {
  try {
    const s = await requireAdmin(req); if (!s) return ok({ error: "Unauthorized." }, 401);
    const p = z.object({ reference: z.string().min(5).max(40) }).safeParse(await req.json().catch(() => null));
    if (!p.success) return ok({ error: "Enter a booking ID." }, 400);
    const t = await db.ticket.findFirst({ where: { booking: { reference: p.data.reference.toUpperCase() } }, orderBy: { checkedInAt: "asc" } });
    if (!t) return ok({ result: "INVALID" });
    await db.auditLog.create({ data: { adminId: s.id, action: "MANUAL_CHECKIN", detail: { ticketId: t.id } } });
    return ok(await scanToken(prismaScanDb, deriveTicketToken(t.id, process.env.AUTH_SECRET ?? ""), s.id, true));
  } catch (e) { return fail(e); }
}
