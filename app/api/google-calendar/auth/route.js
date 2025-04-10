import { google } from "googleapis";

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

  cachedOauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );
  return cachedOauth2Client;
}

export async function GET(req) {
  try {
    const oauth2Client = getOauth2Client();

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
      prompt: "consent",
    });

    return Response.redirect(authUrl, 302);
  } catch (error) {
    console.error("Google OAuth initialization error:", error);
    return new Response(
      JSON.stringify({
        error:
          "Failed to initialize Google OAuth. Please check server configuration.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
