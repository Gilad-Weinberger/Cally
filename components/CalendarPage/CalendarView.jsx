"use client";

import React, { useState, useEffect } from "react";
import CalendarHeader from "./components/CalendarHeader";
import WeekView from "./components/WeekView";
import MonthView from "./components/MonthView";
import DateSearchModal from "./components/DateSearchModal";

export default function CalendarView({
  events,
  onEventClick,
  isLoading,
  googleEvents = [],
  hasGoogleCalendar = false,
  onGoogleCalendarToggle,
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [visibleCalendars, setVisibleCalendars] = useState({
    app: true,
    google: true,
  });

  // Fetch Google Calendar events on initial load if connection exists
  useEffect(() => {
    if (
      hasGoogleCalendar &&
      visibleCalendars.google &&
      onGoogleCalendarToggle &&
      googleEvents.length === 0
    ) {
      // This will trigger a refresh of Google Calendar events
      onGoogleCalendarToggle(true);
    }
  }, [
    hasGoogleCalendar,
    visibleCalendars.google,
    onGoogleCalendarToggle,
    googleEvents.length,
  ]);

  // Common constants
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hours = Array.from({ length: 24 }, (_, i) => {
    return `${i.toString().padStart(2, "0")}:00`;
  });

  // Function to toggle calendar visibility
  const toggleCalendarVisibility = (calendarId) => {
    setVisibleCalendars((prev) => ({
      ...prev,
      [calendarId]: !prev[calendarId],
    }));
  };

  // Function to handle calendar toggle that refreshes Google events when enabled
  const handleCalendarToggle = (calendarId) => {
    // If we're enabling Google Calendar, ensure user ID is passed in the request
    if (
      calendarId === "google" &&
      !visibleCalendars.google &&
      hasGoogleCalendar &&
      onGoogleCalendarToggle
    ) {
      onGoogleCalendarToggle(true);
    }
    toggleCalendarVisibility(calendarId);
  };

  // Navigation functions
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const navigateView = (direction) => {
    const newDate = new Date(currentDate);
    if (viewMode === "week") {
      newDate.setDate(currentDate.getDate() + direction * 7);
    } else {
      newDate.setMonth(currentDate.getMonth() + direction);
    }
    setCurrentDate(newDate);
  };

  // Date search keyboard listener
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === ".") {
        setIsSearchModalOpen(!isSearchModalOpen);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [isSearchModalOpen]);

  // Date search handler
  const handleDateSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/parse-date", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dateText: e.target.date.value }),
      });

      const data = await response.json();
      // No need to validate as API will return today's date as fallback in case of invalid input

      const searchDate = new Date(data.date);
      setCurrentDate(searchDate);
      setIsSearchModalOpen(false);
    } catch (error) {
      console.error("Error parsing date:", error);
      e.target.date.setCustomValidity("Failed to parse date");
      e.target.date.reportValidity();
    }
  };

  // Get the events based on the selected calendar source
  const displayEvents = [
    ...(visibleCalendars.app ? events : []),
    ...(visibleCalendars.google ? googleEvents : []),
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4 h-full flex flex-col relative">
      {isLoading && (
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center z-50 backdrop-blur-[0.5px]">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-lg"></div>
        </div>
      )}

      <CalendarHeader
        currentDate={currentDate}
        viewMode={viewMode}
        setViewMode={setViewMode}
        navigateView={navigateView}
        goToToday={goToToday}
        visibleCalendars={visibleCalendars}
        handleCalendarToggle={handleCalendarToggle}
        hasGoogleCalendar={hasGoogleCalendar}
      />

      <div className="flex-1 overflow-hidden">
        {viewMode === "week" ? (
          <WeekView
            currentDate={currentDate}
            events={displayEvents}
            onEventClick={onEventClick}
            weekDays={weekDays}
            hours={hours}
          />
        ) : (
          <MonthView
            currentDate={currentDate}
            events={displayEvents}
            onEventClick={onEventClick}
            weekDays={weekDays}
          />
        )}
      </div>

      <DateSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSubmit={handleDateSearch}
      />
    </div>
  );
}
