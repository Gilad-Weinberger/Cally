import { google } from "googleapis";

// Reusing the same OAuth client cache logic as in auth/route.js
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

  cachedOauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );
  return cachedOauth2Client;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return new Response(
        JSON.stringify({ error: "Authorization code not found" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const oauth2Client = getOauth2Client();

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Store tokens in session/cookie or database here if needed
    // Example: You might want to store these tokens in Firebase for the current user

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    try {
      const eventsRes = await calendar.events.list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: "startTime",
      });

      const events = eventsRes.data.items;

      // Here you can store the events in your database if needed

      // Redirect to the calendar page after successful data retrieval
      return Response.redirect(new URL("/calendar", req.url), 302);
    } catch (calendarError) {
      console.error("Google Calendar API error:", calendarError);
      // Redirect to calendar page with error parameter
      return Response.redirect(
        new URL("/calendar?error=fetch_failed", req.url),
        302
      );
    }
  } catch (error) {
    console.error("Google OAuth token exchange error:", error);
    // Redirect to calendar page with auth error parameter
    return Response.redirect(
      new URL("/calendar?error=auth_failed", req.url),
      302
    );
  }
}
