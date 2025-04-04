'use client';

import React from 'react';

const CalendarOverview = ({ calendars }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4">Calendar Overview</h2>
      <div className="space-y-4">
        {calendars.map((calendar) => (
          <div
            key={calendar.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: calendar.color }}
              ></div>
              <span className="font-medium">{calendar.name}</span>
            </div>
            <span className="text-sm text-gray-600">
              {calendar.events?.length || 0} events
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarOverview;