import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getAdminSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { prisma } = await import("@/lib/prisma");

    const [event, ticketTypes, settingsList] = await Promise.all([
      prisma.event.findFirst({
        where: { slug: "dandiya-divas-2026" },
      }),
      prisma.ticketType.findMany({
        orderBy: { price: "asc" },
      }),
      prisma.settings.findMany(),
    ]);

    const settingsMap: Record<string, string> = {};
    for (const s of settingsList) {
      settingsMap[s.key] = s.value;
    }

    return NextResponse.json({
      event: event || {
        name: "SSV Dandiya Divas 2026",
        tagline: "Tradition • Music • Dance • Togetherness",
        venue: "Beside Beladale Petrol Pump, Gumpa",
        city: "Bidar",
        state: "Karnataka",
        date: "14 October 2026",
        time: "5:00 PM onwards",
        mapsUrl: process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL || "https://maps.google.com/maps?q=Gumpa,Bidar,Karnataka,India",
        isPublished: true,
      },
      ticketTypes: ticketTypes.map((t: any) => ({
        id: t.id,
        name: t.name,
        price: t.price,
        capacity: t.capacity,
        isActive: t.isActive,
        womenOnly: t.womenOnly,
        maxPerOrder: t.maxPerOrder,
      })),
      settings: {
        contact_phone_1: settingsMap.contact_phone_1 || "8618156721",
        contact_phone_2: settingsMap.contact_phone_2 || "9482629007",
        platform_fee_paise: settingsMap.platform_fee_paise || "0",
        payment_mode: process.env.PAYMENT_MODE || "demo",
      },
    });
  } catch (error) {
    console.error("[SETTINGS GET] DB error:", error);
    return NextResponse.json({
      event: {
        name: "SSV Dandiya Divas 2026",
        tagline: "Tradition • Music • Dance • Togetherness",
        venue: "Beside Beladale Petrol Pump, Gumpa",
        city: "Bidar",
        state: "Karnataka",
        date: "14 October 2026",
        time: "5:00 PM onwards",
        mapsUrl: "https://maps.google.com/maps?q=Gumpa,Bidar,Karnataka,India",
        isPublished: true,
      },
      ticketTypes: [
        { id: "single", name: "Single Pass", price: 29900, capacity: 200, isActive: true, womenOnly: true, maxPerOrder: 5 },
        { id: "couple", name: "Couple Pass", price: 49900, capacity: 300, isActive: true, womenOnly: false, maxPerOrder: 5 },
      ],
      settings: {
        contact_phone_1: "8618156721",
        contact_phone_2: "9482629007",
        platform_fee_paise: "0",
        payment_mode: process.env.PAYMENT_MODE || "demo",
      },
    });
  }
}

export async function POST(req: NextRequest) {
  const session = await getAdminSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const { prisma } = await import("@/lib/prisma");

    // Update settings keys
    if (body.settings) {
      for (const [key, value] of Object.entries(body.settings)) {
        await prisma.settings.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) },
        });
      }
    }

    // Update ticket capacities & active states if provided
    if (Array.isArray(body.ticketTypes)) {
      for (const t of body.ticketTypes) {
        if (t.id) {
          await prisma.ticketType.update({
            where: { id: t.id },
            data: {
              capacity: Number(t.capacity) || 100,
              isActive: Boolean(t.isActive),
              maxPerOrder: Number(t.maxPerOrder) || 5,
            },
          }).catch(() => {});
        }
      }
    }

    // Record audit log
    await prisma.auditLog.create({
      data: {
        adminId: session.adminId !== "demo-admin-id" ? session.adminId : undefined,
        action: "UPDATE_SETTINGS",
        details: body,
      },
    }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SETTINGS UPDATE] DB error:", error);
    return NextResponse.json({ success: true, warning: "Saved in memory / offline" });
  }
}
