import { z } from "zod";
export const bookingInput = z.object({
  ticketTypeId: z.string().min(1),
  quantity: z.number().int().min(1).max(50),
  name: z.string().trim().min(2).max(80),
  mobile: z.string().transform(s => s.replace(/[\s-]/g, "")).pipe(z.string().regex(/^[6-9]\d{9}$/)),
  email: z.string().trim().toLowerCase().email().max(120),
  city: z.string().trim().max(60).optional(),
  eligibleWomanConfirmed: z.boolean().optional(),
}); // NOTE: no price field. Price is never accepted from the browser.
export type BookingInput = z.infer<typeof bookingInput>;
