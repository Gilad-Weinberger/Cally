"use client";

import React from "react";
import ButtonConnectGoogleCalendar from "../ButtonConnectGoogleCalendar";
import {
  getHeaderText,
  isCurrentPeriod,
  getMonthName,
} from "../utils/calendarUtils";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";

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
    <div className="sticky top-0 z-20 bg-white/80 backdrop-blur flex flex-col md:flex-row md:justify-between md:items-center mb-4 px-2 py-2 md:py-0 border-b border-gray-100">
      <div className="flex items-center justify-between w-full md:w-auto">
        <h2 className="text-lg md:text-xl font-semibold truncate">
          {getHeaderText(viewMode, currentDate)}
        </h2>
        {/* Mobile nav arrows */}
        <div className="flex md:hidden gap-1 ml-2">
          <button
            onClick={() => navigateView(-1)}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-600"
            aria-label="Previous"
          >
            <HiOutlineChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigateView(1)}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-600"
            aria-label="Next"
          >
            <HiOutlineChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-2 md:mt-0 w-full md:w-auto">
        <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
          {!hasGoogleCalendar && <ButtonConnectGoogleCalendar />}
          {hasGoogleCalendar && (
            <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1.5">
              <button
                onClick={() => handleCalendarToggle("app")}
                className={`px-2 py-1 rounded-md text-xs md:text-sm transition-colors ${
                  visibleCalendars.app
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                App
              </button>
              <button
                onClick={() => handleCalendarToggle("google")}
                className={`px-2 py-1 rounded-md text-xs md:text-sm transition-colors ${
                  visibleCalendars.google
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                Google
              </button>
            </div>
          )}
        </div>
        <div className="flex gap-1 md:gap-2 w-full md:w-auto justify-between md:justify-start">
          <button
            onClick={goToToday}
            disabled={isCurrentPeriod(viewMode, currentDate)}
            className={`px-2 py-1 rounded text-xs md:text-sm font-medium ${
              isCurrentPeriod(viewMode, currentDate)
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setViewMode("month")}
            className={`px-2 py-1 rounded text-xs md:text-sm font-medium ${
              viewMode === "month"
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setViewMode("week")}
            className={`px-2 py-1 rounded text-xs md:text-sm font-medium ${
              viewMode === "week"
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`}
          >
            Week
          </button>
        </div>
        {/* Desktop nav arrows */}
        <div className="hidden md:flex gap-2 ml-2">
          <button
            onClick={() => navigateView(-1)}
            className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded-lg text-gray-600 w-28"
          >
            <span>←</span>
            <span className="text-sm">
              {viewMode === "month"
                ? getMonthName(currentDate, -1)
                : "Previous"}
            </span>
          </button>
          <button
            onClick={() => navigateView(1)}
            className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded-lg text-gray-600 w-28"
          >
            <span className="text-sm">
              {viewMode === "month" ? getMonthName(currentDate, 1) : "Next"}
            </span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
