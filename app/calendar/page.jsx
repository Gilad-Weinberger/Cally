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
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import CalendarView from "@/components/CalendarPage/CalendarView";
import EventModal from "@/components/CalendarPage/EventModal";
import TextPromptInput from "@/components/CalendarPage/TextPromptInput";
import Sidebar from "@/components/shared/layout/Sidebar";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { FaRobot } from "react-icons/fa";
import { useSearchParams } from "next/navigation";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [googleEvents, setGoogleEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [calendarId, setCalendarId] = useState(null);
  const [isShrinkMode, setIsShrinkMode] = useState(false);
  const [hasGoogleCalendar, setHasGoogleCalendar] = useState(false);
  const { user } = useAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (user) {
      const googleConnected = searchParams.get("google_connected");
      fetchCalendarAndEvents(googleConnected === "true");
    }
  }, [user, searchParams]);

  const fetchCalendarAndEvents = async (forceGoogleRefresh = false) => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Fetch calendar and user data in parallel
      const [calendarData, hasGoogleCalendarAccess] = await Promise.all([
        fetchCalendar(),
        checkGoogleCalendarAccess(),
      ]);

      // If we have both, fetch events in parallel
      if (calendarData && hasGoogleCalendarAccess) {
        fetchEventsInParallel(calendarData.id, forceGoogleRefresh);
      } else if (calendarData) {
        // Just fetch local events
        await fetchEvents(calendarData.id);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error in fetchCalendarAndEvents:", error);
      setIsLoading(false);
    }
  };

  const fetchCalendar = async () => {
    try {
      const calendarsCollection = collection(db, "calendars");
      const calendarSnapshot = await getDocs(
        query(
          calendarsCollection,
          where("userId", "==", user.uid),
          where("name", "==", "General")
        )
      );

      // Check if calendar exists
      if (!calendarSnapshot.empty) {
        const generalCalendar = calendarSnapshot.docs[0];
        setCalendarId(generalCalendar.id);
        return { id: generalCalendar.id };
      } else {
        // Create General calendar if it doesn't exist
        console.log("Creating General calendar for user");
        const newCalendarRef = await addDoc(calendarsCollection, {
          name: "General",
          userId: user.uid,
          events: [],
          createdAt: new Date().toISOString(),
        });
        setCalendarId(newCalendarRef.id);
        setEvents([]); // No events yet since it's a new calendar
        return { id: newCalendarRef.id };
      }
    } catch (error) {
      console.error("Error fetching calendar:", error);
      return null;
    }
  };

  const checkGoogleCalendarAccess = async () => {
    try {
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      const hasAccess =
        userDoc.exists() && userDoc.data().googleCalendar?.connected;
      setHasGoogleCalendar(hasAccess);
      return hasAccess;
    } catch (error) {
      console.error("Error checking Google Calendar access:", error);
      return false;
    }
  };

  const fetchEventsInParallel = async (calId, forceGoogleRefresh = false) => {
    try {
      // Start both fetches in parallel
      setIsGoogleLoading(true);
      const localPromise = fetchEvents(calId);
      const googlePromise = fetchGoogleCalendarEvents(forceGoogleRefresh);

      // Wait for both to complete
      await Promise.all([localPromise, googlePromise]);
    } catch (error) {
      console.error("Error fetching events in parallel:", error);
    } finally {
      setIsLoading(false);
      setIsGoogleLoading(false);
    }
  };

  const fetchEvents = async (calId = calendarId) => {
    if (!calId) {
      console.log("No calendarId available, can't fetch events");
      return;
    }

    try {
      const eventsCollection = collection(db, "events");
      const q = query(eventsCollection, where("calendarId", "==", calId));
      const eventSnapshot = await getDocs(q);

      const eventsList = eventSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setEvents(eventsList);
      return eventsList;
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  };

  const fetchGoogleCalendarEvents = async (forceRefresh = false) => {
    if (!user || !hasGoogleCalendar) {
      console.log(
        "Skipping Google Calendar fetch:",
        !user ? "user not authenticated" : "Google Calendar not connected"
      );
      return [];
    }

    try {
      console.log(
        "Fetching Google Calendar events for user:",
        user.uid,
        forceRefresh ? "(force refresh)" : ""
      );

      // Add cache busting if force refresh is requested
      const cacheBuster = forceRefresh ? `&timestamp=${Date.now()}` : "";
      const url = `/api/google-calendar/events?userId=${user.uid}${cacheBuster}`;
      console.log("Request URL:", url);

      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "Google Calendar API error response:",
          response.status,
          errorText
        );
        throw new Error(
          `Failed to fetch Google Calendar events: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (data.events) {
        console.log(
          "Google Calendar Events fetched:",
          data.events.length,
          data.fromCache ? "(from cache)" : "(fresh data)"
        );
        if (data.events.length === 0) {
          console.log(
            "No Google Calendar events found. Check if your Google Calendar has any upcoming events."
          );
        } else {
          console.log("Sample events:", data.events.slice(0, 3));
        }
        setGoogleEvents(data.events);
        return data.events;
      } else if (data.error) {
        console.error(
          "Google Calendar API returned error:",
          data.error,
          data.message || ""
        );
        return [];
      }
      return [];
    } catch (error) {
      console.error("Error fetching Google Calendar events:", error);
      return [];
    }
  };

  const handleGoogleCalendarToggle = (enabled) => {
    if (enabled && user) {
      setIsGoogleLoading(true);
      fetchGoogleCalendarEvents(true).finally(() => setIsGoogleLoading(false));
    } else {
      // Clear Google events if disabled
      setGoogleEvents([]);
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

  const handleEventClick = (event) => {
    // If it's a Google Calendar event, we'll display it differently
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-gray-100 text-sm overflow-hidden">
      <Sidebar />
      {/* AI Chat Sidebar */}
      <div
        className={`${
          isShrinkMode ? "w-[60px]" : "w-[300px]"
        } border-r border-gray-200 bg-white transition-all max-h-screen overflow-hidden duration-300`}
      >
        <div className="h-full flex flex-col">
          <div className="p-3 border-b border-gray-200 flex justify-between items-center">
            {isShrinkMode ? (
              <FaRobot className="text-gray-500 w-5" />
            ) : (
              <h2 className="text-base font-semibold text-gray-800">
                AI Assistant
              </h2>
            )}
            <button
              onClick={() => setIsShrinkMode((prev) => !prev)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isShrinkMode ? (
                <ChevronRightIcon className="w-4 h-4" />
              ) : (
                <ChevronLeftIcon className="w-4 h-4" />
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
      <main className="flex-1 p-4 overflow-hidden flex flex-col">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden">
            <CalendarView
              events={events}
              googleEvents={googleEvents}
              hasGoogleCalendar={hasGoogleCalendar}
              onEventClick={handleEventClick}
              isLoading={isAddingEvent || isGoogleLoading}
              isGoogleLoading={isGoogleLoading}
              onGoogleCalendarToggle={handleGoogleCalendarToggle}
              onRefresh={() => fetchCalendarAndEvents(true)}
            />
          </div>
        )}

        {isModalOpen && (
          <EventModal
            event={selectedEvent}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedEvent(null);
            }}
            onDelete={selectedEvent?.isGoogleEvent ? null : handleDeleteEvent}
            onUpdate={selectedEvent?.isGoogleEvent ? null : handleUpdateEvent}
            isGoogleEvent={selectedEvent?.isGoogleEvent}
          />
        )}
      </main>
    </div>
  );
}
