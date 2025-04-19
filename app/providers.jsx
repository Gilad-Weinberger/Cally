"use client";
import { AuthProvider } from "@/context/AuthContext";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function Providers({ children }) {
  return (
    <>
      <AuthProvider>{children}</AuthProvider>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
