# SSV Dandiya Divas 2026 — Official Ticket Booking Platform

A commercial-grade event ticketing and entry-management platform for **SSV Group's Dandiya Divas 2026** (14 October 2026, Bidar, Karnataka).

---

## 1. Project Overview

SSV Dandiya Divas 2026 is an end-to-end event ticketing platform featuring:
- **Customer Portal**: Multi-step ticket booking, mobile-first design, countdown timers, event information, venue maps, and sponsor highlights.
- **Payment Processing**: Dual-mode payment engine supporting both **Razorpay** and an offline/local **Demo Payment Mode**.
- **Digital & PDF Tickets**: Secure cryptographically generated QR code tickets and printable PDF downloads with zero floating-point calculation errors (all amounts stored in integer paise).
- **QR Entry Gate Scanner**: Mobile camera-ready scanner with instant sub-second validation, duplicate scan prevention, and manual check-in override.
- **Admin Dashboard**: Real-time sales analytics, ticket split visualizer, bookings management, CSV exports, and event configuration controls.

---

## 2. Key Features

- **Festive Visual Identity**: Deep maroon, festive red, saffron, and gold aesthetic with dynamic SVG Dandiya & Diya background animations.
- **Tiered Ticket Rules**: 
  - **Single Pass (₹299)**: Enforces women-only booking confirmation.
  - **Couple Pass (₹499)**: Passes for couples.
- **Oversale & Race Condition Protection**: Database-level atomic transactions to prevent capacity oversale.
- **Cryptographic QR Token Security**: QR codes encode secure verification endpoints (`/verify/[token]`) rather than plaintext IDs.
- **Email Confirmation**: Automatic transactional HTML confirmation emails with printable PDF ticket attachments via Nodemailer.
- **Manual Gate Check-in**: Allows gate staff to search by Booking ID, phone, or name if a customer's phone camera/screen is damaged.

---

## 3. Technology Stack

- **Framework**: Next.js 15 (App Router, React 18, TypeScript)
- **Styling**: Tailwind CSS & Vanilla CSS Design System with custom keyframe animations
- **Database & ORM**: PostgreSQL with Prisma ORM
- **Authentication**: Stateless HMAC-signed HTTP-Only JWT session cookies (8-hour expiration)
- **Payment Gateway**: Razorpay Node SDK with HMAC-SHA256 signature verification + Demo mode
- **QR Codes**: `qrcode` (generation) & `html5-qrcode` (camera scanner)
- **PDF Engine**: `jspdf` (client & server buffer generation)
- **Email Delivery**: `nodemailer` (SMTP)
- **Validation**: `zod` schemas on both client and server endpoints
- **Testing**: Vitest suite with 25 unit and integration tests

---

## 4. Requirements

- **Node.js**: v18.18.0 or higher (v20+ recommended)
- **Package Manager**: `npm` (v9+)
- **Database**: PostgreSQL (v14+) or Docker for local PostgreSQL

---

## 5. Installation

```bash
# 1. Clone or navigate to the repository
cd "SSV DD14 - 1"

# 2. Install dependencies
npm install
```

---

## 6. Environment Configuration

Copy `.env.example` to create your local `.env`:

```bash
cp .env.example .env
```

Key environment variables:

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | Public application domain | `http://localhost:3000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@localhost:5432/ssv_dandiya_divas` |
| `AUTH_SECRET` | 32+ char secret for admin JWT | `dev-secret-change-in-production-abc123xyz789` |
| `ADMIN_EMAIL` | Default administrator email | `admin@ssvgroup.in` |
| `ADMIN_PASSWORD` | Default administrator password | `Admin@SSV2026!` |
| `PAYMENT_MODE` | `demo` or `razorpay` | `demo` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay public key ID | `rzp_test_placeholder` |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key (server only) | `placeholder_secret` |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay webhook secret | `placeholder_webhook_secret` |
| `SMTP_HOST` | SMTP server host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` | SMTP username / email | `noreply@ssvgroup.in` |
| `SMTP_PASS` | SMTP application password | `your-smtp-password` |

---

## 7. PostgreSQL Setup (Local / Docker)

You can run PostgreSQL locally using Docker Compose:

```bash
# Start PostgreSQL in background
docker compose up -d
```

---

## 8. Prisma Migration & DB Push

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push
```

---

## 9. Seed Command

Seed default admin credentials, event info, ticket tiers, and initial settings:

```bash
npm run db:seed
```

---

## 10. How to Create / Login as Admin

1. Open **`http://localhost:3000/admin/login`**
2. Use the credentials configured in `.env`:
   - **Email:** `admin@ssvgroup.in`
   - **Password:** `Admin@SSV2026!`
3. After login, access:
   - **Dashboard**: `/admin`
   - **Bookings**: `/admin/bookings`
   - **QR Scanner**: `/admin/scanner`
   - **Settings**: `/admin/settings`

---

## 11. How to Run Locally

```bash
# Start the development server
npm run dev
```

Visit **`http://localhost:3000`** in your browser.

---

## 12. Demo Payment Mode

When `PAYMENT_MODE=demo`:
- No Razorpay API keys are required.
- Selecting **DEMO PAYMENT** creates a real booking record, generates unique cryptographic QR tokens, and produces valid digital and PDF tickets.
- **Safety check**: If `NODE_ENV=production` and `PAYMENT_MODE=demo`, the application will throw a warning to prevent demo mode from running in production.

---

## 13. Razorpay Live / Test Setup

1. Sign up on [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Generate API Keys in **Settings → API Keys**.
3. Set in `.env`:
   ```env
   PAYMENT_MODE=razorpay
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
   RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
   RAZORPAY_KEY_SECRET=your_secret_here
   ```
4. Restart the server.

---

## 14. Razorpay Webhook Setup

1. In Razorpay Dashboard, go to **Settings → Webhooks**.
2. Add Webhook URL: `https://yourdomain.com/api/webhooks/razorpay`
3. Select active event: `payment.captured`, `order.paid`
4. Set Webhook Secret in `.env`:
   ```env
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
   ```

---

## 15. SMTP Email Setup

To enable real transactional booking confirmation emails:
1. Configure your SMTP provider in `.env` (e.g. Gmail App Password, SendGrid, Amazon SES):
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-specific-password
   EMAIL_FROM="SSV Group <noreply@ssvgroup.in>"
   ```
2. If SMTP is not configured, the system logs a notice and displays the ticket directly to the customer on `/booking/success` and `/ticket/[bookingId]`.

---

## 16. QR Scanner Gate Usage

1. Open `/admin/scanner` on any mobile device (logged in as admin).
2. Allow camera permissions.
3. Point camera at customer's digital or printed QR ticket.
4. **Instant Results**:
   - 🟢 **VALID TICKET**: First scan — entry granted. Shows customer name and ticket type.
   - 🔴 **ALREADY USED**: Re-scanned ticket — displays exact timestamp of first check-in.
   - ⚠️ **INVALID TICKET**: Unrecognized or forged token.
5. If the customer's phone camera cannot scan, type their **Booking Ref** into the Manual Check-in box.

---

## 17. Production Build & Validation

```bash
# Run unit & integration test suite
npm test

# Run TypeScript type check
npm run typecheck

# Build optimized production bundle
npm run build

# Start production server
npm start
```

---

## 18. Deployment Guide

### Deploying on Vercel / Railway / Render

1. Push your repository to GitHub / GitLab.
2. Link the repository to your hosting provider.
3. Configure environment variables in the provider dashboard (`DATABASE_URL`, `AUTH_SECRET`, `PAYMENT_MODE=razorpay`, etc.).
4. Set build command: `npm run build`.
5. Set start command: `npm start`.

---

## 19. Security Checklist

- [x] Admin routes protected with HTTP-only signed session cookies
- [x] Passwords hashed with bcrypt (12 rounds)
- [x] Server-side calculation of all amounts in integer paise (client prices never trusted)
- [x] Cryptographic random tokens for QR verification (`crypto.randomBytes`)
- [x] Atomic check-in updates preventing race conditions across multiple gates
- [x] Webhook signature verification (`crypto.createHmac`)
- [x] Input validation with Zod on all endpoints
- [x] Safe error handling (no stack traces leaked to clients)

---

## 20. Production Launch Checklist

1. [ ] Set `NODE_ENV=production`
2. [ ] Update `AUTH_SECRET` to a random 64-character string
3. [ ] Set `PAYMENT_MODE=razorpay` with real Razorpay Live keys
4. [ ] Configure SMTP credentials for transactional emails
5. [ ] Update `ADMIN_PASSWORD` to a strong unique password
6. [ ] Verify PostgreSQL database backups are enabled
7. [ ] Test entry scanning with gate staff before event opening
