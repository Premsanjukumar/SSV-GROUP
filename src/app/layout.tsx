import type { Metadata, Viewport } from "next";
import { Inter, Cinzel, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
  weight: ["400", "600", "700", "900"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "600", "700"],
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "SSV Dandiya Divas 2026 | Bidar",
    template: "%s | SSV Dandiya Divas 2026",
  },
  description:
    "Book tickets for SSV Group Dandiya Divas 2026 — 14 October in Bidar, Karnataka. Featuring SP POWER. DJ + Live, Food Stall, Celebrity Selfie, Selfie Booth, Competition & more!",
  keywords: [
    "Dandiya Divas",
    "SSV Group",
    "Navratri 2026",
    "Garba Bidar",
    "Dandiya Bidar",
    "SP POWER",
    "Navratri event Karnataka",
    "Bidar event tickets",
  ],
  authors: [{ name: "SSV Group" }],
  creator: "SSV Group",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: APP_URL,
    siteName: "SSV Dandiya Divas 2026",
    title: "SSV Dandiya Divas 2026 | 14 October | Bidar",
    description:
      "Join SSV Group for Dandiya Divas 2026 on 14 October in Bidar. Featuring SP POWER. Book your tickets now!",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SSV Dandiya Divas 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SSV Dandiya Divas 2026 | 14 October | Bidar",
    description:
      "Join SSV Group for Dandiya Divas 2026 on 14 October in Bidar. Featuring SP POWER. Book your tickets now!",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#6D0B0B",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-[#0f0202] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
