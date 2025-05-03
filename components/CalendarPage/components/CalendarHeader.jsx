"use client";

import React from "react";
import ButtonConnectGoogleCalendar from "../ButtonConnectGoogleCalendar";
import {
  getHeaderText,
  isCurrentPeriod,
  getMonthName,
} from "../utils/calendarUtils";

const CalendarHeader = ({
  currentDate,
  viewMode,
  setViewMode,
  navigateView,
  goToToday,
  visibleCalendars,
  handleCalendarToggle,
  hasGoogleCalendar,
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">
        {getHeaderText(viewMode, currentDate)}
      </h2>
      <div className="flex items-center gap-4 mr-4">
        {/* {!hasGoogleCalendar && <ButtonConnectGoogleCalendar />} */}
        {hasGoogleCalendar && (
          <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1.5 mr-3">
            <button
              onClick={() => handleCalendarToggle("app")}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                visibleCalendars.app
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              App Calendar
            </button>
            <button
              onClick={() => handleCalendarToggle("google")}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                visibleCalendars.google
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Google Calendar
            </button>
          </div>
        )}

        <div className="flex gap-2 mr-4">
          <button
            onClick={goToToday}
            disabled={isCurrentPeriod(viewMode, currentDate)}
            className={`px-2 py-1 mr-3 rounded ${
              isCurrentPeriod(viewMode, currentDate)
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setViewMode("month")}
            className={`px-2 py-1 rounded ${
              viewMode === "month"
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setViewMode("week")}
            className={`px-2 py-1 rounded ${
              viewMode === "week"
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`}
          >
            Week
          </button>
        </div>
        <button
          onClick={() => navigateView(-1)}
          className="flex items-center justify-center gap-1 px-2 py-1 hover:bg-gray-100 rounded-lg text-gray-600 w-28"
        >
          <span>←</span>
          <span className="text-sm">
            {viewMode === "month" ? getMonthName(currentDate, -1) : "Previous"}
          </span>
        </button>
        <button
          onClick={() => navigateView(1)}
          className="flex items-center justify-center gap-1 px-2 py-1 hover:bg-gray-100 rounded-lg text-gray-600 w-28"
        >
          <span className="text-sm">
            {viewMode === "month" ? getMonthName(currentDate, 1) : "Next"}
          </span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;
