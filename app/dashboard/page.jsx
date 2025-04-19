"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/shared/layout/Navbar";
import CalendarOverview from "@/components/DashboardPage/CalendarOverview";
import PromptInput from "@/components/DashboardPage/PromptInput";
import EventList from "@/components/DashboardPage/EventList";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy, getDocs } from "firebase/firestore";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [calendars, setCalendars] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    let unsubscribeEvents = null;
    let unsubscribeCalendars = null;

    const fetchData = async () => {
      try {
        const calendarQuery = query(
          collection(db, "calendars"),
          where("userId", "==", user.uid)
        );

        unsubscribeCalendars = onSnapshot(calendarQuery, (snapshot) => {
          const calendarData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCalendars(calendarData);
        });

        // Subscribe to upcoming events only
        const now = new Date();
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
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
        setLoading(false);
      }
      finally {
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
