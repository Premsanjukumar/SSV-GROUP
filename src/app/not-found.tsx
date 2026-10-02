import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Compass, Home, Ticket } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12" style={{ background: "#0f0202" }}>
        <div className="card-festive max-w-lg w-full p-8 md:p-12 text-center space-y-6">
          <div
            className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(139,0,0,0.5), rgba(192,57,43,0.3))",
              border: "1px solid rgba(212,160,23,0.3)",
            }}
          >
            <Compass size={36} style={{ color: "#D4A017" }} />
          </div>

          <div>
            <h1 className="font-display font-black text-4xl mb-2" style={{ color: "#D4A017" }}>
              404
            </h1>
            <h2 className="font-display font-bold text-xl mb-3" style={{ color: "#FFF8DC" }}>
              Page Not Found
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,248,220,0.5)" }}>
              The page you are looking for might have been moved or does not exist. Let&apos;s get you back to the celebration.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/" className="btn-gold w-full sm:w-auto px-6 py-3 text-sm">
              <Home size={16} /> Return Home
            </Link>
            <Link href="/book" className="btn-outline w-full sm:w-auto px-6 py-3 text-sm">
              <Ticket size={16} /> Book Tickets
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
