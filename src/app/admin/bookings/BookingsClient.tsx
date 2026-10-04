"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Download, Loader2, Filter, Mail } from "lucide-react";
import Link from "next/link";

interface Booking {
  id: string;
  bookingRef: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  ticketType: string;
  quantity: number;
  totalInPaise: number;
  status: string;
  paymentStatus: string;
  emailDeliveryStatus?: string;
  isDemoPayment: boolean;
  checkedIn: boolean;
  checkedInAt: string | null;
  createdAt: string;
}

function formatCurrency(paise: number) {
  return "₹" + (paise / 100).toLocaleString("en-IN");
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PAID: "#90ee90", PENDING: "#ffd700", FAILED: "#ff6b6b",
    CANCELLED: "#aaa", REFUNDED: "#99aaff",
  };
  return (
    <span className="text-xs font-bold px-2 py-0.5 rounded"
      style={{ background: `${colors[status] || "#aaa"}20`, color: colors[status] || "#aaa" }}>
      {status}
    </span>
  );
}

function EmailDeliveryBadge({ status }: { status?: string }) {
  const normalized = status || "PENDING";
  const colors: Record<string, { bg: string; color: string; label: string }> = {
    SENT: { bg: "rgba(39,174,96,0.2)", color: "#90ee90", label: "✓ Sent" },
    DELIVERED: { bg: "rgba(39,174,96,0.2)", color: "#90ee90", label: "✓ Delivered" },
    FAILED: { bg: "rgba(235,87,87,0.2)", color: "#ff6b6b", label: "✕ Failed" },
    QUEUED: { bg: "rgba(242,201,76,0.2)", color: "#ffd700", label: "⏳ Queued" },
    PENDING: { bg: "rgba(255,255,255,0.1)", color: "#bbb", label: "• Pending" },
  };
  const c = colors[normalized] || colors.PENDING;
  return (
    <span className="text-[11px] font-semibold px-2 py-0.5 rounded inline-block"
      style={{ background: c.bg, color: c.color }}>
      {c.label}
    </span>
  );
}

export default function BookingsClient() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [checkedIn, setCheckedIn] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ q, status, checkedIn, page: String(page) });
      const res = await fetch(`/api/admin/bookings?${params}`);
      if (!res.ok) return;
      const data = await res.json();
      setBookings(data.bookings);
      setTotal(data.total);
      setPages(data.pages);
    } finally {
      setLoading(false);
    }
  }, [q, status, checkedIn, page]);

  useEffect(() => {
    const timer = setTimeout(fetchBookings, 300);
    return () => clearTimeout(timer);
  }, [fetchBookings]);

  async function handleResendEmail(e: React.MouseEvent, bookingId: string, customerEmail: string) {
    e.stopPropagation();
    if (!confirm(`Resend the official ticket PDF email to ${customerEmail}?`)) return;
    setResendingId(bookingId);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/resend-email`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(`✓ Ticket email successfully resent to ${customerEmail}!`);
        fetchBookings();
      } else {
        alert(data.error || data.message || "Failed to resend ticket email.");
      }
    } catch {
      alert("Network error while attempting to resend ticket email.");
    } finally {
      setResendingId(null);
    }
  }

  function exportCSV() {
    const headers = ["Booking Ref", "Name", "Phone", "Email", "Ticket", "Qty", "Amount", "Status", "Email Status", "Checked In", "Date"];
    const rows = bookings.map((b) => [
      b.bookingRef, b.customerName, b.customerPhone, b.customerEmail,
      b.ticketType, b.quantity, (b.totalInPaise / 100).toFixed(2),
      b.status, b.emailDeliveryStatus || "PENDING", b.checkedIn ? "Yes" : "No",
      new Date(b.createdAt).toLocaleDateString("en-IN"),
    ]);
    const csv = [headers, ...rows].map((r) => r.map(String).map((v) => `"${v.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SSV-Bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl" style={{ color: "#D4A017" }}>Bookings</h1>
          <p className="text-sm" style={{ color: "rgba(255,248,220,0.4)" }}>{total} total bookings</p>
        </div>
        <button onClick={exportCSV} className="btn-outline text-xs px-4 py-2.5">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="card-festive p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(212,160,23,0.5)" }} />
          <input
            type="text"
            className="form-input pl-9 text-sm py-2.5"
            placeholder="Search name, phone, email, ref..."
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
          />
        </div>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="form-input text-sm py-2.5 w-auto">
          <option value="">All Statuses</option>
          {["PAID", "PENDING", "FAILED", "CANCELLED", "REFUNDED"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select value={checkedIn} onChange={(e) => { setCheckedIn(e.target.value); setPage(1); }}
          className="form-input text-sm py-2.5 w-auto">
          <option value="">All Entry Status</option>
          <option value="true">Checked In</option>
          <option value="false">Not Checked In</option>
        </select>
      </div>

      {/* Table */}
      <div className="card-festive overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin" size={24} style={{ color: "#D4A017" }} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "rgba(26,5,5,0.8)" }}>
                  {["Ref", "Name", "Phone", "Ticket", "Qty", "Amount", "Payment", "Email", "Entry", "Action"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold tracking-widest"
                      style={{ color: "rgba(212,160,23,0.7)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr><td colSpan={10} className="text-center py-12" style={{ color: "rgba(255,248,220,0.3)" }}>
                    No bookings found
                  </td></tr>
                ) : bookings.map((b) => (
                  <tr key={b.id}
                    className="border-t cursor-pointer transition-colors"
                    style={{ borderColor: "rgba(212,160,23,0.06)" }}
                    onClick={() => window.location.href = `/admin/bookings/${b.id}`}
                  >
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "#D4A017" }}>{b.bookingRef}</td>
                    <td className="px-4 py-3" style={{ color: "#FFF8DC" }}>
                      <div>{b.customerName}</div>
                      <div className="text-xs" style={{ color: "rgba(255,248,220,0.4)" }}>{b.customerEmail}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "rgba(255,248,220,0.7)" }}>{b.customerPhone}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: "rgba(255,248,220,0.7)" }}>
                      {b.ticketType}
                      {b.isDemoPayment && <span className="ml-1 text-yellow-400 text-[10px]">[DEMO]</span>}
                    </td>
                    <td className="px-4 py-3 text-center" style={{ color: "rgba(255,248,220,0.7)" }}>{b.quantity}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: "#D4A017" }}>{formatCurrency(b.totalInPaise)}</td>
                    <td className="px-4 py-3"><StatusBadge status={b.paymentStatus} /></td>
                    <td className="px-4 py-3"><EmailDeliveryBadge status={b.emailDeliveryStatus} /></td>
                    <td className="px-4 py-3 text-xs font-bold"
                      style={{ color: b.checkedIn ? "#90ee90" : "rgba(255,248,220,0.3)" }}>
                      {b.checkedIn ? "✓ In" : "—"}
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      {(b.paymentStatus === "PAID" || b.status === "CONFIRMED") ? (
                        <button
                          type="button"
                          onClick={(e) => handleResendEmail(e, b.id, b.customerEmail)}
                          disabled={resendingId === b.id}
                          className="btn-outline text-[11px] py-1 px-2.5 flex items-center gap-1.5 whitespace-nowrap hover:border-amber-400 active:scale-95"
                          title="Resend official ticket email + PDF attachment to customer"
                        >
                          {resendingId === b.id ? (
                            <Loader2 size={12} className="animate-spin text-amber-400" />
                          ) : (
                            <Mail size={12} className="text-amber-400" />
                          )}
                          <span>Resend Email</span>
                        </button>
                      ) : (
                        <span className="text-xs text-stone-500">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
            className="btn-outline text-xs px-4 py-2 disabled:opacity-40">← Prev</button>
          <span className="text-sm" style={{ color: "rgba(255,248,220,0.5)" }}>Page {page} of {pages}</span>
          <button onClick={() => setPage(Math.min(pages, page + 1))} disabled={page === pages}
            className="btn-outline text-xs px-4 py-2 disabled:opacity-40">Next →</button>
        </div>
      )}
    </div>
  );
}
