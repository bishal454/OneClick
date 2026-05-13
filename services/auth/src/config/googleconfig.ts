// WHY: We need Google's official API client library to handle OAuth2 authentication flow on the server side.
// WHAT: Importing the google object from googleapis which gives us access to OAuth2, Google APIs, and authentication utilities.
import { google } from "googleapis";

// WHY: We need to load the Google OAuth credentials (client ID and secret) from environment variables.
// WHAT: Importing dotenv to read the .env file and make GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET available via process.env.
import dotenv from "dotenv";

// WHY: Environment variables must be loaded before we try to access GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.
// WHAT: Calling dotenv.config() to parse the .env file and populate process.env with the stored credentials.
dotenv.config();

// WHY: We need the Google Client ID to identify our application when making OAuth2 requests to Google.
// WHAT: Reading the GOOGLE_CLIENT_ID from environment variables and storing it in a constant for use in the OAuth2 client.
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

// WHY: We need the Google Client Secret to securely exchange authorization codes for access tokens.
// WHAT: Reading the GOOGLE_CLIENT_SECRET from environment variables and storing it in a constant for use in the OAuth2 client.
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// WHY: We need an OAuth2 client instance to exchange auth codes for tokens and fetch user info from Google.
// WHAT: Creating a new Google OAuth2 client with our client ID, client secret, and "postmessage" as the redirect URI (used for popup-based login flows).
export const oauth2client = new google.auth.OAuth2(
    // WHY: Google needs to know which application is requesting authentication.
    // WHAT: Passing the client ID as the first parameter to identify our app.
    GOOGLE_CLIENT_ID,

    // WHY: Google needs the secret to verify the token exchange request is legitimate and from our app.
    // WHAT: Passing the client secret as the second parameter for secure server-side token exchange.
    GOOGLE_CLIENT_SECRET,

    // WHY: When using Google Login with popup flow (like @react-oauth/google), the redirect URI must be "postmessage".
    // WHAT: Setting "postmessage" as the redirect URI which tells Google to send the auth code via the browser's postMessage API.
    "postmessage"
);
