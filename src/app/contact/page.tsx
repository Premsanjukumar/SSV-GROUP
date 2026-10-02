import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Metadata } from "next";
import { Phone, MapPin, Mail, Clock, Ticket, MessageSquare, ExternalLink, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | SSV Dandiya Divas 2026",
  description:
    "Contact SSV Group for ticketing queries, group bookings, sponsorship, and venue assistance for Dandiya Divas 2026 in Bidar.",
};

export default function ContactPage() {
  const mapsUrl =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL ||
    "https://maps.google.com/maps?q=Beside+Beladale+Petrol+Pump,+Gumpa,+Bidar,+Karnataka,+India";

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-[#0f0202]">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4"
            style={{
              background: "rgba(109,11,11,0.4)",
              border: "1px solid rgba(212,160,23,0.3)",
              color: "#D4A017",
            }}
          >
            <MessageSquare size={14} />
            Support & Inquiries
          </div>
          <h1
            className="font-display font-black text-3xl sm:text-4xl md:text-5xl mb-4"
            style={{ color: "#D4A017" }}
          >
            Get In Touch
          </h1>
          <p className="text-sm sm:text-base max-w-2xl mx-auto" style={{ color: "rgba(255,248,220,0.6)" }}>
            Need help with your tickets, bulk group passes, sponsorship opportunities, or venue directions? We&apos;re here to assist you!
          </p>
        </div>

        {/* Main Grid */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Call & WhatsApp Card */}
          <div className="card-festive p-6 sm:p-8 rounded-2xl border border-gold-800/30 flex flex-col justify-between">
            <div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                style={{
                  background: "linear-gradient(135deg, #8B0000, #C0392B)",
                  border: "1px solid rgba(212,160,23,0.3)",
                }}
              >
                <Phone size={22} style={{ color: "#D4A017" }} />
              </div>
              <h2 className="text-xl font-bold font-display mb-2" style={{ color: "#D4A017" }}>
                Helpline & WhatsApp
              </h2>
              <p className="text-sm mb-6" style={{ color: "rgba(255,248,220,0.6)" }}>
                Speak directly with our ticketing support team or drop a WhatsApp message for instant booking assistance.
              </p>
              <div className="space-y-4">
                <a
                  href="tel:+918618156721"
                  className="flex items-center justify-between p-4 rounded-xl transition-all border border-gold-800/20 hover:border-gold-500/50 bg-[#150404]"
                >
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-gold-400" />
                    <div>
                      <div className="text-xs text-gold-400 font-semibold uppercase">Helpline 1</div>
                      <div className="text-base font-bold text-white tracking-wide">+91 86181 56721</div>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-gold-900/40 text-gold-300 font-medium">Call / WhatsApp</span>
                </a>

                <a
                  href="tel:+919482629007"
                  className="flex items-center justify-between p-4 rounded-xl transition-all border border-gold-800/20 hover:border-gold-500/50 bg-[#150404]"
                >
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-gold-400" />
                    <div>
                      <div className="text-xs text-gold-400 font-semibold uppercase">Helpline 2</div>
                      <div className="text-base font-bold text-white tracking-wide">+91 94826 29007</div>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-gold-900/40 text-gold-300 font-medium">Call / WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gold-800/20 flex items-center gap-2 text-xs text-gold-400">
              <Clock size={14} /> Available 9:00 AM – 10:00 PM IST (Daily)
            </div>
          </div>

          {/* Venue & Location Card */}
          <div className="card-festive p-6 sm:p-8 rounded-2xl border border-gold-800/30 flex flex-col justify-between">
            <div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                style={{
                  background: "linear-gradient(135deg, #8B0000, #C0392B)",
                  border: "1px solid rgba(212,160,23,0.3)",
                }}
              >
                <MapPin size={22} style={{ color: "#D4A017" }} />
              </div>
              <h2 className="text-xl font-bold font-display mb-2" style={{ color: "#D4A017" }}>
                Event Venue
              </h2>
              <p className="text-sm mb-6" style={{ color: "rgba(255,248,220,0.6)" }}>
                SSV Dandiya Divas 2026 takes place at the prime celebratory grounds in Gumpa, Bidar.
              </p>
              <div className="p-4 rounded-xl border border-gold-800/20 bg-[#150404] space-y-2 mb-6">
                <div className="font-bold text-base text-white">Beside Beladale Petrol Pump</div>
                <div className="text-sm text-gold-200">Gumpa, Bidar, Karnataka — 585403</div>
                <div className="text-xs text-gold-400/80">Ample 2-wheeler and 4-wheeler parking available.</div>
              </div>
            </div>

            <div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full text-center text-xs py-3 justify-center inline-flex items-center gap-2"
              >
                <MapPin size={16} /> Open Location in Google Maps <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Quick Ticket CTA */}
        <div className="max-w-5xl mx-auto card-festive p-8 rounded-2xl border border-gold-800/30 text-center">
          <Sparkles className="w-8 h-8 text-gold-400 mx-auto mb-3" />
          <h2 className="text-2xl font-bold font-display mb-2" style={{ color: "#D4A017" }}>
            Ready for Dandiya Divas 2026?
          </h2>
          <p className="text-sm mb-6 max-w-xl mx-auto" style={{ color: "rgba(255,248,220,0.7)" }}>
            Book your digital pass in advance to avoid last-minute rush at the counters. Instant instant confirmation and QR pass generation!
          </p>
          <Link href="/book" className="btn-gold px-8 py-3.5 text-sm inline-flex items-center gap-2">
            <Ticket size={16} /> Book Tickets Now
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
