import Link from "next/link";
import { Phone, Mail, MapPin, Instagram, Youtube } from "lucide-react";

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
  "SSV Baby Pops Studio",
  "SSV Finance and Auto Leasing",
  "SSV Ads and Marketing",
  "SSV Boys PG / Hostel",
  "SSV Catering",
];

export default function Footer() {
  return (
    <footer
      style={{
        background:
          "linear-gradient(180deg, #0f0202 0%, #1a0505 50%, #0f0202 100%)",
        borderTop: "1px solid rgba(212,160,23,0.15)",
      }}
    >
      {/* Sponsors strip */}
      <div
        className="border-b"
        style={{ borderColor: "rgba(212,160,23,0.1)" }}
      >
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p
            className="text-center text-xs tracking-widest uppercase font-semibold mb-6"
            style={{ color: "rgba(212,160,23,0.6)" }}
          >
            Our Sponsors
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {sponsors.map((s) => (
              <span
                key={s}
                className="sponsor-card text-xs"
                style={{ color: "rgba(255,248,220,0.6)" }}
              >
                {s}
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
            <div
              className="font-display text-2xl font-bold mb-2"
              style={{ color: "#D4A017" }}
            >
              SSV GROUP
            </div>
            <p
              className="text-xs tracking-widest uppercase mb-4"
              style={{ color: "rgba(255,248,220,0.4)" }}
            >
              Tradition • Music • Dance • Togetherness
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "rgba(255,248,220,0.5)" }}
            >
              Creating unforgettable Navratri experiences in Bidar, Karnataka.
              Join us for Dandiya Divas 2026!
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3
              className="text-xs font-bold tracking-widest uppercase mb-5"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200 hover:text-gold-400"
                    style={{ color: "rgba(255,248,220,0.55)" }}
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
              className="text-xs font-bold tracking-widest uppercase mb-5"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              Policies & Legal
            </h3>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200 hover:text-gold-400"
                    style={{ color: "rgba(255,248,220,0.55)" }}
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
              className="text-xs font-bold tracking-widest uppercase mb-5"
              style={{ color: "rgba(212,160,23,0.7)" }}
            >
              Contact & Helpline
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone
                  size={14}
                  className="mt-0.5 flex-shrink-0"
                  style={{ color: "#D4A017" }}
                />
                <div>
                  <a
                    href="tel:+918618156721"
                    className="block text-sm transition-colors hover:text-gold-400"
                    style={{ color: "rgba(255,248,220,0.7)" }}
                  >
                    +91 86181 56721
                  </a>
                  <a
                    href="tel:+919482629007"
                    className="block text-sm transition-colors hover:text-gold-400"
                    style={{ color: "rgba(255,248,220,0.7)" }}
                  >
                    +91 94826 29007
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin
                  size={14}
                  className="mt-0.5 flex-shrink-0"
                  style={{ color: "#D4A017" }}
                />
                <span
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(255,248,220,0.55)" }}
                >
                  Beside Beladale Petrol Pump,
                  <br />
                  Gumpa, Bidar, Karnataka
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderColor: "rgba(212,160,23,0.1)" }}
        >
          <p
            className="text-xs"
            style={{ color: "rgba(255,248,220,0.3)" }}
          >
            © 2026 SSV Group. All rights reserved.
          </p>
          <p
            className="text-xs"
            style={{ color: "rgba(255,248,220,0.3)" }}
          >
            SSV Dandiya Divas 2026 — Bidar, Karnataka, India
          </p>
        </div>
      </div>
    </footer>
  );
}
