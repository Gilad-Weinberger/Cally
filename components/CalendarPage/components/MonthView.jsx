"use client";

import React from "react";
import MonthDayEvent from "./MonthDayEvent";
import { getMonthDays, getEventsForDay } from "../utils/calendarUtils";

const MonthView = ({ currentDate, events, onEventClick, weekDays }) => {
  const days = getMonthDays(currentDate);

  return (
    <div className="grid grid-cols-7 h-full gap-[1px] bg-gray-200">
      {weekDays.map((day) => (
        <div key={day} className="bg-gray-50 p-2 text-center font-semibold">
          {day}
        </div>
      ))}
      {days.map((day, index) => {
        const date =
          day.fullDate ||
          new Date(currentDate.getFullYear(), currentDate.getMonth(), day.date);
        const dayEvents = getEventsForDay(date, events);

        // Calculate if this date is today
        const today = new Date();
        const isToday =
          today.getDate() === date.getDate() &&
          today.getMonth() === date.getMonth() &&
          today.getFullYear() === date.getFullYear();

        return (
          <div
            key={index}
            className={`min-h-[100px] p-2 ${
              day.isCurrentMonth ? "bg-white" : "bg-gray-50"
            } ${isToday ? "ring-2 ring-blue-500 ring-inset" : ""}`}
          >
            <div className="flex justify-between items-center">
              <span
                className={`font-medium ${
                  day.isCurrentMonth ? "text-gray-900" : "text-gray-400"
                } ${
                  isToday
                    ? "bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    : ""
                }`}
              >
                {day.date}
              </span>
            </div>
            <div className="mt-1 overflow-y-auto h-[calc(100%-20px)] scrollbar-none">
              <div className="space-y-1">
                {dayEvents.map((event, idx) => (
                  <MonthDayEvent
                    key={idx}
                    event={event}
                    date={date}
                    onEventClick={onEventClick}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MonthView;
