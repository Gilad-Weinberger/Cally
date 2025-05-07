"use client";
import UserManagement from "@/components/admin/UserManagement";
import Navbar from "@/components/shared/layout/Navbar";
import Sidebar from "@/components/shared/layout/Sidebar";
import { useState, useEffect } from "react";

export default function AdminPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 text-sm overflow-hidden">
      {/* Show Sidebar on desktop, Navbar on mobile */}
      {isMobile ? (
        <div className="fixed top-0 left-0 right-0 z-30 md:hidden">
          <Navbar />
        </div>
      ) : (
        <Sidebar />
      )}
      <main className="flex-1 p-4 overflow-y-auto pt-16 md:pt-0">
        <UserManagement />
      </main>
    </div>
  );
}
