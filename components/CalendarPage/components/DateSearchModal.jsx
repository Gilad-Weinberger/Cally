"use client";

import React from "react";

const DateSearchModal = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-200"
      onClick={onClose}
      style={{ paddingTop: "20vh" }}
    >
      <div
        className="w-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 transform transition-all duration-200 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={onSubmit} className="p-4">
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
  );
};

export default DateSearchModal;
