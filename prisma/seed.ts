import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const EventStatus = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
} as const;

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding SSV Dandiya Divas 2026 database...");

  // ============================================================
  // ADMIN USER
  // ============================================================
  const adminEmail = (process.env.ADMIN_EMAIL || "Ssvphotography777@gmail.com").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "Welcome@ssvgroup";

  const passwordHash = await bcrypt.hash(adminPassword, 12);
  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      isActive: true,
      name: "SSV Admin",
    },
    create: {
      email: adminEmail,
      passwordHash,
      name: "SSV Admin",
      isActive: true,
    },
  });
  console.log(`✅ Admin ready: ${admin.email}`);

  // ============================================================
  // EVENT
  // ============================================================
  const existingEvent = await prisma.event.findUnique({
    where: { slug: "dandiya-divas-2026" },
  });

  let event = existingEvent;

  if (!existingEvent) {
    event = await prisma.event.create({
      data: {
        name: "SSV Dandiya Divas 2026",
        slug: "dandiya-divas-2026",
        description:
          "Join SSV Group for an unforgettable Navratri celebration featuring DJ performances, live entertainment by SP POWER, food stalls, celebrity selfies, and much more. Experience the magic of Dandiya and Garba in Bidar!",
        tagline: "Tradition • Music • Dance • Togetherness",
        venue: "Beside Beladale Petrol Pump, Gumpa",
        city: "Bidar",
        state: "Karnataka",
        address: "Beside Beladale Petrol Pump, Gumpa, Bidar, Karnataka, India",
        mapsUrl:
          process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL ||
          "https://maps.google.com/maps?q=Gumpa,Bidar,Karnataka,India",
        startDateTime: new Date("2026-10-14T11:30:00.000Z"),
        status: EventStatus.PUBLISHED,
        isPublished: true,
      },
    });
    console.log(`✅ Event created: ${event.name}`);
  } else {
    console.log(`ℹ️  Event already exists: ${existingEvent.name}`);
  }

  if (!event) throw new Error("Event creation failed");

  // ============================================================
  // TICKET TYPES
  // ============================================================
  const singleTicket = await prisma.ticketType.findFirst({
    where: { eventId: event.id, name: "Single Pass" },
  });

  if (!singleTicket) {
    await prisma.ticketType.create({
      data: {
        eventId: event.id,
        name: "Single Pass",
        description:
          "Entry for one woman. Access to all event areas including DJ + Live entertainment and competition zones.",
        price: 29900, // ₹299 in paise
        capacity: 200,
        maxPerOrder: 5,
        isActive: true,
        womenOnly: true,
        salesStart: new Date("2026-09-01T00:00:00.000Z"),
        salesEnd: new Date("2026-10-14T11:30:00.000Z"),
      },
    });
    console.log("✅ Single Pass ticket type created (₹299, women only)");
  }

  const coupleTicket = await prisma.ticketType.findFirst({
    where: { eventId: event.id, name: "Couple Pass" },
  });

  if (!coupleTicket) {
    await prisma.ticketType.create({
      data: {
        eventId: event.id,
        name: "Couple Pass",
        description:
          "Entry for two eligible attendees. Access to all event areas including DJ + Live entertainment and competition zones.",
        price: 49900, // ₹499 in paise
        capacity: 300,
        maxPerOrder: 5,
        isActive: true,
        womenOnly: false,
        salesStart: new Date("2026-09-01T00:00:00.000Z"),
        salesEnd: new Date("2026-10-14T11:30:00.000Z"),
      },
    });
    console.log("✅ Couple Pass ticket type created (₹499)");
  }

  // ============================================================
  // SETTINGS
  // ============================================================
  const defaultSettings = [
    { key: "contact_phone_1", value: "8618156721" },
    { key: "contact_phone_2", value: "9482629007" },
    { key: "platform_fee_paise", value: "0" },
    {
      key: "sponsors",
      value: JSON.stringify([
        "SSV Photography and Films",
        "SSV Baby Pops Studio",
        "SSV Finance and Auto Leasing",
        "SSV Ads and Marketing",
        "SSV Boys PG / Hostel",
        "SSV Catering",
      ]),
    },
  ];

  for (const setting of defaultSettings) {
    await prisma.settings.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log("✅ Default settings seeded");

  console.log("\n🎉 Seeding complete!");
  console.log("📧 Admin Email:    " + adminEmail);
  console.log("🔑 Admin Password: " + adminPassword);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
