"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  MdCalendarMonth,
  MdPalette,
  MdAttachMoney,
  MdFeedback,
} from "react-icons/md";
import Image from "next/image";
import PrimaryButton from "../ui/ButtonPrimary";
import ButtonAccount from "../ui/ButtonAccount";
import { useState, useEffect, useMemo, useCallback } from "react";

const Navbar = () => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Debounced scroll handler to reduce performance impact
  const handleScroll = useCallback(() => {
    if (window.scrollY > 10) {
      if (!scrolled) setScrolled(true);
    } else {
      if (scrolled) setScrolled(false);
    }
  }, [scrolled]);

  // Handle scroll effect for navbar with debouncing
  useEffect(() => {
    let scrollTimer;
    const debouncedScroll = () => {
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(handleScroll, 10);
    };

    window.addEventListener("scroll", debouncedScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", debouncedScroll);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, [handleScroll]);

  // Toggle mobile menu
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  // Navbar for authenticated users
  const AuthenticatedNavbar = useMemo(
    () => (
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and mobile menu button */}
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-4">
              <Link href="/dashboard">
                <div className="relative h-8 sm:h-10 w-24 sm:w-32">
                  <Image
                    src="/full_logo.png"
                    alt="Caly Logo"
                    fill
                    sizes="(max-width: 640px) 6rem, 8rem"
                    style={{ objectFit: "contain" }}
                    priority
                  />
                </div>
              </Link>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                className="text-gray-500 hover:text-gray-600 focus:outline-none"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            <Link
              href="/calendar"
              className="text-gray-800 hover:text-gray-600 flex items-center gap-2"
            >
              <MdCalendarMonth className="text-xl" />
              <span className="text-sm lg:text-base">Calendar</span>
            </Link>
            <Link
              href="/color-code"
              className="text-gray-800 hover:text-gray-600 flex items-center gap-2"
            >
              <MdPalette className="text-xl" />
              <span className="text-sm lg:text-base">Color Code</span>
            </Link>
            <Link
              href="/pricing"
              className="text-gray-800 hover:text-gray-600 flex items-center gap-2"
            >
              <MdAttachMoney className="text-xl" />
              <span className="text-sm lg:text-base">Pricing</span>
            </Link>
            <Link
              href="/feedback"
              className="text-gray-800 hover:text-gray-600 flex items-center gap-2"
            >
              <MdFeedback className="text-xl" />
              <span className="text-sm lg:text-base">Feedback</span>
            </Link>
          </div>

          <div className="flex items-center">
            <ButtonAccount />
          </div>
        </div>

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-2">
            <div className="flex flex-col space-y-3 pb-3">
              <Link
                href="/calendar"
                className="text-gray-800 hover:text-gray-600 flex items-center gap-2 px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                <MdCalendarMonth className="text-xl" />
                Calendar
              </Link>
              <Link
                href="/color-code"
                className="text-gray-800 hover:text-gray-600 flex items-center gap-2 px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                <MdPalette className="text-xl" />
                Color Code
              </Link>
              <Link
                href="/pricing"
                className="text-gray-800 hover:text-gray-600 flex items-center gap-2 px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                <MdAttachMoney className="text-xl" />
                Pricing
              </Link>
              <Link
                href="/feedback"
                className="text-gray-800 hover:text-gray-600 flex items-center gap-2 px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                <MdFeedback className="text-xl" />
                Feedback
              </Link>
            </div>
          </div>
        )}
      </div>
    ),
    [mobileMenuOpen, toggleMobileMenu]
  );

  // Navbar for non-authenticated users
  const NonAuthenticatedNavbar = useMemo(
    () => (
      <div className="container mx-auto py-1 px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and mobile menu button */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <div className="relative h-8 sm:h-10 w-24 sm:w-32">
                  <Image
                    src="/full_logo.png"
                    alt="Caly Logo"
                    fill
                    sizes="(max-width: 640px) 6rem, 8rem"
                    style={{ objectFit: "contain" }}
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="ml-4 md:hidden">
              <button
                type="button"
                className="text-gray-500 hover:text-gray-600 focus:outline-none"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Desktop navigation links */}
          <div className="hidden md:flex items-center justify-center space-x-4 lg:space-x-10">
            <Link
              href="/#features"
              className="text-gray-800 hover:text-gray-600 text-sm lg:text-lg"
            >
              Features
            </Link>
            <Link
              href="/#testimonials"
              className="text-gray-800 hover:text-gray-600 text-sm lg:text-lg"
            >
              Testimonials
            </Link>
            <Link
              href="/#pricing"
              className="text-gray-800 hover:text-gray-600 text-sm lg:text-lg"
            >
              Pricing
            </Link>
          </div>

          {/* Get Started button */}
          <div className="flex items-center">
            <PrimaryButton href="/auth/signup">Get Started</PrimaryButton>
          </div>
        </div>

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-2">
            <div className="flex flex-col space-y-3 pb-3">
              <Link
                href="/#features"
                className="text-gray-800 hover:text-gray-600 px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/#testimonials"
                className="text-gray-800 hover:text-gray-600 px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </Link>
              <Link
                href="/#pricing"
                className="text-gray-800 hover:text-gray-600 px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
            </div>
          </div>
        )}
      </div>
    ),
    [mobileMenuOpen, toggleMobileMenu]
  );

  // Memoize the entire navbar to prevent unnecessary re-renders
  const navbarContent = useMemo(
    () => (
      <nav
        className={`bg-white shadow-md sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "shadow-lg" : ""
        }`}
      >
        {user ? AuthenticatedNavbar : NonAuthenticatedNavbar}
      </nav>
    ),
    [user, scrolled, AuthenticatedNavbar, NonAuthenticatedNavbar]
  );

  return navbarContent;
};

export default Navbar;
