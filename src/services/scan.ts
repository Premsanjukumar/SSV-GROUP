import { hashToken } from "../lib/tokens";
// Minimal DB surface so this is testable; the Prisma client satisfies it in the app.
export interface ScanDb {
  findTicket(tokenHash: string): Promise<{ id: string; isActive: boolean; bookingStatus: string; checkedInAt: Date | null; name: string; ticketType: string; reference: string } | null>;
  // Must be ONE atomic statement: UPDATE Ticket SET checkedInAt=now WHERE id=? AND checkedInAt IS NULL. Returns rows changed.
  markCheckedIn(ticketId: string, adminId: string, at: Date): Promise<number>;
  logScan(ticketId: string | null, result: string, adminId: string, manual: boolean): Promise<void>;
}
export type ScanResult =
  | { result: "VALID"; name: string; ticketType: string; reference: string }
  | { result: "ALREADY_USED"; checkedInAt: Date | null }
  | { result: "NOT_VALID" } | { result: "INVALID" };

export async function scanToken(db: ScanDb, token: string, adminId: string, manual = false, now = new Date()): Promise<ScanResult> {
  const t = await db.findTicket(hashToken(token));
  if (!t) { await db.logScan(null, "INVALID", adminId, manual); return { result: "INVALID" }; }
  if (!t.isActive || t.bookingStatus !== "PAID") { await db.logScan(t.id, "NOT_VALID", adminId, manual); return { result: "NOT_VALID" }; }
  const changed = await db.markCheckedIn(t.id, adminId, now);
  if (changed === 1) { await db.logScan(t.id, "VALID", adminId, manual); return { result: "VALID", name: t.name, ticketType: t.ticketType, reference: t.reference }; }
  const again = await db.findTicket(hashToken(token));
  await db.logScan(t.id, "ALREADY_USED", adminId, manual);
  return { result: "ALREADY_USED", checkedInAt: again?.checkedInAt ?? t.checkedInAt };
}
