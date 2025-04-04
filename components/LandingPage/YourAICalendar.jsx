import React from 'react';

const YourAICalendar = () => {
  return (
    <div className="relative w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-blue-100 opacity-50 blur-2xl"></div>
      <div className="relative p-4">
        <div className="rounded-lg bg-gray-50 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Your AI Calendar</h3>
            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">AI Powered</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center rounded-md bg-blue-50 p-3">
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">AI Suggestion</p>
                <p className="text-xs text-blue-600">Schedule team meeting on Tuesday at 2 PM</p>
              </div>
            </div>
            <div className="flex items-center rounded-md bg-indigo-50 p-3">
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-indigo-800">Time Optimization</p>
                <p className="text-xs text-indigo-600">Blocked 2 hours for focused work on project</p>
              </div>
            </div>
            <div className="flex items-center rounded-md bg-purple-50 p-3">
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-purple-800">Smart Reminder</p>
                <p className="text-xs text-purple-600">Prepare presentation for tomorrow's meeting</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourAICalendar;