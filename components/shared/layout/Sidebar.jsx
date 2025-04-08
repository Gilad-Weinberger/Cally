import Link from "next/link";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import {
  MdDashboard,
  MdCalendarMonth,
  MdPalette,
  MdAttachMoney,
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
        isShrunk ? "w-20" : "w-44"
      } h-full max-h-full flex flex-col justify-between bg-white border-r border-gray-200 p-2 transition-width duration-300`}
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
          href="/color-code"
          className={`flex items-center ${
            isShrunk ? "justify-center px-2" : "px-4"
          } py-2 text-gray-700 hover:bg-gray-100 rounded-lg`}
        >
          <MdPalette className="text-xl" />
          {!isShrunk && <span className="ml-2">Color Code</span>}
        </Link>
        <Link
          href="/pricing"
          className={`flex items-center ${
            isShrunk ? "justify-center px-2" : "px-4"
          } py-2 text-gray-700 hover:bg-gray-100 rounded-lg`}
        >
          <MdAttachMoney className="text-xl" />
          {!isShrunk && <span className="ml-2">Pricing</span>}
        </Link>
      </nav>
      {user && (
        <div className="mt-auto border-t border-gray-200 p-2">
          <div
            className={`flex flex-col ${
              isShrunk ? "justify-center" : "items-center space-x-2"
            } p-2`}
          >
            <img
              src={user.photoURL || "/default-avatar.png"}
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            {!isShrunk && (
              <>
                <span className="text-gray-800 mt-1 flex-1 truncate">
                  {user.displayName}
                </span>
                <button
                  onClick={logout}
                  className="text-red-500 my-2 hover:text-red-600 text-sm"
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
