"use client";

import React, { useState, useEffect } from "react";

export default function CalendarView({ events, onEventClick, isLoading }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hours = Array.from({ length: 24 }, (_, i) => {
    return `${i.toString().padStart(2, "0")}:00`;
  });

  // Function to determine text color based on background color brightness
  const getContrastColor = (hexColor) => {
    // Default to white if no color is provided
    if (!hexColor) return "#ffffff";

    // Convert hex to RGB
    let hex = hexColor.replace("#", "");

    // Handle shorthand hex
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate brightness using the perceived brightness formula
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // Return white for dark colors and black for light colors
    return brightness > 128 ? "#000000" : "#ffffff";
  };

  const navigateMonth = (direction) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const monthYear = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const getMonthName = (offset) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + offset
    );
    return date.toLocaleString("default", { month: "long" });
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getPreviousMonthDays = (date) => {
    const firstDay = getFirstDayOfMonth(date);
    const prevMonthLastDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      0
    ).getDate();
    const days = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      const dayDate = new Date(
        date.getFullYear(),
        date.getMonth() - 1,
        prevMonthLastDay - i
      );
      days.push({
        date: prevMonthLastDay - i,
        isCurrentMonth: false,
        fullDate: dayDate
      });
    }
    return days;
  };

  const getCurrentMonthDays = (date) => {
    const daysInMonth = getDaysInMonth(date);
    return Array.from({ length: daysInMonth }, (_, i) => {
      const dayDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        i + 1
      );
      return {
        date: i + 1,
        isCurrentMonth: true,
        fullDate: dayDate
      };
    });
  };

  const getNextMonthDays = (date) => {
    const firstDay = getFirstDayOfMonth(date);
    const daysInMonth = getDaysInMonth(date);
    const lastDayOfMonth = new Date(
      date.getFullYear(),
      date.getMonth(),
      daysInMonth
    ).getDay();
    const nextDays = lastDayOfMonth === 6 ? 0 : 6 - lastDayOfMonth;

    const totalCurrentDays = firstDay + daysInMonth;
    const needsSixRows = Math.ceil(totalCurrentDays / 7) > 5;

    const extraDays = needsSixRows ? 7 - nextDays : 0;

    return Array.from({ length: nextDays + extraDays }, (_, i) => {
      const dayDate = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        i + 1
      );
      return {
        date: i + 1,
        isCurrentMonth: false,
        fullDate: dayDate
      };
    });
  };

  const days = [
    ...getPreviousMonthDays(currentDate),
    ...getCurrentMonthDays(currentDate),
    ...getNextMonthDays(currentDate),
  ];


  const getViewDays = () => {
    switch (viewMode) {
      case "week":
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        return Array.from({ length: 7 }, (_, i) => {
          const date = new Date(startOfWeek);
          date.setDate(startOfWeek.getDate() + i);
          return {
            date: date.getDate(),
            isCurrentMonth: date.getMonth() === currentDate.getMonth(),
            fullDate: date,
          };
        });
      default:
        return days;
    }
  };

  const viewDays = getViewDays();

  const navigateView = (direction) => {
    const newDate = new Date(currentDate);
    if (viewMode === "week") {
      newDate.setDate(currentDate.getDate() + direction * 7);
    } else {
      newDate.setMonth(currentDate.getMonth() + direction);
    }
    setCurrentDate(newDate);
  };

  const isCurrentPeriod = () => {
    const today = new Date();
    if (viewMode === "month") {
      return (
        today.getMonth() === currentDate.getMonth() &&
        today.getFullYear() === currentDate.getFullYear()
      );
    } else {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      return today >= startOfWeek && today <= endOfWeek;
    }
  };

  const getHeaderText = () => {
    if (viewMode === "month") {
      return monthYear;
    }

    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const startMonth = startOfWeek.toLocaleString("default", { month: "long" });
    const endMonth = endOfWeek.toLocaleString("default", { month: "long" });
    const startYear = startOfWeek.getFullYear();
    const endYear = endOfWeek.getFullYear();
    const dateRange = `${startOfWeek.getDate()}-${endOfWeek.getDate()}`;

    if (startMonth === endMonth) {
      return `${startMonth} ${startYear} (${dateRange})`;
    }

    if (startYear === endYear) {
      return `${startMonth} - ${endMonth} ${startYear} (${dateRange})`;
    }
  };

  const isEventInDay = (event, date) => {
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);

    // Reset time part for accurate date comparison
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

    return compareDate >= compareEventStart && compareDate <= compareEventEnd;
  };

  const getEventsForDay = (date, events) => {
    return events.filter((event) => isEventInDay(event, date));
  };

  const getEventsForHour = (date, hour, events) => {
    const dayEvents = getEventsForDay(date, events);
    return dayEvents
      .filter((event) => {
        const [eventStartHour] = event.startTime.split(":");
        const hourNum = parseInt(hour);
        const eventStartTime = parseInt(eventStartHour);
        return hourNum === eventStartTime;
      })
      .sort((a, b) => {
        // Sort events by start time
        const [aHour, aMin] = a.startTime.split(":");
        const [bHour, bMin] = b.startTime.split(":");
        return (
          parseInt(aHour) * 60 +
          parseInt(aMin) -
          (parseInt(bHour) * 60 + parseInt(bMin))
        );
      });
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === '.') {
        setIsSearchModalOpen(!isSearchModalOpen);
      }
    };
  
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isSearchModalOpen]);

  const handleDateSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/parse-date', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dateText: e.target.date.value }),
      });

      const data = await response.json();
      // No need to validate as API will return today's date as fallback in case of invalid input

      const searchDate = new Date(data.date);
      setCurrentDate(searchDate);
      setIsSearchModalOpen(false);
    } catch (error) {
      console.error('Error parsing date:', error);
      e.target.date.setCustomValidity('Failed to parse date');
      e.target.date.reportValidity();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 h-[calc(100vh-160px)] flex flex-col relative">
      {isLoading && (
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center z-50 backdrop-blur-[0.5px]">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-lg"></div>
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{getHeaderText()}</h2>
        <div className="flex items-center gap-4">
          <div className="flex gap-2 mr-4">
            <button
              onClick={goToToday}
              disabled={isCurrentPeriod()}
              className={`px-2 py-1 mr-3 rounded ${
                isCurrentPeriod()
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
              {viewMode === "month" ? getMonthName(-1) : "Previous"}
            </span>
          </button>
          <button
            onClick={() => navigateView(1)}
            className="flex items-center justify-center gap-1 px-2 py-1 hover:bg-gray-100 rounded-lg text-gray-600 w-28"
          >
            <span className="text-sm">
              {viewMode === "month" ? getMonthName(1) : "Next"}
            </span>
            <span>→</span>
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {viewMode === "week" ? (
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
                          date.setDate(
                            date.getDate() - date.getDay() + dayIndex
                          );
                          const hourNum = parseInt(hour);
                          const hourEvents = getEventsForHour(
                            date,
                            hourNum,
                            events
                          );

                          return (
                            <td
                              key={dayIndex}
                              className="border p-2 relative bg-white"
                            >
                              {hourEvents.map((event, idx) => {
                                const [startHour, startMinute] = event.startTime.split(":");
                                const [endHour, endMinute] = event.endTime
                                  ? event.endTime.split(":")
                                  : [`${parseInt(startHour) + 1}`, "00"];

                                const topPercentage = (parseInt(startMinute) / 60) * 100;
                                const hoursDiff = parseInt(endHour) - parseInt(startHour);
                                const minutesDiff = (parseInt(endMinute) - parseInt(startMinute)) / 60;
                                const duration = (hoursDiff + minutesDiff) * 100;

                                // Improved overlapping event layout
                                const totalEvents = hourEvents.length;
                                const eventWidth = totalEvents > 1 && idx === 0 ? 75 : 100; // First event 75% width, others 100%
                                const leftOffset = totalEvents > 1 && idx === 0 ? 15 : 0; // First event offset to right

                                return (
                                  <div
                                    key={idx}
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
                                      zIndex: totalEvents - idx,
                                      transform: "scale(0.98)",
                                      transformOrigin: "left",
                                    }}
                                  >
                                    <div className="font-medium truncate text-[11px]">
                                      {event.title}
                                    </div>
                                    <div
                                      className="text-[10px] opacity-90"
                                      style={{
                                        color: event.color ? getContrastColor(event.color) : "#1e40af",
                                      }}
                                    >
                                      {event.startTime} - {event.endTime}
                                    </div>
                                  </div>
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
        ) : (
          <div className="grid grid-cols-7 gap-[1px] bg-gray-200">
            {weekDays.map((day) => (
              <div
                key={day}
                className="bg-gray-50 p-2 text-center font-semibold"
              >
                {day}
              </div>
            ))}
            {days.map((day, index) => {
              const date = day.fullDate || new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day.date
              );
              const dayEvents = getEventsForDay(date, events);

              return (
                <div
                  key={index}
                  className={`h-[120px] p-2 ${
                    day.isCurrentMonth ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <span
                    className={`text-sm ${
                      day.isCurrentMonth ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {day.date}
                  </span>
                  <div className="mt-1 h-[85px] overflow-y-auto scrollbar-none">
                    <div className="space-y-1">
                      {dayEvents.map((event, idx) => (
                        <div
                          key={idx}
                          onClick={() => onEventClick(event)}
                          className="text-xs p-1 mb-1 rounded cursor-pointer"
                          style={{
                            backgroundColor: event.color || "#dbeafe",
                            color: event.color
                              ? getContrastColor(event.color)
                              : "#1e40af",
                          }}
                        >
                          <div className="truncate">{event.title}</div>
                          <div
                            className="text-xs truncate"
                            style={{
                              color: event.color
                                ? getContrastColor(event.color)
                                : "#1e40af",
                            }}
                          >
                            {event.startTime} - {event.endTime}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {isSearchModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-200" 
          onClick={() => setIsSearchModalOpen(false)}
          style={{ paddingTop: '20vh' }}
        >
          <div 
            className="w-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 transform transition-all duration-200 scale-100" 
            onClick={e => e.stopPropagation()}
          >
            <form onSubmit={handleDateSearch} className="p-4">
              <input
                type="text"
                name="date"
                autoFocus
                placeholder="Jump to date... (e.g., 'tomorrow', 'next monday', '2024-03-15')"
                className="w-full bg-transparent text-gray-900 text-xl px-4 py-3 border-none focus:outline-none placeholder-gray-400"
                required
              />
              <div className="mt-2 px-4 text-sm text-gray-500">
                <span>Press Enter to jump to date, Esc to cancel</span>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
