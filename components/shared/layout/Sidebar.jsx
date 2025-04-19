import Link from "next/link";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import {
  MdDashboard,
  MdCalendarMonth,
  MdPalette,
  MdAttachMoney,
  MdFeedback,
} from "react-icons/md";
import { useAuth } from "@/context/AuthContext";

const Sidebar = () => {
  const [isShrunk, setIsShrunk] = useState(false);
  const { user, logout } = useAuth();

  const toggleShrink = () => {
    setIsShrunk(!isShrunk);
  };

  return (
    <div
      className={`${
        isShrunk ? "w-16" : "w-36"
      } h-full max-h-full flex flex-col justify-between bg-white border-r border-gray-200 p-1.5 transition-width duration-300`}
    >
      <button
        onClick={toggleShrink}
        className="w-full flex p-1.5 text-gray-400 hover:text-gray-600 rounded-lg mb-3"
      >
        {isShrunk ? (
          <ChevronRightIcon className="w-4 h-4" />
        ) : (
          <ChevronLeftIcon className="w-4 h-4" />
        )}
      </button>

      <nav className="space-y-1.5">
        <Link
          href="/dashboard"
          className={`flex items-center ${
            isShrunk ? "justify-center px-1.5" : "px-3"
          } py-1.5 text-gray-700 hover:bg-gray-100 rounded-lg`}
        >
          <MdDashboard className="text-base" />
          {!isShrunk && <span className="ml-1.5 text-sm">Dashboard</span>}
        </Link>
        <Link
          href="/calendar"
          className={`flex items-center ${
            isShrunk ? "justify-center px-1.5" : "px-3"
          } py-1.5 text-gray-700 hover:bg-gray-100 rounded-lg`}
        >
          <MdCalendarMonth className="text-base" />
          {!isShrunk && <span className="ml-1.5 text-sm">Calendar</span>}
        </Link>
        <Link
          href="/color-code"
          className={`flex items-center ${
            isShrunk ? "justify-center px-1.5" : "px-3"
          } py-1.5 text-gray-700 hover:bg-gray-100 rounded-lg`}
        >
          <MdPalette className="text-base" />
          {!isShrunk && <span className="ml-1.5 text-sm">Color Code</span>}
        </Link>
        <Link
          href="/pricing"
          className={`flex items-center ${
            isShrunk ? "justify-center px-1.5" : "px-3"
          } py-1.5 text-gray-700 hover:bg-gray-100 rounded-lg`}
        >
          <MdAttachMoney className="text-base" />
          {!isShrunk && <span className="ml-1.5 text-sm">Pricing</span>}
        </Link>
        <Link
          href="/feedback"
          className={`flex items-center ${
            isShrunk ? "justify-center px-1.5" : "px-3"
          } py-1.5 text-gray-700 hover:bg-gray-100 rounded-lg`}
        >
          <MdFeedback className="text-base" />
          {!isShrunk && <span className="ml-1.5 text-sm">Feedback</span>}
        </Link>
      </nav>
      {user && (
        <div className="mt-auto border-t border-gray-200 p-1.5">
          <div
            className={`flex flex-col ${
              isShrunk ? "justify-center" : "items-center space-x-1.5"
            } p-1.5`}
          >
            <img
              src={user.photoURL || "/default-avatar.png"}
              alt="Profile"
              className="w-6 h-6 rounded-full"
            />
            {!isShrunk && (
              <>
                <span className="text-gray-800 mt-1 flex-1 truncate text-xs">
                  {user.displayName}
                </span>
                <button
                  onClick={logout}
                  className="text-red-500 my-1.5 hover:text-red-600 text-xs"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
