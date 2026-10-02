import { db } from "@/lib/db";
import type { ScanDb } from "./scan";
export const prismaScanDb: ScanDb = {
  async findTicket(h) {
    const t = await db.ticket.findUnique({ where: { tokenHash: h }, include: { booking: { include: { items: { include: { ticketType: true } } } } } });
    if (!t) return null;
    return { id: t.id, isActive: t.isActive, bookingStatus: t.booking.status, checkedInAt: t.checkedInAt, name: t.booking.name, ticketType: t.booking.items[0]?.ticketType.name ?? "", reference: t.booking.reference };
  },
  async markCheckedIn(id, adminId, at) { // atomic: only one caller can flip checkedInAt from null
    return (await db.ticket.updateMany({ where: { id, checkedInAt: null }, data: { checkedInAt: at, checkedInBy: adminId } })).count;
  },
  async logScan(ticketId, result, adminId, manual) {
    if (ticketId) await db.ticketScan.create({ data: { ticketId, result, manual, adminId } });
    else await db.auditLog.create({ data: { adminId, action: "SCAN_INVALID" } });
  },
};
