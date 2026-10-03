"use client";

/**
 * Client-boundary wrapper for AISupportWidget.
 * next/dynamic with ssr:false MUST live inside a Client Component
 * (not a Server Component like layout.tsx).
 */

import dynamic from "next/dynamic";

const AISupportWidget = dynamic(() => import("@/components/AISupportWidget"), {
  ssr: false,
  loading: () => null,
});

export default function AISupportWidgetLoader() {
  return <AISupportWidget />;
}
