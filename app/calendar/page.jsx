"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import CalendarView from "@/components/CalendarPage/CalendarView";
import EventModal from "@/components/CalendarPage/EventModal";
import TextPromptInput from "@/components/CalendarPage/TextPromptInput";
import ButtonConnectGoogleCalendar from "@/components/CalendarPage/ButtonConnectGoogleCalendar";
import Sidebar from "@/components/shared/layout/Sidebar";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { FaRobot } from "react-icons/fa";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [calendarId, setCalendarId] = useState(null);
  const [isShrinkMode, setIsShrinkMode] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchCalendarAndEvents();
  }, []);

  const fetchCalendarAndEvents = async () => {
    if (!user) return;

    try {
      // Fetch user's general calendar first
      const calendarsCollection = collection(db, "calendars");
      const calendarSnapshot = await getDocs(calendarsCollection);
      const generalCalendar = calendarSnapshot.docs.find(
        (doc) => doc.data().userId === user.uid && doc.data().name === "General"
      );

      if (generalCalendar) {
        setCalendarId(generalCalendar.id);
        await fetchEvents();
      }
    } catch (error) {
      console.error("Error fetching calendar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const eventsCollection = collection(db, "events");
      const eventSnapshot = await getDocs(eventsCollection);
      const eventsList = eventSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventsList);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleAddEvent = async (eventData) => {
    try {
      const eventsCollection = collection(db, "events");
      const eventRef = await addDoc(eventsCollection, {
        ...eventData,
        calendarId: calendarId,
      });

      // Update calendar's events array
      await updateDoc(doc(db, "calendars", calendarId), {
        events: arrayUnion(eventRef.id),
      });

      await fetchEvents();
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteDoc(doc(db, "events", eventId));
      await fetchEvents();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleUpdateEvent = async (eventId, updatedData) => {
    try {
      await updateDoc(doc(db, "events", eventId), updatedData);
      await fetchEvents();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      {/* AI Chat Sidebar */}
      <div
        className={`${
          isShrinkMode ? "w-[80px]" : "w-[430px]"
        } border-r border-gray-200 bg-white transition-all max-h-screen overflow-hidden duration-300`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            {isShrinkMode ? (
              <FaRobot className="text-gray-500 w-20" />
            ) : (
              <h2 className="text-lg font-semibold text-gray-800">
                AI Assistant
              </h2>
            )}
            <button
              onClick={() => setIsShrinkMode((prev) => !prev)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isShrinkMode ? (
                <ChevronRightIcon className="w-6 h-6" />
              ) : (
                <ChevronLeftIcon className="w-6 h-6" />
              )}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {/* Chat history could go here in the future */}
          </div>
          {!isShrinkMode && (
            <TextPromptInput
              onAddEvent={handleAddEvent}
              calendarId={calendarId}
              onLoadingChange={setIsAddingEvent}
            />
          )}
        </div>
      </div>
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Calendar</h1>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <CalendarView
            events={events}
            onEventClick={(event) => {
              setSelectedEvent(event);
              setIsModalOpen(true);
            }}
            isLoading={isAddingEvent}
          />
        )}

        {isModalOpen && (
          <EventModal
            event={selectedEvent}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedEvent(null);
            }}
            onDelete={handleDeleteEvent}
            onUpdate={handleUpdateEvent}
          />
        )}
      </main>
    </div>
  );
}
