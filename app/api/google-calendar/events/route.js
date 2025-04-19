import { NextResponse } from "next/server";
import { google } from "googleapis";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

// Cache settings
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

// Google Calendar color ID mapping to hex colors
const GOOGLE_CALENDAR_COLORS = {
  "1": "#7986CB", // Lavender
  "2": "#33B679", // Sage
  "3": "#8E24AA", // Grape
  "4": "#E67C73", // Flamingo
  "5": "#F6BF26", // Banana
  "6": "#F4511E", // Tangerine
  "7": "#039BE5", // Peacock
  "8": "#616161", // Graphite
  "9": "#3F51B5", // Blueberry
  "10": "#0B8043", // Basil
  "11": "#D50000", // Tomato
  "default": "#4285F4", // Default Google blue
};

// Helper function to get OAuth2 client with user's tokens
async function getOAuth2ClientForUser(userId) {
  try {
    // Get user's stored tokens
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists() || !userDoc.data().googleCalendar) {
      throw new Error("User has not connected Google Calendar");
    }

    const { accessToken, refreshToken, expiry } = userDoc.data().googleCalendar;

    // Initialize OAuth2 client
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );

    // Set credentials
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
      expiry_date: expiry,
    });

    // Handle token refresh if needed
    if (Date.now() > expiry) {
      const { tokens } = await oauth2Client.refreshToken(refreshToken);

      // Update tokens in database
      await updateDoc(userRef, {
        "googleCalendar.accessToken": tokens.access_token,
        "googleCalendar.expiry": tokens.expiry_date,
        ...(tokens.refresh_token && {
          "googleCalendar.refreshToken": tokens.refresh_token,
        }),
      });

      // Update client credentials
      oauth2Client.setCredentials(tokens);
    }

    return oauth2Client;
  } catch (error) {
    console.error("Error setting up OAuth client for user:", error);
    throw error;
  }
}

// Format Google Calendar events to match the app's event format
function formatGoogleEvents(googleEvents) {
  return googleEvents.map((event) => {
    // Get start date and time
    let startDate = event.start.date || event.start.dateTime?.split("T")[0];
    let startTime = event.start.dateTime
      ? event.start.dateTime.split("T")[1].substring(0, 5)
      : "00:00";

    // Get end date and time
    let endDate = event.end.date || event.end.dateTime?.split("T")[0];
    let endTime = event.end.dateTime
      ? event.end.dateTime.split("T")[1].substring(0, 5)
      : "23:59";

    // Check if this is an all-day event and adjust end date
    if (event.start.date && event.end.date) {
      // Google Calendar sets end date as the day after for all-day events
      const endDateObj = new Date(endDate);
      endDateObj.setDate(endDateObj.getDate() - 1);
      endDate = endDateObj.toISOString().split("T")[0];
    }

    return {
      id: event.id,
      title: event.summary || "Untitled Event",
      startDate: startDate,
      endDate: endDate,
      startTime: startTime,
      endTime: endTime,
      color: GOOGLE_CALENDAR_COLORS[event.colorId] || GOOGLE_CALENDAR_COLORS["default"], // Map color ID to hex color
      description: event.description || "",
      location: event.location || "",
      isGoogleEvent: true,
      calendar: event.organizer?.displayName || "Google Calendar",
    };
  });
}

// Check if we should use cached events
async function getEventsFromCache(userId) {
  try {
    const cacheRef = doc(db, "googleCalendarCache", userId);
    const cacheDoc = await getDoc(cacheRef);
    
    if (cacheDoc.exists()) {
      const { events, timestamp } = cacheDoc.data();
      
      // Check if cache is still valid (not expired)
      if (timestamp && Date.now() - timestamp < CACHE_EXPIRY_MS) {
        return events;
      }
    }
    return null;
  } catch (error) {
    console.error("Error checking cache:", error);
    return null;
  }
}

// Save events to cache
async function cacheEvents(userId, events) {
  try {
    const cacheRef = doc(db, "googleCalendarCache", userId);
    await setDoc(cacheRef, {
      events,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error("Error saving to cache:", error);
  }
}

export async function GET(request) {
  try {
    // Get the user ID and possible force refresh from the query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const forceRefresh = searchParams.get("timestamp") !== null;

    console.log(`Google Calendar events API called for userId: ${userId}, forceRefresh: ${forceRefresh}`);

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Check if user has connected Google Calendar
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      console.log(`User ${userId} not found in database`);
      return NextResponse.json(
        { error: "User not found", events: [] },
        { status: 200 }
      );
    }

    const googleCalendarData = userDoc.data()?.googleCalendar;
    
    if (!googleCalendarData?.connected) {
      console.log(`User ${userId} has not connected Google Calendar`);
      return NextResponse.json(
        { error: "Google Calendar not connected", events: [] },
        { status: 200 }
      );
    }
    
    console.log(`User ${userId} has Google Calendar connected, access token exists: ${!!googleCalendarData.accessToken}`);

    // Try to get events from cache if not forcing refresh
    if (!forceRefresh) {
      const cachedEvents = await getEventsFromCache(userId);
      if (cachedEvents) {
        console.log(`Returning ${cachedEvents.length} events from cache for user ${userId}`);
        return NextResponse.json({ events: cachedEvents, fromCache: true });
      }
    }

    // Get user's OAuth client
    console.log(`Setting up OAuth client for user ${userId}`);
    const oauth2Client = await getOAuth2ClientForUser(userId);
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // Calculate more efficient date ranges
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Start from beginning of today
    
    const threeMonthsLater = new Date(now);
    threeMonthsLater.setMonth(now.getMonth() + 3);

    console.log(`Fetching events from ${now.toISOString()} to ${threeMonthsLater.toISOString()}`);

    // Get events from primary calendar
    try {
      const response = await calendar.events.list({
        calendarId: "primary",
        timeMin: now.toISOString(),
        timeMax: threeMonthsLater.toISOString(),
        maxResults: 250, // Increased for better coverage
        singleEvents: true,
        orderBy: "startTime",
        fields: "items(id,summary,description,location,start,end,colorId,organizer)", // Only get fields we need
      });

      const events = formatGoogleEvents(response.data.items || []);
      console.log(`Fetched ${events.length} events from Google Calendar for user ${userId}`);

      // Cache the events for future requests
      await cacheEvents(userId, events);

      return NextResponse.json({ events });
    } catch (apiError) {
      console.error("Google Calendar API error:", apiError);
      // Check if token is invalid and we need to reconnect
      if (apiError.code === 401 || apiError.message?.includes("invalid_grant")) {
        console.log("Token appears to be invalid, user may need to reconnect");
        // Update user record to show disconnected state
        await updateDoc(userRef, {
          "googleCalendar.connected": false,
          "googleCalendar.error": "Authentication token expired or revoked. Please reconnect."
        });
        
        return NextResponse.json(
          { 
            error: "Google Calendar authentication expired", 
            message: "Please reconnect your Google Calendar",
            reconnectNeeded: true,
            events: [] 
          },
          { status: 401 }
        );
      }
      
      throw apiError; // Let the outer catch handle other errors
    }
  } catch (error) {
    console.error("Error fetching Google Calendar events:", error);

    return NextResponse.json(
      { error: "Failed to fetch Google Calendar events", message: error.message, events: [] },
      { status: 500 }
    );
  }
}
