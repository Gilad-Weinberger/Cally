import React from "react";
import PricingSection from "@/components/pricing/PricingSection";
import Navbar from "@/components/shared/layout/Navbar";

export const metadata = {
  title: "Pricing Plans - Choose Your Subscription",
  description:
    "Find the perfect Caly subscription plan for your scheduling needs. From free personal use to advanced AI features for professionals and teams.",
  keywords: [
    "calendar pricing",
    "AI assistant plans",
    "subscription options",
    "productivity tool pricing",
    "calendar app plans",
  ],
  openGraph: {
    title: "Caly Pricing - Find Your Perfect Plan",
    description:
      "Compare plans and choose the subscription that fits your scheduling needs, from free personal use to advanced AI features.",
  },
};

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main>
        <PricingSection />
      </main>
    </>
  );
}
