import Link from "next/link";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import {
  MdDashboard,
  MdCalendarMonth,
  MdSettings,
  MdPalette,
} from "react-icons/md";

const Sidebar = () => {
  const [isShrunk, setIsShrunk] = useState(false);

  const toggleShrink = () => {
    setIsShrunk(!isShrunk);
  };

  return (
    <div
      className={`${
        isShrunk ? "w-16" : "w-44"
      } h-full max-h-full bg-white border-r border-gray-200 p-2 transition-width duration-300`}
    >
      <button
        onClick={toggleShrink}
        className="w-full flex p-2 text-gray-400 hover:text-gray-600 rounded-lg mb-4"
      >
        {isShrunk ? (
          <ChevronRightIcon className="w-6 h-6" />
        ) : (
          <ChevronLeftIcon className="w-6 h-6" />
        )}
      </button>

      <nav className="space-y-2">
        <Link
          href="/dashboard"
          className={`flex items-center ${
            isShrunk ? "justify-center px-2" : "px-4"
          } py-2 text-gray-700 hover:bg-gray-100 rounded-lg`}
        >
          <MdDashboard className="text-xl" />
          {!isShrunk && <span className="ml-2">Dashboard</span>}
        </Link>
        <Link
          href="/calendar"
          className={`flex items-center ${
            isShrunk ? "justify-center px-2" : "px-4"
          } py-2 text-gray-700 hover:bg-gray-100 rounded-lg`}
        >
          <MdCalendarMonth className="text-xl" />
          {!isShrunk && <span className="ml-2">Calendar</span>}
        </Link>
        <Link
          href="/settings"
          className={`flex items-center ${
            isShrunk ? "justify-center px-2" : "px-4"
          } py-2 text-gray-700 hover:bg-gray-100 rounded-lg`}
        >
          <MdSettings className="text-xl" />
          {!isShrunk && <span className="ml-2">Settings</span>}
        </Link>
        <Link
          href="/color-code"
          className={`flex items-center ${
            isShrunk ? "justify-center px-2" : "px-4"
          } py-2 text-gray-700 hover:bg-gray-100 rounded-lg`}
        >
          <MdPalette className="text-xl" />
          {!isShrunk && <span className="ml-2">Color Code</span>}
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
