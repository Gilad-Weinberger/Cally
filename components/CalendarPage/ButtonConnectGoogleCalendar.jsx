"use client";

export default function ButtonConnectGoogleCalendar() {
  const handleConnect = () => {
    window.location.href = "/api/google-calendar/auth";
  };

  return (
    <button
      className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      onClick={handleConnect}
    >
      Connect Google Calendar
    </button>
  );
}
