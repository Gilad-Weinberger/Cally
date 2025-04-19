import { google } from "googleapis";
import { NextResponse } from "next/server";

const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

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
  console.log("Google Calendar auth route executed");

  try {
    // Get the user ID from the request cookies or query parameters
    const url = new URL(request.url);
    let userId = url.searchParams.get("userId");

    if (!userId) {
      // If no userId in query, redirect to signin
      console.log("No user ID provided, redirecting to sign in");
      return NextResponse.redirect(
        new URL("/auth/signin?error=auth_required", request.url)
      );
    }

    console.log("User ID for Google Calendar auth:", userId);

    // Create a state parameter with the user ID so we can retrieve it in the callback
    const stateObj = { userId };
    const state = Buffer.from(JSON.stringify(stateObj)).toString("base64");

    const oauth2Client = getOauth2Client();

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
      prompt: "consent",
      include_granted_scopes: true,
      state: state, // Pass the state parameter with encoded user ID
    });

    console.log(
      "Generated auth URL, redirecting user to Google consent screen"
    );
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Google OAuth initialization error:", error);
    return NextResponse.json(
      {
        error:
          "Failed to initialize Google OAuth. Please check server configuration.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
