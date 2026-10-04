"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Ticket } from "lucide-react";
import SSVLogo from "@/components/SSVLogo";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/event", label: "Event" },
  { href: "/book", label: "Tickets" },
  { href: "/#venue", label: "Venue" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu on Escape key
  useEffect(() => {
    function handleKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div
        className="bg-[#0f0202]/95 backdrop-blur-md border-b border-gold-800/20"
        style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.6)" }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo with Divine Ganesha Icon */}
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-3 group flex-shrink-0"
              aria-label="SSV GROUP Home"
            >
              <div className="transition-transform duration-300 group-hover:scale-105">
                <SSVLogo size={34} />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1">
                  <span className="text-xs sm:text-sm font-display font-black tracking-widest ssv-gold-gradient">
                    SSV GROUP
                  </span>
                </div>
                <div className="text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase text-amber-200/70 hidden min-[360px]:block">
                  Together for More Joy
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium tracking-wide transition-colors duration-200 hover:text-gold-400"
                  style={{ color: "rgba(255,248,220,0.7)" }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Side: Quick Action & Hamburger */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Quick Book Button visible on all screens */}
              <Link
                href="/book"
                className="btn-gold text-[11px] sm:text-xs px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg flex items-center gap-1.5 shadow-md font-bold"
              >
                <Ticket size={13} />
                <span>Book Tickets</span>
              </Link>

              {/* Mobile menu toggle button (min 44x44px touch target) */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden flex items-center justify-center w-11 h-11 rounded-lg transition-colors duration-200 text-amber-400 hover:bg-white/5 active:bg-white/10"
                aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isOpen}
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Navigation Menu */}
        {isOpen && (
          <div
            className="md:hidden border-t"
            style={{
              borderColor: "rgba(212,160,23,0.15)",
              background: "rgba(15,2,2,0.98)",
            }}
          >
            <nav className="px-4 py-3 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 text-cream/80 hover:text-amber-300 hover:bg-red-950/30 border border-gold-500/10"
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/book"
                onClick={() => setIsOpen(false)}
                className="btn-primary w-full text-center text-xs py-3.5 mt-2 flex items-center justify-center gap-2 shadow-lg"
              >
                <Ticket size={15} />
                BOOK TICKETS NOW
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
