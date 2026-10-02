import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAdmin, ok, fail } from "@/lib/http";
import { scanToken } from "@/services/scan";
import { prismaScanDb } from "@/services/scanDb";

export async function POST(req: NextRequest) {
  try {
    const s = await requireAdmin(req); if (!s) return ok({ error: "Unauthorized." }, 401);
    const p = z.object({ token: z.string().min(10).max(300) }).safeParse(await req.json().catch(() => null));
    if (!p.success) return ok({ result: "INVALID" });
    return ok(await scanToken(prismaScanDb, p.data.token.split("/verify/").pop()!, s.id)); // raw token or full QR URL
  } catch (e) { return fail(e); }
}
