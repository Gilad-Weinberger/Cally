"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const PricingCheckout = ({ planId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const user = useAuth();

  const handleCheckout = async () => {
    setIsLoading(true);

    try {
      const userId = user?.user?.uid || null;
      if (!userId) {
        router.push("/auth/signin");
        setIsLoading(false);
        return;
      }

      if (!planId) {
        console.error("No valid plan ID found");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/lemonsqueezy/create-checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            variantId: planId,
            userId: userId,
            email: user?.user?.email,
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
          throw new Error("No checkout URL returned from API");
        }
      } catch (e) {
        console.error("Checkout API error:", e);
        alert("There was an error setting up your checkout. Please try again.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={isLoading || !planId}
        className={`w-full items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-3 text-base font-medium text-white shadow-lg transition-all hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
            Processing...
          </>
        ) : (
          `Subscribe Now`
        )}
      </button>
    </div>
  );
};

export default PricingCheckout;
