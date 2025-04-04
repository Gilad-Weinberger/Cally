'use client';

import React from 'react';

const EventList = ({ events }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
      <div className="space-y-4">
        {events.length === 0 ? (
          <p className="text-gray-600">No upcoming events</p>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium text-lg mb-1">{event.title}</h3>
              <p className="text-gray-600 text-sm">
                {new Date(event.start).toLocaleString()}
              </p>
              {event.description && (
                <p className="text-gray-700 mt-2">{event.description}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventList;