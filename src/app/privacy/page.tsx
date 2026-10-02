import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Metadata } from "next";
import { ShieldCheck, Lock, Database, UserCheck, EyeOff, FileText, Phone, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | SSV Dandiya Divas 2026",
  description:
    "Official Privacy Policy for SSV Dandiya Divas 2026 & SSV Group. Learn how we collect, use, protect, and safeguard your personal data.",
};

export default function PrivacyPolicyPage() {
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
            <ShieldCheck size={14} />
            Data Protection & Privacy
          </div>
          <h1
            className="font-display font-black text-3xl sm:text-4xl md:text-5xl mb-4"
            style={{ color: "#D4A017" }}
          >
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base max-w-2xl mx-auto" style={{ color: "rgba(255,248,220,0.6)" }}>
            SSV Group is committed to protecting your privacy and ensuring your personal information is handled securely and responsibly.
          </p>
          <div className="mt-3 text-xs" style={{ color: "rgba(212,160,23,0.7)" }}>
            Effective Date: October 2026 • SSV Group, Bidar, Karnataka, India
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Section 1: Introduction */}
          <section className="card-festive p-6 sm:p-8 rounded-2xl border border-gold-800/30">
            <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-3" style={{ color: "#D4A017" }}>
              <FileText size={20} className="text-gold-400" />
              1. Overview
            </h2>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: "rgba(255,248,220,0.75)" }}>
              This Privacy Policy explains how <strong>SSV Group</strong> (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) collects, stores, processes, and protects personal data gathered through our official ticketing portal for <strong>SSV Dandiya Divas 2026</strong>. By accessing our platform and booking tickets, you consent to the data practices described herein in accordance with the <em>Information Technology Act, 2000</em> and the <em>Digital Personal Data Protection Act (DPDPA), 2023</em>.
            </p>
          </section>

          {/* Section 2: Data We Collect */}
          <section className="card-festive p-6 sm:p-8 rounded-2xl border border-gold-800/30">
            <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-3" style={{ color: "#D4A017" }}>
              <Database size={20} className="text-gold-400" />
              2. Information We Collect
            </h2>
            <div className="space-y-4 text-sm sm:text-base leading-relaxed" style={{ color: "rgba(255,248,220,0.75)" }}>
              <p>We only collect the essential information required to issue your event tickets and ensure smooth venue entry:</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                  <div>
                    <strong>Personal Identification & Contact:</strong> Full Name, Mobile / WhatsApp Number, Email Address, and City.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                  <div>
                    <strong>Booking & Transaction Details:</strong> Unique Booking Reference Number, Ticket Tier, Quantity, Pass Type, Amount Paid, and Payment Gateway Transaction Reference ID.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-gold-400 mt-2 flex-shrink-0" />
                  <div>
                    <strong>Technical & Device Data:</strong> Browser type, operating system, IP address, and session timestamps for security logging and anti-fraud monitoring.
                  </div>
                </li>
              </ul>
              <div className="mt-4 p-4 rounded-xl bg-[#140404] border border-gold-800/20 text-xs text-gold-300">
                <strong>Important Note on Financial Data:</strong> SSV Group <strong>never</strong> collects, stores, or processes sensitive card numbers, CVVs, UPI PINs, or bank passwords. All payments are processed on PCI-DSS certified secure payment gateways (e.g., Razorpay/Bank switches).
              </div>
            </div>
          </section>

          {/* Section 3: How We Use Information */}
          <section className="card-festive p-6 sm:p-8 rounded-2xl border border-gold-800/30">
            <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-3" style={{ color: "#D4A017" }}>
              <UserCheck size={20} className="text-gold-400" />
              3. Purpose of Processing
            </h2>
            <div className="space-y-3 text-sm sm:text-base leading-relaxed" style={{ color: "rgba(255,248,220,0.75)" }}>
              <p>We use your information exclusively for the following operational purposes:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Issuing your digital PDF tickets with encrypted QR verification codes.</li>
                <li>Delivering booking confirmation emails, SMS receipts, and event reminders.</li>
                <li>Verifying ticket validity at entry gates and managing capacity at the venue.</li>
                <li>Assisting you with customer support, booking inquiries, or ticket recovery.</li>
                <li>Detecting and preventing unauthorized ticket scalping, duplicate entries, or fraud.</li>
              </ul>
            </div>
          </section>

          {/* Section 4: Data Security */}
          <section className="card-festive p-6 sm:p-8 rounded-2xl border border-gold-800/30">
            <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-3" style={{ color: "#D4A017" }}>
              <Lock size={20} className="text-gold-400" />
              4. Data Protection & Security Measures
            </h2>
            <div className="space-y-3 text-sm sm:text-base leading-relaxed" style={{ color: "rgba(255,248,220,0.75)" }}>
              <p>
                We employ industry-standard administrative, physical, and technical security safeguards:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>End-to-end 256-bit SSL/TLS encryption for all data transmissions.</li>
                <li>Encrypted database storage with role-based access control (RBAC).</li>
                <li>Secure QR signature hashing to prevent barcode forging and ticket duplication.</li>
              </ul>
            </div>
          </section>

          {/* Section 5: Third-Party Sharing */}
          <section className="card-festive p-6 sm:p-8 rounded-2xl border border-gold-800/30">
            <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-3" style={{ color: "#D4A017" }}>
              <EyeOff size={20} className="text-gold-400" />
              5. No Selling of Personal Data
            </h2>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: "rgba(255,248,220,0.75)" }}>
              <strong>We do not sell, rent, or trade your personal information</strong> to third-party advertisers or marketing agencies. Data is shared solely with trusted service providers essential for delivering the service (payment gateway providers, transactional SMS/email dispatchers, and authorized on-ground security gate scanners).
            </p>
          </section>

          {/* Section 6: Grievance Officer */}
          <section className="card-festive p-6 sm:p-8 rounded-2xl border border-gold-800/30">
            <h2 className="text-xl font-bold font-display mb-4" style={{ color: "#D4A017" }}>
              6. Grievance Officer & Contact Information
            </h2>
            <div className="space-y-4 text-sm sm:text-base leading-relaxed" style={{ color: "rgba(255,248,220,0.75)" }}>
              <p>
                If you have any questions, concerns, or requests regarding your personal data or privacy rights, please contact our Grievance Officer:
              </p>
              <div className="p-4 rounded-xl bg-[#1a0505] border border-gold-800/20 space-y-2 text-sm">
                <div><strong>Entity:</strong> SSV Group (SSV Dandiya Divas 2026)</div>
                <div><strong>Address:</strong> Beside Beladale Petrol Pump, Gumpa, Bidar, Karnataka 585403, India</div>
                <div><strong>Helpline:</strong> +91 86181 56721 / +91 94826 29007</div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
