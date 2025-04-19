"use client";

/**
 * Utility functions for calendar operations and event display
 */

// Function to determine text color based on background color brightness
export const getContrastColor = (hexColor) => {
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

// Check if an event occurs on a specific date
export const isEventInDay = (event, date) => {
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

// Format event time display based on multi-day event position
export const formatEventTimeDisplay = (event, date) => {
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

  // Calculate if this is a multi-day event
  const isMultiDayEvent =
    compareEventStart.getTime() !== compareEventEnd.getTime();

  if (!isMultiDayEvent) {
    // Single day event - show normal time
    return `${event.startTime} - ${event.endTime}`;
  }

  // Check if this is the first day of the event
  if (compareDate.getTime() === compareEventStart.getTime()) {
    return `${event.startTime} - 23:59`;
  }

  // Check if this is the last day of the event
  if (compareDate.getTime() === compareEventEnd.getTime()) {
    return `00:00 - ${event.endTime}`;
  }

  // This is a middle day of the event
  return "00:00 - 23:59";
};

// Get events for a specific day
export const getEventsForDay = (date, events) => {
  return events.filter((event) => isEventInDay(event, date));
};

// Get events for a specific hour
export const getEventsForHour = (date, hour, events) => {
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

// Categorize daily events as multi-day start, middle, end, or single day
export const getDayMultiDayEvents = (date, events) => {
  const dayEvents = getEventsForDay(date, events);

  const eventsByType = {
    multiDayStart: [],
    multiDayMiddle: [],
    multiDayEnd: [],
    singleDay: [],
  };

  dayEvents.forEach((event) => {
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
      compareEventStart.getTime() !== compareEventEnd.getTime();

    if (!isMultiDayEvent) {
      eventsByType.singleDay.push(event);
    } else if (compareDate.getTime() === compareEventStart.getTime()) {
      eventsByType.multiDayStart.push(event);
    } else if (compareDate.getTime() === compareEventEnd.getTime()) {
      eventsByType.multiDayEnd.push(event);
    } else {
      eventsByType.multiDayMiddle.push(event);
    }
  });

  return eventsByType;
};

// Get days for month view
export const getMonthDays = (currentDate) => {
  return [
    ...getPreviousMonthDays(currentDate),
    ...getCurrentMonthDays(currentDate),
    ...getNextMonthDays(currentDate),
  ];
};

// Get days in a month
export const getDaysInMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

// Get the first day of the month
export const getFirstDayOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

// Get days from previous month to display in current month view
export const getPreviousMonthDays = (date) => {
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
      fullDate: dayDate,
    });
  }
  return days;
};

// Get days from current month
export const getCurrentMonthDays = (date) => {
  const daysInMonth = getDaysInMonth(date);
  return Array.from({ length: daysInMonth }, (_, i) => {
    const dayDate = new Date(date.getFullYear(), date.getMonth(), i + 1);
    return {
      date: i + 1,
      isCurrentMonth: true,
      fullDate: dayDate,
    };
  });
};

// Get days from next month to display in current month view
export const getNextMonthDays = (date) => {
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
    const dayDate = new Date(date.getFullYear(), date.getMonth() + 1, i + 1);
    return {
      date: i + 1,
      isCurrentMonth: false,
      fullDate: dayDate,
    };
  });
};

// Get days for week view
export const getWeekViewDays = (currentDate) => {
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
};

// Get header text based on view mode
export const getHeaderText = (viewMode, currentDate) => {
  const monthYear = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

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

  return `${startMonth} ${startYear} - ${endMonth} ${endYear} (${dateRange})`;
};

// Check if viewing the current period (month or week)
export const isCurrentPeriod = (viewMode, currentDate) => {
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

// Get month name with optional offset
export const getMonthName = (currentDate, offset = 0) => {
  const date = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + offset
  );
  return date.toLocaleString("default", { month: "long" });
};
