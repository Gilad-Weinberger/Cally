"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { MdAttachMoney, MdLogout } from "react-icons/md";

const ButtonAccount = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleBilling = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/lemonsqueezy/create-portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          redirectUrl: window.location.href,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No portal URL returned from API");
      }
    } catch (e) {
      console.error("Error accessing customer portal:", e);
      alert(
        "There was an error accessing the billing portal. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <Image
          src={user?.photoURL || "/default-avatar.png"}
          alt="Profile"
          width={36}
          height={36}
          className="rounded-full border-2 border-gray-200"
          priority
        />
        <span className="text-gray-800 font-medium hidden md:inline">
          {user?.displayName || "Account"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
          <button
            className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 gap-2"
            onClick={() => {
              handleBilling();
              setIsOpen(false);
            }}
            disabled={isLoading}
          >
            <MdAttachMoney className="text-xl" />
            {isLoading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Loading...</span>
              </div>
            ) : (
              <span>Billing & Plans</span>
            )}
          </button>
          <div className="border-t border-gray-100"></div>
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-100 gap-2"
          >
            <MdLogout className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ButtonAccount;
