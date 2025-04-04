'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import AuthButton from '@/components/auth/AuthButton';
import Navbar from '@/components/shared/layout/Navbar';
import Footer from '@/components/shared/layout/Footer';
import TestimonialCarousel from '@/components/LandingPage/TestimonialCarousel';
import PrimaryButton from '@/components/shared/ui/PrimaryButton';
import SecondaryButton from '@/components/shared/ui/SecondaryButton';
import YourAICalendar from '@/components/LandingPage/YourAICalendar';
import ProblemSolution from '@/components/LandingPage/ProblemSolution';
import Features from '@/components/LandingPage/Features';
import PricingSection from '@/components/pricing/PricingSection';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-indigo-100 opacity-30 blur-3xl"></div>
          <div className="absolute top-40 -left-40 h-96 w-96 rounded-full bg-blue-100 opacity-30 blur-3xl"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
            <div className="flex flex-col justify-center">
              <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Effortless Scheduling</span>
                <span className="block bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">Powered by AI</span>
              </h1>
              <p className="mb-8 text-xl text-gray-600">
                Caly is your intelligent calendar assistant that organizes your schedule, prioritizes tasks, and helps you make the most of your time.
              </p>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                {user ? (
                  <PrimaryButton href="/dashboard">
                    Go to Dashboard
                  </PrimaryButton>
                ) : (
                  <>
                    <PrimaryButton href="/auth/signup">
                      Get Started
                    </PrimaryButton>
                    <SecondaryButton href="#features">
                      Learn More
                    </SecondaryButton>
                  </>
                )}
              </div>
            </div>
            <div className="relative flex items-center justify-center lg:justify-end">
              <YourAICalendar />
            </div>
          </div>
        </div>
      </section>
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

