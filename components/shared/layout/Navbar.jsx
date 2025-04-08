"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  MdDashboard,
  MdCalendarMonth,
  MdSettings,
  MdPalette,
  MdAttachMoney,
} from "react-icons/md";
import Image from "next/image";
import PrimaryButton from "../ui/PrimaryButton";
import ButtonAccount from "../ui/ButtonAccount";

const Navbar = () => {
  const { user, logout } = useAuth();

  // Navbar for authenticated users
  const AuthenticatedNavbar = () => (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center space-x-8">
          <Link
            href="/dashboard"
            className="text-gray-800 hover:text-gray-600 flex items-center gap-2"
          >
            <MdDashboard className="text-xl" />
            Dashboard
          </Link>
          <Link
            href="/calendar"
            className="text-gray-800 hover:text-gray-600 flex items-center gap-2"
          >
            <MdCalendarMonth className="text-xl" />
            Calendar
          </Link>
          <Link
            href="/color-code"
            className="text-gray-800 hover:text-gray-600 flex items-center gap-2"
          >
            <MdPalette className="text-xl" />
            Color Code
          </Link>
          <Link
            href="/pricing"
            className="text-gray-800 hover:text-gray-600 flex items-center gap-2"
          >
            <MdAttachMoney className="text-xl" />
            Pricing
          </Link>
        </div>
        <div className="flex items-center">
          <ButtonAccount />
        </div>
      </div>
    </div>
  );

  // Navbar for non-authenticated users
  const NonAuthenticatedNavbar = () => (
    <div className="container mx-auto py-1 px-4">
      <div className="flex justify-between items-center h-16">
        {/* Logo on the left */}
        <div className="flex-shrink-0">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Caly Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Navigation links in the center */}
        <div className="hidden md:flex items-center justify-center space-x-10">
          <Link
            href="/#features"
            className="text-gray-800 hover:text-gray-600 text-lg"
          >
            Features
          </Link>
          <Link
            href="/#testimonials"
            className="text-gray-800 hover:text-gray-600 text-lg"
          >
            Testimonials
          </Link>
          <Link
            href="/#pricing"
            className="text-gray-800 hover:text-gray-600 text-lg"
          >
            Pricing
          </Link>
        </div>

        {/* Get Started button on the right */}
        <div className="flex items-center">
          <PrimaryButton href="/auth/signup">Get Started</PrimaryButton>
        </div>
      </div>
    </div>
  );

  return (
    <nav className="bg-white shadow-md">
      {user ? <AuthenticatedNavbar /> : <NonAuthenticatedNavbar />}
    </nav>
  );
};

export default Navbar;
