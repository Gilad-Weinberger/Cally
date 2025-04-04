'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import AuthButton from '@/components/auth/AuthButton';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TestimonialCarousel from '@/components/landing/TestimonialCarousel';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import YourAICalendar from '@/components/YourAICalendar';
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

      {/* Problem/Solution Section */}
      <section className="bg-to-blue-50 py-16 md:py-24" id="problem-solution">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-8 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Traditional Calendars vs. AI-Powered Scheduling
            </h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="rounded-xl bg-red-50 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-red-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">The Problem</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="mr-2 h-5 w-5 flex-shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>Manual scheduling is time-consuming and error-prone</span>
                </li>
                <li className="flex items-start">
                  <svg className="mr-2 h-5 w-5 flex-shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>Difficulty prioritizing tasks and managing time effectively</span>
                </li>
                <li className="flex items-start">
                  <svg className="mr-2 h-5 w-5 flex-shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>No intelligent suggestions or optimization of your schedule</span>
                </li>
              </ul>
            </div>
            <div className="rounded-xl bg-green-50 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-green-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">The Solution</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>AI-powered scheduling that learns your preferences</span>
                </li>
                <li className="flex items-start">
                  <svg className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Intelligent task prioritization and time blocking</span>
                </li>
                <li className="flex items-start">
                  <svg className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Smart suggestions that optimize your productivity</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 text-center">
             {!user && (
              <PrimaryButton href="/auth/signup">
                Start Optimizing Your Schedule
              </PrimaryButton>
            )}
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white" id="features">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Intelligent Features
            </h2>
            <p className="text-xl text-gray-600">
              Discover how Caly's AI-powered features can transform your scheduling experience
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-indigo-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">Smart Scheduling</h3>
              <p className="mb-4 text-gray-600">
                Our AI analyzes your patterns and preferences to suggest optimal times for meetings, tasks, and breaks.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <svg className="mr-2 h-4 w-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Intelligent time slot recommendations</span>
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 h-4 w-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Automatic conflict resolution</span>
                </li>
              </ul>
            </div>
            {/* Feature 2 */}
            <div className="rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">Intelligent Task Prioritization</h3>
              <p className="mb-4 text-gray-600">
                Let AI help you prioritize tasks based on deadlines, importance, and your productivity patterns.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <svg className="mr-2 h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Smart task ordering suggestions</span>
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Deadline-aware scheduling</span>
                </li>
              </ul>
            </div>
            {/* Feature 3 */}
            <div className="rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-purple-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">Seamless Integrations</h3>
              <p className="mb-4 text-gray-600">
                Connect with your favorite tools and services for a unified productivity experience.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <svg className="mr-2 h-4 w-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Works with popular productivity tools</span>
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 h-4 w-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Automated data synchronization</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 text-center">
            {!user && (
              <SecondaryButton href="#testimonials">
                See What Users Say
              </SecondaryButton>
            )}
          </div>
        </div>
      </section>

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

