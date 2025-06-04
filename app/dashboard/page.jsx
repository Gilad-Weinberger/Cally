"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/shared/layout/Navbar";
import CalendarOverview from "@/components/DashboardPage/CalendarOverview";
import PromptInput from "@/components/DashboardPage/PromptInput";
import EventList from "@/components/DashboardPage/EventList";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  getDocs,
} from "firebase/firestore";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [calendars, setCalendars] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Don't run effect if user is not loaded yet
    if (!user) {
      return;
    }

    let unsubscribeEvents = null;
    let unsubscribeCalendars = null;

    const fetchData = async () => {
      // Guard clause: return early if user is not authenticated
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // First, fetch calendars
        const calendarQuery = query(
          collection(db, "calendars"),
          where("userId", "==", user.uid)
        );

        const calendarSnapshot = await getDocs(calendarQuery);
        const calendarData = calendarSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCalendars(calendarData);

        // Then fetch events - filter by user ID
        try {
          const eventsCollection = collection(db, "events");

          // For backward compatibility, also include events without userId that belong to user's calendars
          const queries = [
            // Get events directly associated with user
            getDocs(query(eventsCollection, where("userId", "==", user.uid))),
          ];

          // Add calendar-based query only if user has calendars (for backward compatibility)
          if (calendarData.length > 0) {
            queries.push(
              getDocs(
                query(
                  eventsCollection,
                  where(
                    "calendarId",
                    "in",
                    calendarData.map((cal) => cal.id)
                  )
                )
              )
            );
          }

          const results = await Promise.all(queries);
          const userEventsSnapshot = results[0];
          const calendarEventsSnapshot = results[1]; // Will be undefined if no calendar query

          // Combine and deduplicate events
          const allEventDocs = [
            ...userEventsSnapshot.docs,
            ...(calendarEventsSnapshot
              ? calendarEventsSnapshot.docs.filter(
                  (doc) =>
                    // Only include calendar events that don't have userId or belong to current user
                    !doc.data().userId || doc.data().userId === user.uid
                )
              : []),
          ];

          // Remove duplicates based on document ID
          const uniqueEventDocs = allEventDocs.filter(
            (doc, index, self) =>
              self.findIndex((d) => d.id === doc.id) === index
          );

          const eventsList = uniqueEventDocs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setEvents(eventsList);
        } catch (error) {
          console.error("Error fetching events:", error);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      if (unsubscribeCalendars) unsubscribeCalendars();
      if (unsubscribeEvents) unsubscribeEvents();
    };
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-red-600">Error: {error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <CalendarOverview calendars={calendars} />
          </div>
          <div className="lg:col-span-4">
            <EventList events={events} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
