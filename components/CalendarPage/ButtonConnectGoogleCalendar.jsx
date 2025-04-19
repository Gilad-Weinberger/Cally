"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

export default function ButtonConnectGoogleCalendar() {
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log("ButtonConnectGoogleCalendar - Auth state:", {
      isAuthenticated: !!user,
      userId: user?.uid,
      loading,
    });
  }, [user, loading]);

  const handleConnect = () => {
    console.log("Connect button clicked, user state:", {
      isAuthenticated: !!user,
      userId: user?.uid,
    });

    if (user && user.uid) {
      console.log("Redirecting to Google auth with userId:", user.uid);
      window.location.href = `/api/google-calendar/auth?userId=${user.uid}`;
    } else {
      console.error(
        "User not authenticated when trying to connect to Google Calendar"
      );
      // Redirect to sign-in page if user is not authenticated
      window.location.href = "/auth/signin?error=auth_required";
    }
  };

  return (
    <button
      className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      onClick={handleConnect}
      disabled={loading}
    >
      {loading ? "Loading..." : "Connect Google Calendar"}
    </button>
  );
}
