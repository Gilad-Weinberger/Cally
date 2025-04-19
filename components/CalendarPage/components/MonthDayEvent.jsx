"use client";

import React from "react";
import {
  getContrastColor,
  formatEventTimeDisplay,
} from "../utils/calendarUtils";

const MonthDayEvent = ({ event, date, onEventClick }) => {
  return (
    <div
      onClick={() => onEventClick(event)}
      className="text-xs p-1 mb-1 rounded cursor-pointer"
      style={{
        backgroundColor: event.color || "#dbeafe",
        color: event.color ? getContrastColor(event.color) : "#1e40af",
      }}
    >
      <div className="truncate">{event.title}</div>
      <div
        className="text-[10px] truncate"
        style={{
          color: event.color ? getContrastColor(event.color) : "#1e40af",
        }}
      >
        {formatEventTimeDisplay(event, date)}
      </div>
    </div>
  );
};

export default MonthDayEvent;
