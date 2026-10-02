export interface TicketRow { id: string; name: string; pricePaise: number; capacity: number; soldCount: number; maxPerOrder: number; isActive: boolean; salesStart?: Date | null; salesEnd?: Date | null }
export class BookingError extends Error { constructor(public code: string, msg: string) { super(msg); } }

export function priceOrder(t: TicketRow, qty: number, feePaise: number, now = new Date()) {
  if (!t.isActive) throw new BookingError("INACTIVE", "This ticket is not on sale.");
  if (t.salesStart && now < t.salesStart) throw new BookingError("NOT_OPEN", "Sales have not started.");
  if (t.salesEnd && now > t.salesEnd) throw new BookingError("CLOSED", "Ticket sales are closed.");
  if (!Number.isInteger(qty) || qty < 1 || qty > t.maxPerOrder) throw new BookingError("QTY", `Choose 1 to ${t.maxPerOrder} tickets.`);
  if (t.soldCount + qty > t.capacity) throw new BookingError("SOLD_OUT", "SOLD OUT");
  const subtotal = t.pricePaise * qty;
  return { subtotalPaise: subtotal, feePaise, totalPaise: subtotal + feePaise };
}
