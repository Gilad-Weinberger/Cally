import { google } from "googleapis";
import { db } from "@/lib/firebase";
import { doc, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

// Cache OAuth client to avoid re-initialization on each request
let cachedOauth2Client = null;

function getOauth2Client() {
  if (cachedOauth2Client) {
    return cachedOauth2Client;
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("Missing required Google OAuth environment variables");
  }

  console.log("Initializing OAuth2 client with redirect URI:", redirectUri);

  cachedOauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );
  return cachedOauth2Client;
}

export async function GET(request) {
  console.log("Google Calendar callback route executed");

  try {
    // Extract the auth code and state from query parameters
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    console.log(
      "Received code:",
      code ? "Valid code received" : "No code received"
    );
    console.log("State parameter:", state || "No state parameter");

    if (!code) {
      return new Response(
        JSON.stringify({ error: "Authorization code not found" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Get user ID from state parameter
    let userId;
    try {
      // The state parameter should contain the encoded user ID
      if (state) {
        const stateObj = JSON.parse(Buffer.from(state, "base64").toString());
        userId = stateObj.userId;
        console.log("User ID from state parameter:", userId);
      }
    } catch (error) {
      console.error("Error parsing state parameter:", error);
    }

    if (!userId) {
      console.log(
        "User ID not found in state parameter, redirecting to signin"
      );
      return NextResponse.redirect(
        new URL("/auth/signin?error=not_authenticated", request.url)
      );
    }

    console.log("User identified, exchanging code for tokens");
    const oauth2Client = getOauth2Client();

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    console.log("Tokens received successfully");

    // Store tokens in Firestore for the authenticated user
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      console.log("Updating existing user with Google Calendar tokens");
      await updateDoc(userRef, {
        googleCalendar: {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiry: tokens.expiry_date,
          connected: true,
          connectedAt: new Date().toISOString(),
        },
      });
    } else {
      console.log("Creating new user document with Google Calendar tokens");
      await setDoc(userRef, {
        googleCalendar: {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiry: tokens.expiry_date,
          connected: true,
          connectedAt: new Date().toISOString(),
        },
      });
    }

    // Test fetching events from Google Calendar
    try {
      console.log("Fetching sample events from Google Calendar");
      const calendar = google.calendar({ version: "v3", auth: oauth2Client });
      const eventsRes = await calendar.events.list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: "startTime",
      });

      const events = eventsRes.data.items;
      console.log(`Successfully fetched ${events?.length || 0} events`);

      // Redirect to the calendar page after successful data retrieval
      console.log("Redirecting to calendar page with success parameter");
      return NextResponse.redirect(
        new URL("/calendar?google_connected=true", request.url)
      );
    } catch (calendarError) {
      console.error("Google Calendar API error:", calendarError);
      // Redirect to calendar page with error parameter
      return NextResponse.redirect(
        new URL("/calendar?error=fetch_failed", request.url)
      );
    }
  } catch (error) {
    console.error("Google OAuth token exchange error:", error);
    // Redirect to calendar page with auth error parameter
    return NextResponse.redirect(
      new URL("/calendar?error=auth_failed", request.url)
    );
  }
}
