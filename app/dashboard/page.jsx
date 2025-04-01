"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import CalendarOverview from "@/components/CalendarOverview";
import PromptInput from "@/components/PromptInput";
import EventList from "@/components/EventList";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [calendars, setCalendars] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      window.location.href = '/signin';
      return;
    }

    let unsubscribeEvents = null;

    const fetchData = async () => {
      try {
        // Subscribe to user's calendars
        const calendarQuery = query(
          collection(db, "calendars"),
          where("userId", "==", user.uid)
        );

        const unsubscribeCalendars = onSnapshot(calendarQuery, (snapshot) => {
          const calendarData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCalendars(calendarData);
        });

        // Subscribe to all user's events directly
        const eventsQuery = query(
          collection(db, "events"),
          where("userId", "==", user.uid)
        );

        unsubscribeEvents = onSnapshot(eventsQuery, (eventsSnapshot) => {
          const eventData = eventsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setEvents(eventData);
          setLoading(false);
        });

        return () => {
          unsubscribeCalendars();
          if (unsubscribeEvents) {
            unsubscribeEvents();
          }
        };
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
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
            <PromptInput
              onEventCreate={(eventData) => {
                // Handle event creation
              }}
            />
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
