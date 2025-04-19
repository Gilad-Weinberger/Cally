"use client";

import React from "react";
import WeekViewEvent from "./WeekViewEvent";
import { getDayMultiDayEvents, getWeekViewDays } from "../utils/calendarUtils";

const WeekView = ({ currentDate, events, onEventClick, weekDays, hours }) => {
  const viewDays = getWeekViewDays(currentDate);

  return (
    <div className="h-full">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 sticky top-0 z-10">
            <th className="border p-2 w-20 min-w-[80px]"></th>
            {weekDays.map((day, index) => (
              <th
                key={day}
                className="border p-2 text-center bg-gray-50"
                style={{ width: "calc(100% / 7)" }}
              >
                <div className="font-semibold">{day}</div>
                <div className="text-sm text-gray-500">
                  {viewDays[index]?.date || ""}
                </div>
              </th>
            ))}
          </tr>
        </thead>
      </table>
      <div
        className="overflow-y-scroll scrollbar-none"
        style={{
          height: "calc(100vh - 280px)",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        <table className="w-full border-collapse">
          <tbody>
            {hours.map((hour) => (
              <tr key={hour} className="h-12">
                <td className="border p-2 text-sm text-gray-500 bg-gray-50 w-20 min-w-[80px]">
                  {hour}
                </td>
                {Array(7)
                  .fill(null)
                  .map((_, dayIndex) => {
                    const date = new Date(currentDate);
                    date.setDate(date.getDate() - date.getDay() + dayIndex);
                    const hourNum = parseInt(hour);

                    // Get categorized events for this day and hour
                    const dayEvents = getDayMultiDayEvents(date, events);

                    // Render events that are supposed to be in this hour cell
                    const renderEvents = [];

                    // Add single day events that start in this hour
                    const singleDayEvents = dayEvents.singleDay.filter(
                      (event) => {
                        const [eventStartHour] = event.startTime.split(":");
                        return parseInt(eventStartHour) === hourNum;
                      }
                    );
                    renderEvents.push(...singleDayEvents);

                    // Add multi-day start events that start in this hour
                    const multiDayStartEvents = dayEvents.multiDayStart.filter(
                      (event) => {
                        const [eventStartHour] = event.startTime.split(":");
                        return parseInt(eventStartHour) === hourNum;
                      }
                    );
                    renderEvents.push(...multiDayStartEvents);

                    // Add multi-day end events only at hour 0
                    if (hourNum === 0) {
                      renderEvents.push(...dayEvents.multiDayEnd);
                    }

                    // Add multi-day middle events only at hour 0
                    if (hourNum === 0) {
                      renderEvents.push(...dayEvents.multiDayMiddle);
                    }

                    return (
                      <td
                        key={dayIndex}
                        className="border p-2 relative bg-white"
                      >
                        {renderEvents.map((event, idx) => {
                          const eventStart = new Date(event.startDate);
                          const eventEnd = new Date(event.endDate);

                          // Reset time for date comparison
                          const compareDate = new Date(
                            date.getFullYear(),
                            date.getMonth(),
                            date.getDate()
                          );
                          const compareEventStart = new Date(
                            eventStart.getFullYear(),
                            eventStart.getMonth(),
                            eventStart.getDate()
                          );
                          const compareEventEnd = new Date(
                            eventEnd.getFullYear(),
                            eventEnd.getMonth(),
                            eventEnd.getDate()
                          );

                          const isMultiDayEvent =
                            compareEventStart.getTime() !==
                            compareEventEnd.getTime();
                          const isFirstDay =
                            compareDate.getTime() ===
                            compareEventStart.getTime();
                          const isLastDay =
                            compareDate.getTime() === compareEventEnd.getTime();

                          // Improved overlapping event layout
                          const totalEvents = renderEvents.length;
                          const eventWidth =
                            totalEvents > 1 ? 85 / totalEvents : 95;
                          const leftOffset = idx * (eventWidth + 2);

                          return (
                            <WeekViewEvent
                              key={idx}
                              event={event}
                              date={date}
                              isMultiDayEvent={isMultiDayEvent}
                              isFirstDay={isFirstDay}
                              isLastDay={isLastDay}
                              eventWidth={eventWidth}
                              leftOffset={leftOffset}
                              onEventClick={onEventClick}
                            />
                          );
                        })}
                      </td>
                    );
                  })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeekView;
