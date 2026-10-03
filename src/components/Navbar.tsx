"use client";

import Link from "next/link";
import { useState } from "react";
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div
        className="bg-[#0f0202]/90 backdrop-blur-md border-b border-gold-800/20"
        style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo with Divine Ganesha Icon */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="transition-transform duration-300 group-hover:scale-110">
                <SSVLogo size={38} />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-sm font-display font-black tracking-widest ssv-gold-gradient"
                  >
                    SSV GROUP
                  </span>
                </div>
                <div
                  className="text-[10px] font-semibold tracking-wider uppercase text-amber-200/70"
                >
                  Together for More Joy
                </div>
              </div>
            </Link>

            {/* Desktop nav */}
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

            {/* CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/book" className="btn-primary text-xs px-5 py-2.5">
                <Ticket size={14} />
                Book Tickets
              </Link>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg transition-colors duration-200"
              style={{ color: "#D4A017" }}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div
            className="md:hidden border-t"
            style={{ borderColor: "rgba(212,160,23,0.15)" }}
          >
            <nav className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-medium tracking-wide transition-all duration-200"
                  style={{
                    color: "rgba(255,248,220,0.7)",
                    background: "rgba(26,5,5,0.5)",
                    border: "1px solid rgba(212,160,23,0.1)",
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/book"
                onClick={() => setIsOpen(false)}
                className="btn-primary w-full text-center text-xs py-3 mt-2"
              >
                <Ticket size={14} />
                BOOK TICKETS
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
