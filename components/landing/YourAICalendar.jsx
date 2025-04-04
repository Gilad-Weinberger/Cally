'use client';

import React from 'react';

const YourAICalendar = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto lg:mx-0">
      <div className="aspect-w-4 aspect-h-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl shadow-2xl overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="text-center text-sm font-medium text-gray-600">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => {
              const day = i + 1;
              const isToday = day === 15;
              const hasEvent = [3, 8, 12, 15, 22, 27].includes(day);
              return (
                <div
                  key={i}
                  className={`
                    aspect-square rounded-lg flex items-center justify-center text-sm
                    ${isToday ? 'bg-blue-500 text-white' : ''}
                    ${hasEvent && !isToday ? 'bg-indigo-100' : ''}
                    ${!hasEvent && !isToday ? 'bg-white bg-opacity-50' : ''}
                  `}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-20 blur-2xl"></div>
      <div className="absolute -top-4 -left-4 w-32 h-32 bg-gradient-to-br from-blue-300 to-indigo-400 rounded-full opacity-20 blur-2xl"></div>
    </div>
  );
};

export default YourAICalendar;