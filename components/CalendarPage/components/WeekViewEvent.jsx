"use client";

import React from "react";
import {
  getContrastColor,
  formatEventTimeDisplay,
} from "../utils/calendarUtils";

const WeekViewEvent = ({
  event,
  date,
  isMultiDayEvent,
  isFirstDay,
  isLastDay,
  eventWidth,
  leftOffset,
  onEventClick,
}) => {
  // Calculate position and size of event block
  let topPercentage = 0;
  let duration = 100;

  if (!isMultiDayEvent) {
    // Single day event - normal calculation
    const [startHour, startMinute] = event.startTime.split(":");
    const [endHour, endMinute] = event.endTime
      ? event.endTime.split(":")
      : [`${parseInt(startHour) + 1}`, "00"];

    // Calculate start position as percentage of hour
    topPercentage = (parseInt(startMinute) / 60) * 100;
    
    // Calculate total event duration in hours and minutes
    const startTotalMinutes = parseInt(startHour) * 60 + parseInt(startMinute);
    let endTotalMinutes = parseInt(endHour) * 60 + parseInt(endMinute);
    
    // Round up if event ends at X:59
    if (parseInt(endMinute) === 59) {
      endTotalMinutes = (parseInt(endHour) + 1) * 60;
    }
    
    const diffMinutes = endTotalMinutes - startTotalMinutes;
    
    // Convert to percentage of day height (each hour = 100%)
    duration = (diffMinutes / 60) * 100;
  } else if (isFirstDay) {
    // First day of multi-day event - show from start time to end of day
    const [startHour, startMinute] = event.startTime.split(":");
    const startTotalMinutes = parseInt(startHour) * 60 + parseInt(startMinute);
    
    // Calculate start position
    topPercentage = (parseInt(startMinute) / 60) * 100;
    
    // Calculate duration from start time to midnight (24:00)
    // Since multi-day events on first day end at 23:59, round up to 24:00 (midnight)
    const minutesUntilMidnight = (24 * 60) - startTotalMinutes;
    
    // Convert to percentage of day height (each hour = 100%)
    duration = (minutesUntilMidnight / 60) * 100;
  } else if (isLastDay) {
    // Last day of multi-day event - show from midnight to end time
    topPercentage = 0;
    const [endHour, endMinute] = event.endTime.split(":");
    
    // Calculate duration from midnight (00:00) to end time
    let totalMinutes = parseInt(endHour) * 60 + parseInt(endMinute);
    
    // Round up if event ends at X:59
    if (parseInt(endMinute) === 59) {
      totalMinutes = (parseInt(endHour) + 1) * 60;
    }
    
    // Add 30 minutes to fix the last day ending 30 minutes early
    duration = ((totalMinutes + 30) / 60) * 100;
  } else {
    // Middle day - show full day (midnight to midnight)
    topPercentage = 0;
    // Add 45 minutes (as percentage of an hour) to fix middle days ending 45 minutes early
    duration = (24 * 100) + (30 / 60 * 100); // 24 hours * 100% + 45 minutes as percentage
  }

  return (
    <div
      onClick={() => onEventClick(event)}
      className="absolute p-1.5 text-xs rounded-md cursor-pointer overflow-hidden hover:opacity-90 transition-all duration-200 shadow-sm hover:shadow-md"
      style={{
        top: `${topPercentage}%`,
        height: `${duration}%`,
        minHeight: "24px",
        width: `${eventWidth}%`,
        left: `${leftOffset}%`,
        backgroundColor: event.color || "#dbeafe",
        color: event.color ? getContrastColor(event.color) : "#1e40af",
        zIndex: 10,
        transform: "scale(0.98)",
        transformOrigin: "left",
      }}
    >
      <div className="font-medium truncate text-[11px]">{event.title}</div>
      <div
        className="text-[10px] opacity-90"
        style={{
          color: event.color ? getContrastColor(event.color) : "#1e40af",
        }}
      >
        {formatEventTimeDisplay(event, date)}
      </div>
    </div>
  );
};

export default WeekViewEvent;
