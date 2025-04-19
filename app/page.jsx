"use client";

import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/shared/layout/Navbar";
import Footer from "@/components/shared/layout/Footer";
import TestimonialCarousel from "@/components/LandingPage/TestimonialCarousel";
import ProblemSolution from "@/components/LandingPage/ProblemSolution";
import Features from "@/components/LandingPage/Features";
import PricingSection from "@/components/pricing/PricingSection";
import Hero from "@/components/LandingPage/Hero";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <Hero />
        <ProblemSolution />
        <Features />
        {/* Testimonials Section */}
        <section className="bg-to-blue-50 py-16 md:py-24" id="testimonials">
          <TestimonialCarousel />
        </section>
        {/* Pricing Section */}
        <section id="pricing">
          <PricingSection />
        </section>
      </div>
      <Footer />
    </div>
  );
}
