import { describe, it, expect } from "vitest";
import { signSession, readSession } from "../src/lib/session";
import { limited } from "../src/lib/rateLimit";
import { deriveTicketToken } from "../src/lib/tokens";
const SECRET = "x".repeat(40);
describe("admin session", () => {
  it("round-trips", async () => expect((await readSession(await signSession({ id: "1", email: "a@b.c" }, SECRET), SECRET))?.id).toBe("1"));
  it("rejects tampering and wrong secret", async () => {
    const t = await signSession({ id: "1", email: "a@b.c" }, SECRET);
    expect(await readSession(t.replace(/^./, "Z"), SECRET)).toBeNull();
    expect(await readSession(t, "y".repeat(40))).toBeNull();
    expect(await readSession(undefined, SECRET)).toBeNull();
    expect(await readSession("garbage", SECRET)).toBeNull();
  });
  it("expires", async () => {
    const t = await signSession({ id: "1", email: "a@b.c" }, SECRET, 0);
    expect(await readSession(t, SECRET, 9 * 3600 * 1000)).toBeNull();
  });
  it("refuses a weak secret", async () => expect(signSession({ id: "1", email: "a" }, "short")).rejects.toThrow());
});
describe("rate limit and ticket tokens", () => {
  it("limits after max", () => { for (let i = 0; i < 5; i++) expect(limited("k", 5, 1000, 1)).toBe(false); expect(limited("k", 5, 1000, 2)).toBe(true); });
  it("derived token is stable and secret-dependent", () => {
    expect(deriveTicketToken("t1", SECRET)).toBe(deriveTicketToken("t1", SECRET));
    expect(deriveTicketToken("t1", SECRET)).not.toBe(deriveTicketToken("t1", "z".repeat(40)));
  });
});
