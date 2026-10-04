/**
 * SSV Dandiya Divas 2026 — Help Center / FAQ Data
 *
 * SINGLE SOURCE OF TRUTH for all support assistant answers.
 * All information sourced from existing project pages:
 *   - src/app/contact/page.tsx        -> phone numbers, hours
 *   - src/app/refund-policy/page.tsx  -> refund/cancellation policy
 *   - src/app/page.tsx                -> event details, highlights
 *   - src/app/book/page.tsx           -> ticket types, prices
 *
 * DO NOT invent information here.
 * If official info is unavailable, set answer to null → shows Customer Care.
 */

// ─── Customer Care Numbers ────────────────────────────────────────────────────
// Source of truth: src/app/contact/page.tsx

export interface CustomerCareNumber {
  label: string;
  number: string;
  tel: string;
  badge: string;
}

export const CUSTOMER_CARE_NUMBERS: CustomerCareNumber[] = [
  { label: "Helpline 1", number: "+91 86181 56721", tel: "tel:+918618156721", badge: "Call / WhatsApp" },
  { label: "Helpline 2", number: "+91 94826 29007", tel: "tel:+919482629007", badge: "Call / WhatsApp" },
  { label: "Helpline 3", number: "+91 84318 12193", tel: "tel:+918431812193", badge: "Call / WhatsApp" },
];

export const SUPPORT_HOURS = "9:00 AM – 10:00 PM IST (Daily)";

// ─── FAQ Types ────────────────────────────────────────────────────────────────

export type CategoryId = "tickets" | "payment" | "refund" | "event" | "my-ticket" | "support";

export interface FaqCategory {
  id: CategoryId;
  emoji: string;
  label: string;
}

export interface FaqEntry {
  id: string;
  categoryId: CategoryId;
  question: string;
  keywords: string[];
  /** null = show Customer Care panel instead of answer text */
  answer: string | null;
}

// ─── Categories ──────────────────────────────────────────────────────────────

export const FAQ_CATEGORIES: FaqCategory[] = [
  { id: "tickets",   emoji: "🎟️", label: "Tickets & Booking" },
  { id: "payment",   emoji: "💳", label: "Payment" },
  { id: "refund",    emoji: "💰", label: "Refund & Cancellation" },
  { id: "event",     emoji: "📅", label: "Event Information" },
  { id: "my-ticket", emoji: "🎫", label: "My Ticket" },
  { id: "support",   emoji: "📞", label: "Customer Support" },
];

// ─── FAQ Entries ──────────────────────────────────────────────────────────────

export const FAQ_ENTRIES: FaqEntry[] = [
  // TICKETS & BOOKING
  {
    id: "ticket-price",
    categoryId: "tickets",
    question: "What is the ticket price?",
    keywords: ["price","cost","how much","ticket price","fee","charge","amount","rate","single","couple","299","499"],
    answer: "**Ticket Prices for SSV Dandiya Divas 2026:**\n\n• **Single Pass** — ₹299 per person\n• **Couple Pass** — ₹499 per couple (1 male + 1 female)\n\nAll prices include entry, DJ + Live music, and all advertised highlights. Tickets are available online on our website.",
  },
  {
    id: "how-to-book",
    categoryId: "tickets",
    question: "How can I book a ticket?",
    keywords: ["how to book","book ticket","purchase","buy ticket","register","reserve","booking process","how do i","order"],
    answer: "Booking is quick!\n\n1. Click **Book Tickets** in the navigation\n2. Select ticket type (Single or Couple Pass)\n3. Choose quantity\n4. Fill in your details (Name, Phone, Email, City)\n5. Pay securely via Razorpay (UPI, Card, Net Banking)\n6. Your QR ticket is generated instantly and emailed to you!\n\nAll tickets are digital — no physical ticket required.",
  },
  {
    id: "single-ticket",
    categoryId: "tickets",
    question: "Can I buy a single ticket?",
    keywords: ["single","alone","solo","one person","individual","ladies","girl","woman"],
    answer: "Yes! We offer a **Single Pass at ₹299** per person. Open to all attendees.\n\nThe **Couple Pass at ₹499** covers 1 male + 1 female entry.",
  },
  {
    id: "ticket-includes",
    categoryId: "tickets",
    question: "What is included with my ticket?",
    keywords: ["includes","what do i get","benefits","features","entry","highlights","activities","what's included"],
    answer: "Your SSV Dandiya Divas 2026 ticket includes:\n\n🎵 DJ + Live Music — high-voltage beats & live performances\n🍽️ Food Stall Access — festive delicacies & street treats\n📸 Celebrity Selfie — exclusive selfie with SP POWER\n❤️ Couple's Portraits — themed photo memories\n✨ Selfie Booth — Navratri backdrops & 360 frames\n💃 Couple Dance — Dandiya Raas & Garba floor\n🏆 Competition — dance & Dandiya competitions\n\nNote: Food stall items are separately priced.",
  },
  // PAYMENT
  {
    id: "payment-methods",
    categoryId: "payment",
    question: "What payment methods are available?",
    keywords: ["payment method","how to pay","upi","credit card","debit card","net banking","gpay","phonepe","paytm","razorpay","pay"],
    answer: "We accept all major methods via Razorpay:\n\n• **UPI** — Google Pay, PhonePe, Paytm, BHIM & all UPI apps\n• **Debit Cards** — Visa, Mastercard, RuPay\n• **Credit Cards** — Visa, Mastercard, Amex\n• **Net Banking** — All major Indian banks\n• **Wallets** — Paytm Wallet & others\n\nAll payments are 100% secure and encrypted.",
  },
  {
    id: "payment-failed",
    categoryId: "payment",
    question: "My payment failed. What should I do?",
    keywords: ["payment failed","failed","error","not working","declined","rejected","unsuccessful","retry","try again"],
    answer: "Sorry about that! Here's what to check:\n\n1. **Check bank balance** — ensure sufficient funds\n2. **Check internet connection** — stable connection is required\n3. **Try a different method** — UPI, card, or net banking\n4. **Retry the booking** — go to /book and start again\n\nIf money was deducted but you received no ticket, contact support immediately with your transaction ID.\n\n📞 **+91 86181 56721** (Call/WhatsApp)",
  },
  {
    id: "money-deducted",
    categoryId: "payment",
    question: "Money was deducted but I didn't receive my ticket.",
    keywords: ["money deducted","deducted","charged","no ticket","not received","payment success","confirmation not received","double deduction","duplicate charge"],
    answer: "Don't worry — if money was deducted but your ticket was not generated, it will be auto-reconciled within **5–7 working days**.\n\nTo speed up resolution, contact us immediately with:\n1. Full Name & Registered Mobile Number\n2. Booking Reference ID (if generated)\n3. Payment Transaction ID / UPI Reference / Bank UTR\n4. Bank debit SMS screenshot\n\n📞 **+91 86181 56721** or **+91 94826 29007** (Call / WhatsApp)\n\nAvailable: 9:00 AM – 10:00 PM IST Daily",
  },
  // REFUND & CANCELLATION
  {
    id: "can-cancel",
    categoryId: "refund",
    question: "Can I cancel my ticket?",
    keywords: ["cancel","cancellation","can i cancel","change of mind","not attending","return"],
    answer: "Tickets are **strictly non-refundable** in these cases:\n\n❌ Change of mind or personal unavailability\n❌ No-show or late arrival\n❌ Security denial / code of conduct violation\n\nRefunds are only available if:\n✅ Duplicate / multiple bank deductions\n✅ Payment deducted but ticket not generated\n✅ Event permanently cancelled by SSV Group\n\nView full policy at /refund-policy",
  },
  {
    id: "refund-policy",
    categoryId: "refund",
    question: "What is the refund policy?",
    keywords: ["refund policy","policy","terms","eligible","when refund","refund rules"],
    answer: "**SSV Dandiya Divas 2026 Refund Policy Summary:**\n\n✅ Eligible:\n• Duplicate / multiple bank deductions\n• Payment deducted but ticket not generated\n• Event permanently cancelled by SSV Group\n\n❌ Non-Refundable:\n• Personal unavailability or change of mind\n• No-show or late arrival on event day\n• Security denial at venue\n\n⏰ Processing: 5–7 working business days to original payment method.\n\nFull policy: /refund-policy",
  },
  {
    id: "refund-timeline",
    categoryId: "refund",
    question: "How long does a refund take?",
    keywords: ["how long","refund time","when will i get","timeline","days","processing time"],
    answer: "Eligible refunds are processed within **5 to 7 working business days** to the original payment method (UPI, Debit Card, Credit Card, or Net Banking).\n\nRefunds are credited only to the source account. We do not issue cash refunds or transfers to third-party accounts.",
  },
  // EVENT INFORMATION
  {
    id: "event-date-location",
    categoryId: "event",
    question: "When and where is the event?",
    keywords: ["when","where","date","time","location","venue","address","october","bidar","place","ground","rs open"],
    answer: "🗓️ **Date:** 14 October 2026 (Wednesday)\n⏰ **Time:** 5:00 PM to 10:00 PM IST\n📍 **Venue:** RS Open Ground, Beside Beldale Petrol Pump, Gumpa, Bidar, Karnataka\n\nAmple 2-wheeler & 4-wheeler parking available at the venue.",
  },
  {
    id: "who-performing",
    categoryId: "event",
    question: "Who is performing?",
    keywords: ["performing","artist","celebrity","performer","sp power","singer","dj","guest","star","show"],
    answer: "✨ **Special Attraction: SP POWER**\n\nSSV Dandiya Divas 2026 features:\n🎵 High-voltage DJ sets & live music\n💃 Traditional Dandiya Raas & Garba performances\n🏆 Ramp Walk fashion contest (1st Winner gets ₹5,000 Foreign Fits coupon!)\n🎁 Guaranteed ₹200 Foreign Fits shopping benefit for every person!\n\nUnforgettable Navratri celebration!",
  },
  {
    id: "event-timings",
    categoryId: "event",
    question: "What are the event timings?",
    keywords: ["timing","start time","end time","open","close","gate","how long","duration","schedule","5pm","10pm"],
    answer: "🕔 The event runs from **5:00 PM to 10:00 PM IST** on Wednesday, 14 October 2026.\n\nPlease arrive on time to enjoy the celebrity selfie session, Dandiya Raas, DJ performances, Ramp Walk, food stalls, and competitions.\n\nFor specific gate timings contact: 📞 **+91 86181 56721**",
  },
  // MY TICKET
  {
    id: "find-ticket",
    categoryId: "my-ticket",
    question: "Where can I find my ticket?",
    keywords: ["where is my ticket","find ticket","lost ticket","ticket missing","access ticket","download ticket","booking lookup"],
    answer: "Your digital ticket (QR pass) can be found:\n\n📧 **Email** — Check your inbox (and spam folder) for the booking confirmation email.\n🔍 **Booking Lookup** — Visit /booking and enter your booking reference or phone number.\n\nIf still unavailable, contact our helpline with your registered phone number and booking reference.",
  },
  {
    id: "ticket-not-received",
    categoryId: "my-ticket",
    question: "I didn't receive my ticket.",
    keywords: ["didn't receive","not received","no email","ticket not sent","missing ticket","spam","junk","no confirmation"],
    answer: "If you haven't received your ticket email:\n\n1. **Check Spam/Junk folder** — confirmation emails sometimes land there\n2. **Verify your email address** — check you entered the correct email during booking\n3. **Use Booking Lookup** — visit /booking with your phone or booking reference\n4. **Contact Support** — if payment succeeded but no ticket generated, call us immediately\n\n📞 **+91 86181 56721** (Call/WhatsApp)\n🕐 Available: 9:00 AM – 10:00 PM IST",
  },
  {
    id: "use-qr-ticket",
    categoryId: "my-ticket",
    question: "How do I use my QR ticket?",
    keywords: ["qr code","use ticket","scan","entry","show ticket","how to enter","gate","admission","check in"],
    answer: "Your ticket has a **unique QR code** that is your entry pass.\n\n📱 At the venue:\n1. Open your ticket on your phone\n2. Show the **QR code** at the entry gate\n3. Our team will scan it for instant verification\n4. Enjoy the event! 🎉\n\n**Tips:**\n• Maximize screen brightness before scanning\n• Each QR is valid for one-time entry only\n• Carry a valid government ID if required",
  },
  // CUSTOMER SUPPORT
  {
    id: "need-help",
    categoryId: "support",
    question: "I still need help.",
    keywords: ["still need help","more help","not answered","speak to someone","human","agent","other","something else"],
    answer: null,
  },
  {
    id: "contact-care",
    categoryId: "support",
    question: "How can I contact customer care?",
    keywords: ["contact","customer care","helpline","phone number","call","whatsapp","reach","support team","number"],
    answer: null,
  },
];

// ─── Matching Helpers ─────────────────────────────────────────────────────────

export function normalizeQuery(query: string): string {
  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function findFaqMatch(userQuery: string): FaqEntry | null {
  const normalized = normalizeQuery(userQuery);
  const words = normalized.split(" ").filter((w) => w.length > 2);

  let bestMatch: FaqEntry | null = null;
  let bestScore = 0;

  for (const entry of FAQ_ENTRIES) {
    if (normalizeQuery(entry.question) === normalized) return entry;

    let score = 0;
    for (const kw of entry.keywords) {
      if (normalized.includes(kw)) {
        score += kw.includes(" ") ? 3 : 1;
      }
    }
    for (const word of words) {
      if (entry.keywords.some((kw) => kw === word || kw.includes(word))) {
        score += 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  return bestScore >= 2 ? bestMatch : null;
}

export function getFaqByCategory(categoryId: CategoryId): FaqEntry[] {
  return FAQ_ENTRIES.filter((e) => e.categoryId === categoryId);
}
