"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Users, QrCode, Settings, LogOut,
  Menu, X,
} from "lucide-react";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/bookings", icon: Users, label: "Bookings" },
  { href: "/admin/scanner", icon: QrCode, label: "QR Scanner" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function AdminNav({ adminName }: { adminName?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <>
      {/* Mobile header */}
      <header
        className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14"
        style={{ background: "#1a0505", borderBottom: "1px solid rgba(212,160,23,0.15)" }}
      >
        <div className="font-display font-bold text-sm" style={{ color: "#D4A017" }}>
          SSV Admin
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ color: "#D4A017" }}
          aria-label="Toggle navigation">
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/60" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 flex flex-col admin-sidebar transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-6 border-b" style={{ borderColor: "rgba(212,160,23,0.15)" }}>
          <div className="font-display font-bold text-lg" style={{ color: "#D4A017" }}>
            SSV GROUP
          </div>
          <div className="text-xs mt-0.5" style={{ color: "rgba(255,248,220,0.4)" }}>
            Admin Dashboard
          </div>
          {adminName && (
            <div className="text-xs mt-3 px-2 py-1.5 rounded-lg"
              style={{ background: "rgba(212,160,23,0.1)", color: "rgba(212,160,23,0.8)" }}>
              👤 {adminName}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`admin-nav-item ${pathname === href || (href !== "/admin" && pathname.startsWith(href)) ? "active" : ""}`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t" style={{ borderColor: "rgba(212,160,23,0.1)" }}>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="admin-nav-item w-full"
            style={{ color: "rgba(255,107,107,0.7)" }}
          >
            <LogOut size={18} />
            {loggingOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </aside>
    </>
  );
}
