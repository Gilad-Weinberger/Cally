import React from "react";
import PricingSection from "@/components/pricing/PricingSection";
import Navbar from "@/components/shared/layout/Navbar";

export const metadata = {
  title: "Pricing - Caly",
  description: "Choose the right subscription plan for your needs",
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
