"use client";
import { AuthProvider } from "@/context/AuthContext";
import { Analytics } from '@vercel/analytics/react';

export default function Providers({ children }) {
  return (
    <>
      <AuthProvider>{children}</AuthProvider>
      <Analytics />
    </>
  );
}
