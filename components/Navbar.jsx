"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  MdDashboard,
  MdCalendarMonth,
  MdSettings,
  MdPalette,
} from "react-icons/md";
import Image from "next/image";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
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
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <Image
                  src={user.photoURL || "/default-avatar.png"}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full"
                  priority
                />
                <span className="text-gray-800">{user.displayName}</span>
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
