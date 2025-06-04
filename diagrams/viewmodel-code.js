// viewmodels.js
import { auth, firestore } from "./firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

/**
 * Handles calendar-related operations
 */
export class CalendarViewModel {
  constructor() {
    this.events = [];
    this.googleEvents = [];
    this.selectedEvent = null;
    this.isModalOpen = false;
    this.isLoading = false;
    this.calendarId = "";
    this.hasGoogleCalendar = false;

    this.calendarUtils = new CalendarUtilsViewModel();
    this.googleCalendarViewModel = new GoogleCalendarViewModel();
  }

  async fetchCalendarAndEvents() {
    this.isLoading = true;
    try {
      const calendar = await this.fetchCalendar();
      if (calendar) {
        this.calendarId = calendar.id;
        await this.fetchEvents(calendar.id);
      }

      // Check if user has Google Calendar connected
      this.hasGoogleCalendar =
        await this.googleCalendarViewModel.checkGoogleCalendarAccess();
      if (this.hasGoogleCalendar) {
        this.googleEvents = await this.fetchGoogleCalendarEvents();
      }
    } catch (error) {
      console.error("Error fetching calendar and events:", error);
    } finally {
      this.isLoading = false;
    }
  }

  async fetchCalendar() {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return null;

      const calendarRef = collection(firestore, "calendars");
      const q = query(calendarRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const calendarDoc = querySnapshot.docs[0];
        return { id: calendarDoc.id, ...calendarDoc.data() };
      }
      return null;
    } catch (error) {
      console.error("Error fetching calendar:", error);
      return null;
    }
  }

  async fetchEvents(calId) {
    try {
      if (!calId) return [];

      const eventsRef = collection(firestore, "events");
      const q = query(eventsRef, where("calendarId", "==", calId));
      const querySnapshot = await getDocs(q);

      this.events = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return this.events;
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  }

  async fetchGoogleCalendarEvents() {
    return this.googleCalendarViewModel.fetchGoogleCalendarEvents(false);
  }

  async handleAddEvent(eventData) {
    try {
      if (!this.calendarId) throw new Error("No calendar found");

      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("No user authenticated");

      const eventWithCalendarId = {
        ...eventData,
        calendarId: this.calendarId,
        userId: currentUser.uid,
      };

      const eventsRef = collection(firestore, "events");
      const docRef = await addDoc(eventsRef, eventWithCalendarId);

      const newEvent = {
        id: docRef.id,
        ...eventWithCalendarId,
      };

      this.events.push(newEvent);
      return newEvent;
    } catch (error) {
      console.error("Error adding event:", error);
      throw error;
    }
  }

  async handleUpdateEvent(eventId, updatedData) {
    try {
      const eventRef = doc(firestore, "events", eventId);
      await updateDoc(eventRef, updatedData);

      // Update local event
      const eventIndex = this.events.findIndex((e) => e.id === eventId);
      if (eventIndex !== -1) {
        this.events[eventIndex] = {
          ...this.events[eventIndex],
          ...updatedData,
        };
        return this.events[eventIndex];
      }
      return null;
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  }

  async handleDeleteEvent(eventId) {
    try {
      const eventRef = doc(firestore, "events", eventId);
      await deleteDoc(eventRef);

      // Remove from local events
      this.events = this.events.filter((e) => e.id !== eventId);
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  }

  handleEventClick(event) {
    this.selectedEvent = event;
    this.isModalOpen = true;
  }

  async handleTextPrompt(text) {
    try {
      // Make API call to analyze event from text
      const response = await fetch("/api/analyze-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error("Failed to analyze text");
      const eventData = await response.json();
      return eventData;
    } catch (error) {
      console.error("Error analyzing text prompt:", error);
      throw error;
    }
  }
}

/**
 * Utility functions for calendar operations
 */
export class CalendarUtilsViewModel {
  getContrastColor(hexColor) {
    // Convert hex color to RGB and determine contrasting color
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "#000000" : "#FFFFFF";
  }

  isEventInDay(event, date) {
    const eventStartDate = new Date(event.startDate);
    const eventEndDate = new Date(event.endDate);
    const dayStart = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const dayEnd = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      23,
      59,
      59
    );

    return eventStartDate <= dayEnd && eventEndDate >= dayStart;
  }

  formatEventTimeDisplay(event, date) {
    const eventStartDate = new Date(event.startDate);
    const eventEndDate = new Date(event.endDate);
    const isSameDay =
      eventStartDate.toDateString() === eventEndDate.toDateString();

    if (isSameDay) {
      return `${event.startTime} - ${event.endTime}`;
    } else {
      // Multi-day event formatting
      if (date.toDateString() === eventStartDate.toDateString()) {
        return `Starts: ${event.startTime}`;
      } else if (date.toDateString() === eventEndDate.toDateString()) {
        return `Ends: ${event.endTime}`;
      } else {
        return "All day";
      }
    }
  }

  getEventsForDay(date, events) {
    return events.filter((event) => this.isEventInDay(event, date));
  }

  getEventsForHour(date, hour, events) {
    const hourStart = parseInt(hour.split(":")[0]);
    return this.getEventsForDay(date, events).filter((event) => {
      const eventHour = parseInt(event.startTime.split(":")[0]);
      return eventHour === hourStart;
    });
  }

  getDayMultiDayEvents(date, events) {
    const multiDayEvents = events.filter((event) => {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      return (
        endDate.getTime() - startDate.getTime() >= 86400000 &&
        this.isEventInDay(event, date)
      );
    });

    // Group by position in the week
    const eventMap = {};
    multiDayEvents.forEach((event) => {
      // Logic to place events in rows to avoid overlap
      let row = 0;
      while (eventMap[row] && this.eventsOverlap(eventMap[row], event)) {
        row++;
      }
      if (!eventMap[row]) eventMap[row] = [];
      eventMap[row].push(event);
    });

    return eventMap;
  }

  eventsOverlap(existingEvents, newEvent) {
    const newStartDate = new Date(newEvent.startDate);
    const newEndDate = new Date(newEvent.endDate);

    return existingEvents.some((event) => {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      return startDate <= newEndDate && endDate >= newStartDate;
    });
  }

  getMonthDays(currentDate) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of month
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay();

    // Last day of month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Calculate days from previous month to show
    const daysFromPrevMonth = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const days = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (
      let i = prevMonthLastDay - daysFromPrevMonth + 1;
      i <= prevMonthLastDay;
      i++
    ) {
      days.push({
        date: new Date(year, month - 1, i),
        isCurrentMonth: false,
        isToday: false,
      });
    }

    // Current month days
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
      });
    }

    // Next month days to complete the grid
    const remainingDays = 42 - days.length; // 6 rows of 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        isToday: false,
      });
    }

    return days;
  }

  getWeekViewDays(currentDate) {
    const days = [];
    const dayOfWeek = currentDate.getDay();
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    // Get Monday of the week
    const monday = new Date(currentDate);
    monday.setDate(currentDate.getDate() - daysSinceMonday);

    // Create array of 7 days starting from Monday
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      days.push({
        date,
        isToday: date.toDateString() === today.toDateString(),
      });
    }

    return days;
  }

  getHeaderText(viewMode, currentDate) {
    const options = { month: "long", year: "numeric" };

    if (viewMode === "month") {
      return currentDate.toLocaleDateString("en-US", options);
    } else if (viewMode === "week") {
      const weekDays = this.getWeekViewDays(currentDate);
      const firstDay = weekDays[0].date;
      const lastDay = weekDays[6].date;

      if (firstDay.getMonth() === lastDay.getMonth()) {
        return `${firstDay.toLocaleDateString("en-US", {
          month: "long",
        })} ${firstDay.getDate()}-${lastDay.getDate()}, ${firstDay.getFullYear()}`;
      } else if (firstDay.getFullYear() === lastDay.getFullYear()) {
        return `${firstDay.toLocaleDateString("en-US", {
          month: "short",
        })} ${firstDay.getDate()} - ${lastDay.toLocaleDateString("en-US", {
          month: "short",
        })} ${lastDay.getDate()}, ${firstDay.getFullYear()}`;
      } else {
        return `${firstDay.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })} - ${lastDay.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`;
      }
    } else if (viewMode === "day") {
      return currentDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }

    return "";
  }

  isCurrentPeriod(viewMode, currentDate) {
    const today = new Date();

    if (viewMode === "month") {
      return (
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear()
      );
    } else if (viewMode === "week") {
      const weekDays = this.getWeekViewDays(currentDate);
      return weekDays.some((day) => day.isToday);
    } else if (viewMode === "day") {
      return (
        currentDate.getDate() === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear()
      );
    }

    return false;
  }
}

/**
 * Handles authentication operations
 */
export class AuthViewModel {
  constructor() {
    this.user = null;
    this.loading = true;
    this.userViewModel = new UserViewModel();
  }

  async logout() {
    try {
      await signOut(auth);
      this.user = null;
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  }

  async createUser(user) {
    try {
      const userRef = collection(firestore, "users");
      await addDoc(userRef, {
        ...user,
        createdAt: new Date(),
        updatedAt: new Date(),
        hasAccess: true,
        role: "client",
      });
      return true;
    } catch (error) {
      console.error("Error creating user:", error);
      return false;
    }
  }

  async createCalendar(userId) {
    try {
      const calendarRef = collection(firestore, "calendars");
      await addDoc(calendarRef, {
        name: "My Calendar",
        userId,
        events: [],
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Error creating calendar:", error);
      throw error;
    }
  }

  async createColorCode(userId) {
    try {
      const colorCodeRef = collection(firestore, "colorCodes");
      await addDoc(colorCodeRef, {
        userId,
        colorCodes: {
          meeting: "#4285F4",
          appointment: "#34A853",
          deadline: "#EA4335",
          reminder: "#FBBC05",
          personal: "#9C27B0",
          work: "#FF6D01",
        },
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Error creating color code:", error);
      throw error;
    }
  }

  async signInWithEmail(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      this.user = userCredential.user;
      return this.user;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  }

  async signUpWithEmail(email, password, name) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Create user profile in Firestore
      await this.createUser({
        id: user.uid,
        email,
        name,
      });

      // Create calendar for new user
      await this.createCalendar(user.uid);

      // Create default color codes
      await this.createColorCode(user.uid);

      this.user = user;
      return user;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  }
}

/**
 * Handles user operations
 */
export class UserViewModel {
  constructor() {
    this.dbUser = null;
    this.users = [];
    this.isLoading = false;
  }

  async fetchDbUser() {
    this.isLoading = true;
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        this.dbUser = null;
        return;
      }

      this.dbUser = await this.findUserInFirestore(userId);
    } catch (error) {
      console.error("Error fetching user:", error);
      this.dbUser = null;
    } finally {
      this.isLoading = false;
    }
  }

  async fetchUsers() {
    this.isLoading = true;
    try {
      const usersRef = collection(firestore, "users");
      const querySnapshot = await getDocs(usersRef);

      this.users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      this.isLoading = false;
    }
  }

  async handleDelete(userId) {
    try {
      // Delete user document from Firestore
      const usersRef = collection(firestore, "users");
      const q = query(usersRef, where("id", "==", userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        await deleteDoc(doc(firestore, "users", userDoc.id));
      }

      // Remove from local users
      this.users = this.users.filter((user) => user.id !== userId);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  async findUserInFirestore(userId) {
    try {
      const usersRef = collection(firestore, "users");
      const q = query(usersRef, where("id", "==", userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return {
          id: userDoc.id,
          ...userDoc.data(),
        };
      }

      return null;
    } catch (error) {
      console.error("Error finding user:", error);
      return null;
    }
  }

  async isUserAdmin(userId) {
    try {
      const user = await this.findUserInFirestore(userId);
      return user?.role === "admin";
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  }
}

/**
 * Handles Google Calendar integration
 */
export class GoogleCalendarViewModel {
  constructor() {
    this.isGoogleLoading = false;
    this.colorCodeViewModel = new ColorCodeViewModel();
  }

  async checkGoogleCalendarAccess() {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return false;

      const userRef = collection(firestore, "users");
      const q = query(userRef, where("id", "==", userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        return userData.googleCalendar?.connected || false;
      }

      return false;
    } catch (error) {
      console.error("Error checking Google Calendar access:", error);
      return false;
    }
  }

  async handleGoogleCalendarToggle(enabled) {
    try {
      if (enabled) {
        // Redirect to Google OAuth
        window.location.href = "/api/google-calendar/auth";
      } else {
        // Disconnect Google Calendar
        const response = await fetch("/api/google-calendar/disconnect", {
          method: "POST",
        });

        if (!response.ok)
          throw new Error("Failed to disconnect Google Calendar");
      }
    } catch (error) {
      console.error("Error toggling Google Calendar:", error);
      throw error;
    }
  }

  async fetchGoogleCalendarEvents(forceRefresh = false) {
    this.isGoogleLoading = true;
    try {
      const url = forceRefresh
        ? "/api/google-calendar/events?refresh=true"
        : "/api/google-calendar/events";

      const response = await fetch(url);
      if (!response.ok)
        throw new Error("Failed to fetch Google Calendar events");

      const { events } = await response.json();

      // Process events and assign colors based on title/description
      return events.map((event) => {
        const color = this.colorCodeViewModel.getColorForText(event.title);
        return {
          ...event,
          color,
        };
      });
    } catch (error) {
      console.error("Error fetching Google Calendar events:", error);
      return [];
    } finally {
      this.isGoogleLoading = false;
    }
  }
}

/**
 * Handles color coding for events
 */
export class ColorCodeViewModel {
  constructor() {
    this.colorCodes = null;
    this.isLoading = false;
  }

  async fetchColorCodes() {
    this.isLoading = true;
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        this.colorCodes = null;
        return;
      }

      const colorCodeRef = collection(firestore, "colorCodes");
      const q = query(colorCodeRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const colorCodeDoc = querySnapshot.docs[0];
        this.colorCodes = {
          id: colorCodeDoc.id,
          ...colorCodeDoc.data(),
        };
      } else {
        this.colorCodes = null;
      }
    } catch (error) {
      console.error("Error fetching color codes:", error);
      this.colorCodes = null;
    } finally {
      this.isLoading = false;
    }
  }

  async updateColorCode(text, color) {
    try {
      if (!this.colorCodes) await this.fetchColorCodes();
      if (!this.colorCodes) throw new Error("No color codes found");

      const colorCodeRef = doc(firestore, "colorCodes", this.colorCodes.id);
      const updatedColorCodes = {
        ...this.colorCodes.colorCodes,
        [text]: color,
      };

      await updateDoc(colorCodeRef, {
        colorCodes: updatedColorCodes,
      });

      this.colorCodes.colorCodes = updatedColorCodes;
    } catch (error) {
      console.error("Error updating color code:", error);
      throw error;
    }
  }

  getColorForText(text) {
    if (!this.colorCodes || !this.colorCodes.colorCodes) {
      return "#4285F4"; // Default blue color
    }

    // Check for exact match first
    if (this.colorCodes.colorCodes[text]) {
      return this.colorCodes.colorCodes[text];
    }

    // Check if any keyword is in the text
    for (const [keyword, color] of Object.entries(this.colorCodes.colorCodes)) {
      if (text.toLowerCase().includes(keyword.toLowerCase())) {
        return color;
      }
    }

    // Default color if no match found
    return "#4285F4";
  }
}
