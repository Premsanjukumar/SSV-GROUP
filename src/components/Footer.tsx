import Link from "next/link";
import { Phone, MapPin } from "lucide-react";
import SSVLogo from "@/components/SSVLogo";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/event", label: "Event Details" },
  { href: "/book", label: "Book Tickets" },
  { href: "/contact", label: "Contact Us" },
];

const legalLinks = [
  { href: "/return-policy", label: "Return Policy" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/disclaimer", label: "Disclaimer" },
];

const sponsors = [
  "SSV Photography and Films",
  "SSV Baby Props Studio",
  "SSV Finance and Autoleasing",
  "SSV Boys PG / Hostel",
  "SSV Ads and Marketing",
  "SSV Catring",
];

export default function Footer() {
  return (
    <footer
      style={{
        background:
          "linear-gradient(180deg, #0a0101 0%, #1a0505 50%, #0a0101 100%)",
        borderTop: "1px solid rgba(212,160,23,0.25)",
      }}
    >
      {/* Sponsors strip */}
      <div
        className="border-b"
        style={{ borderColor: "rgba(212,160,23,0.15)" }}
      >
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-sm animate-crown">👑</span>
            <p
              className="text-center text-xs tracking-widest uppercase font-bold text-amber-300"
            >
              Organised by SSV GROUP — Our Sponsors
            </p>
            <span className="text-sm animate-crown">👑</span>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {sponsors.map((s) => (
              <span
                key={s}
                className="sponsor-card text-xs font-semibold px-4 py-2 border border-gold-800/30 bg-black/40 text-amber-200/90"
              >
                ✨ {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-3">
              <SSVLogo size={42} />
              <div>
                <div
                  className="font-display text-2xl font-black ssv-gold-gradient tracking-wider"
                >
                  SSV GROUP
                </div>
                <p
                  className="text-[10px] tracking-widest uppercase text-amber-300 font-semibold"
                >
                  Together for More Joy
                </p>
              </div>
            </div>
            <p
              className="text-[11px] tracking-wider uppercase mb-4 text-amber-100/50"
            >
              Same Vibes • New Memories
            </p>
            <p
              className="text-sm leading-relaxed text-amber-100/60"
            >
              Creating unforgettable Dandiya & Navratri experiences in Bidar, Karnataka. Join us on 14 October 2026!
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3
              className="text-xs font-bold tracking-widest uppercase mb-5 text-amber-400"
            >
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200 hover:text-amber-300 text-amber-100/60"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies & Legal */}
          <div>
            <h3
              className="text-xs font-bold tracking-widest uppercase mb-5 text-amber-400"
            >
              Policies & Legal
            </h3>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200 hover:text-amber-300 text-amber-100/60"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3
              className="text-xs font-bold tracking-widest uppercase mb-5 text-amber-400"
            >
              Contact & Helpline
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone
                  size={14}
                  className="mt-1 flex-shrink-0 text-amber-400"
                />
                <div className="space-y-1">
                  <a
                    href="tel:+918618156721"
                    className="block text-sm transition-colors hover:text-amber-300 text-amber-100/80"
                  >
                    +91 86181 56721
                  </a>
                  <a
                    href="tel:+919482629007"
                    className="block text-sm transition-colors hover:text-amber-300 text-amber-100/80"
                  >
                    +91 94826 29007
                  </a>
                  <a
                    href="tel:+918431812193"
                    className="block text-sm transition-colors hover:text-amber-300 text-amber-100/80"
                  >
                    +91 84318 12193
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin
                  size={14}
                  className="mt-1 flex-shrink-0 text-amber-400"
                />
                <span className="text-xs leading-relaxed text-amber-100/60">
                  RS Open Ground, Beside Beldale Petrol Pump, Gumpa, Bidar, Karnataka
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="border-t mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
          style={{
            borderColor: "rgba(212,160,23,0.1)",
            color: "rgba(255,248,220,0.35)",
          }}
        >
          <div>
            © 2026 <strong className="text-amber-300">SSV GROUP</strong>. All rights reserved.
          </div>
          <div className="text-center sm:text-right">
            Dandiya Night 2026 — RS Open Ground, Bidar
          </div>
        </div>
      </div>
    </footer>
  );
}
