"use client";

import { useState, useEffect } from "react";
import {
  Users, Ticket, IndianRupee, UserCheck, TrendingUp, CheckCircle, Loader2,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

interface Stats {
  totalBookings: number;
  paidBookings: number;
  ticketsSold: number;
  totalRevenuePaise: number;
  singleSold: number;
  coupleSold: number;
  checkedIn: number;
}

interface RecentBooking {
  id: string;
  bookingRef: string;
  customerName: string;
  customerPhone: string;
  ticketType: string;
  quantity: number;
  totalInPaise: number;
  status: string;
  paymentStatus: string;
  checkedIn: boolean;
  createdAt: string;
}

interface SalesPoint {
  date: string;
  bookings: number;
  revenue: number;
}

function StatCard({
  icon: Icon, label, value, sub, color,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}25`, border: `1px solid ${color}40` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
      </div>
      <div className="font-display font-black text-2xl mb-1" style={{ color: "#FFF8DC" }}>
        {value}
      </div>
      <div className="text-xs font-semibold tracking-wide" style={{ color: "rgba(255,248,220,0.5)" }}>
        {label}
      </div>
      {sub && (
        <div className="text-xs mt-1" style={{ color: "rgba(255,248,220,0.3)" }}>{sub}</div>
      )}
    </div>
  );
}

function formatCurrency(paise: number) {
  return "₹" + (paise / 100).toLocaleString("en-IN");
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    PAID: { bg: "rgba(45,80,22,0.3)", text: "#90ee90" },
    PENDING: { bg: "rgba(180,120,0,0.2)", text: "#ffd700" },
    FAILED: { bg: "rgba(139,0,0,0.3)", text: "#ff6b6b" },
    CANCELLED: { bg: "rgba(60,60,60,0.3)", text: "#aaa" },
    REFUNDED: { bg: "rgba(60,60,120,0.3)", text: "#99aaff" },
  };
  const c = colors[status] || { bg: "rgba(60,60,60,0.3)", text: "#aaa" };
  return (
    <span
      className="inline-flex px-2 py-0.5 rounded text-xs font-bold"
      style={{ background: c.bg, color: c.text }}
    >
      {status}
    </span>
  );
}

const PIE_COLORS = ["#C0392B", "#D4A017"];

export default function AdminDashboardClient() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [salesChart, setSalesChart] = useState<SalesPoint[]>([]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) return;
      const data = await res.json();
      setStats(data.stats);
      setRecentBookings(data.recentBookings);
      setSalesChart(data.salesChart);
    } catch {/* silent */}
    finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" size={32} style={{ color: "#D4A017" }} />
      </div>
    );
  }

  const pieData = [
    { name: "Single Pass", value: stats?.singleSold || 0 },
    { name: "Couple Pass", value: stats?.coupleSold || 0 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl" style={{ color: "#D4A017" }}>
          Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,248,220,0.4)" }}>
          SSV Dandiya Divas 2026 — Live Overview
        </p>
      </div>

      {/* Stats grid */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Total Bookings" value={String(stats.totalBookings)} color="#D4A017" />
          <StatCard icon={Ticket} label="Tickets Sold" value={String(stats.ticketsSold)} color="#C0392B" />
          <StatCard icon={IndianRupee} label="Total Revenue" value={formatCurrency(stats.totalRevenuePaise)} color="#FF6B00" />
          <StatCard icon={CheckCircle} label="Checked In" value={String(stats.checkedIn)} color="#90ee90" />
          <StatCard icon={Ticket} label="Single Passes" value={String(stats.singleSold)} sub="Women Only" color="#D4A017" />
          <StatCard icon={Ticket} label="Couple Passes" value={String(stats.coupleSold)} color="#C0392B" />
          <StatCard icon={TrendingUp} label="Paid Bookings" value={String(stats.paidBookings)} color="#FF8C00" />
          <StatCard icon={UserCheck} label="Entry Rate" value={stats.ticketsSold > 0 ? `${Math.round((stats.checkedIn / stats.ticketsSold) * 100)}%` : "0%"} color="#90ee90" />
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales chart */}
        <div className="lg:col-span-2 card-festive p-6">
          <h2 className="font-bold text-base mb-6" style={{ color: "#FFF8DC" }}>
            Sales (Last 30 Days)
          </h2>
          {salesChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={salesChart}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4A017" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#D4A017" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,160,23,0.1)" />
                <XAxis dataKey="date" tick={{ fill: "rgba(255,248,220,0.4)", fontSize: 10 }}
                  tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fill: "rgba(255,248,220,0.4)", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ background: "#1a0505", border: "1px solid rgba(212,160,23,0.3)", borderRadius: 8, color: "#FFF8DC" }}
                  formatter={(v, name) => name === "revenue" ? [formatCurrency(Number(v)), "Revenue"] : [v, "Bookings"]}
                />
                <Area type="monotone" dataKey="bookings" stroke="#C0392B" fill="none" strokeWidth={2} />
                <Area type="monotone" dataKey="revenue" stroke="#D4A017" fill="url(#colorRevenue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48"
              style={{ color: "rgba(255,248,220,0.3)" }}>
              No sales data yet
            </div>
          )}
        </div>

        {/* Pie chart */}
        <div className="card-festive p-6">
          <h2 className="font-bold text-base mb-6" style={{ color: "#FFF8DC" }}>
            Ticket Split
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={85}
                paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#1a0505", border: "1px solid rgba(212,160,23,0.3)", borderRadius: 8 }} />
              <Legend formatter={(v) => <span style={{ color: "rgba(255,248,220,0.7)", fontSize: 12 }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="card-festive overflow-hidden">
        <div className="px-6 py-4 border-b" style={{ borderColor: "rgba(212,160,23,0.1)" }}>
          <h2 className="font-bold text-base" style={{ color: "#FFF8DC" }}>Recent Bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "rgba(26,5,5,0.8)" }}>
                {["Booking Ref", "Name", "Ticket", "Qty", "Amount", "Status", "Checked In", "Date"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold tracking-widest"
                    style={{ color: "rgba(212,160,23,0.7)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10" style={{ color: "rgba(255,248,220,0.3)" }}>
                    No bookings yet
                  </td>
                </tr>
              ) : (
                recentBookings.map((b) => (
                  <tr key={b.id}
                    className="border-t transition-colors hover:bg-maroon-950/30 cursor-pointer"
                    style={{ borderColor: "rgba(212,160,23,0.06)" }}
                    onClick={() => window.location.href = `/admin/bookings?q=${encodeURIComponent(b.bookingRef)}`}
                  >
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "#D4A017" }}>{b.bookingRef}</td>
                    <td className="px-4 py-3" style={{ color: "#FFF8DC" }}>{b.customerName}</td>
                    <td className="px-4 py-3" style={{ color: "rgba(255,248,220,0.7)" }}>{b.ticketType}</td>
                    <td className="px-4 py-3 text-center" style={{ color: "rgba(255,248,220,0.7)" }}>{b.quantity}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: "#D4A017" }}>{formatCurrency(b.totalInPaise)}</td>
                    <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold ${b.checkedIn ? "text-green-400" : ""}`}
                        style={{ color: b.checkedIn ? "#90ee90" : "rgba(255,248,220,0.3)" }}>
                        {b.checkedIn ? "✓ YES" : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "rgba(255,248,220,0.4)" }}>
                      {new Date(b.createdAt).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
