
// WHY: We need the User model to look up and create user records in the MongoDB database.
// WHAT: Importing the User Mongoose model from the model directory to perform database CRUD operations.
import User from "../model/User.js"

// WHY: We need to create and verify JSON Web Tokens for user authentication and session management.
// WHAT: Importing the jsonwebtoken library which provides sign() and verify() methods for JWT operations.
import jwt from "jsonwebtoken"

// WHY: We want a reusable error handling wrapper so we don't repeat try-catch blocks in every controller.
// WHAT: Importing the TryCatch higher-order function that wraps async handlers and catches errors automatically.
import TryCatch from "../middlewares/TryCatch.js";

// WHY: We need the custom request type that includes the authenticated user object attached by the isAuth middleware.
// WHAT: Importing the AuthenticatedRequest interface which extends Express Request with an optional user property.
import { AuthenticatedRequest } from "../middlewares/isAuth.js";

// WHY: We need the Google OAuth2 client to exchange the authorization code from the frontend for access tokens.
// WHAT: Importing the pre-configured OAuth2 client instance that has our Google client ID and secret set up.
import { oauth2client } from "../config/googleconfig.js";

// WHY: We need an HTTP client to fetch user profile information from Google's userinfo API after authentication.
// WHAT: Importing axios, a promise-based HTTP client, to make GET requests to Google's API endpoints.
import axios from "axios";


// WHY: We need a login endpoint that handles Google OAuth authentication and creates/finds users in our database.
// WHAT: Exporting the loginUser controller function wrapped in TryCatch for automatic error handling.
export const loginUser = TryCatch(async (req, res) => {

    // WHY: The frontend sends the Google authorization code in the request body after the user signs in with Google.
    // WHAT: Destructuring the 'code' property from the request body to get the Google auth code.
    const { code } = req.body;

    // WHY: Without an authorization code, we cannot exchange it for tokens and authenticate the user.
    // WHAT: Checking if the code is missing and returning a 400 Bad Request error if it is.
    if (!code) {
        return res.status(400).json({
            // WHY: The client needs a clear error message to understand why the request failed.
            // WHAT: Sending a descriptive error message indicating that the authorization code is required.
            message: "Authorization code is required"
        })
    }

    // WHY: We need to exchange the one-time authorization code for access tokens and refresh tokens from Google.
    // WHAT: Calling oauth2client.getToken() with the auth code to get Google access/refresh tokens.
    const googleRes = await oauth2client.getToken(code);

    // WHY: The OAuth2 client needs the tokens set as credentials to make authenticated API calls to Google.
    // WHAT: Setting the received tokens (access_token, refresh_token) as the active credentials on the OAuth2 client.
    oauth2client.setCredentials(googleRes.tokens);

    // WHY: We need the user's Google profile (name, email, picture) to create or identify them in our database.
    // WHAT: Making a GET request to Google's userinfo API using the access token to fetch the user's profile data.
    const userRes = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );

    // WHY: We need to extract specific fields from the Google profile response to store in our database.
    // WHAT: Destructuring email, name, and picture from the Google API response data.
    const { email, name, picture } = userRes.data;

    // WHY: We need to check if this Google user already exists in our database to avoid creating duplicate accounts.
    // WHAT: Querying the User collection to find a document with a matching email address.
    let user = await User.findOne({ email })

    // WHY: If no user exists with this email, we need to create a new user account in our database.
    // WHAT: Checking if user is null/undefined, and if so, creating a new User document with the Google profile data.
    if (!user) {
        user = await User.create({
            // WHY: We store the user's email from Google as the unique identifier for their account.
            // WHAT: Setting the email field with the value received from Google's userinfo API.
            email,
            // WHY: We store the user's display name from Google for personalization and display purposes.
            // WHAT: Setting the name field with the value received from Google's userinfo API.
            name,
            // WHY: We store the user's Google profile picture URL so we can display their avatar in the app.
            // WHAT: Setting the image field with the picture URL received from Google's userinfo API.
            image: picture
        });
    }

    // WHY: We need to generate a JWT token so the user can make authenticated requests without re-logging in.
    // WHAT: Creating a signed JWT containing the user object, using the JWT_SEC secret, with a 15-day expiration.
    const token = jwt.sign({ user }, process.env.JWT_SEC as string, {
        // WHY: Tokens should expire after a reasonable period for security; 15 days balances convenience and safety.
        // WHAT: Setting the token expiration time to 15 days.
        expiresIn: "15d",
    });

    // WHY: The frontend needs the token for future authenticated requests and the user data for UI display.
    // WHAT: Sending a 200 OK response with a success message, the JWT token, and the user object.
    res.status(200).json({
        // WHY: The frontend displays this message as a toast notification to confirm successful login.
        // WHAT: Including a success message string in the response.
        message: "Logged Successfully",
        // WHY: The frontend needs the JWT token to store in localStorage and send with subsequent API requests.
        // WHAT: Including the generated JWT token in the response.
        token,
        // WHY: The frontend needs the user data immediately to update the UI without making another API call.
        // WHAT: Including the full user object in the response.
        user,
    });

});


// WHY: We need a predefined list of valid roles to validate against, preventing arbitrary role assignments.
// WHAT: Defining a readonly array of allowed role values that users can select from.
const allowedRoles = ["customer", "rider", "seller"] as const;

// WHY: We need a TypeScript type derived from the allowed roles array to enforce type safety on role values.
// WHAT: Creating a union type "customer" | "rider" | "seller" from the allowedRoles array for type checking.
type Role = (typeof allowedRoles)[number];

// WHY: After login, users without a role need an endpoint to select and save their role (customer/rider/seller).
// WHAT: Exporting the addUserRole controller that updates a user's role in the database, wrapped in TryCatch.
export const addUserRole = TryCatch(async (req: AuthenticatedRequest, res) => {

    // WHY: We need to verify the user is authenticated before allowing role updates (the isAuth middleware should have set req.user).
    // WHAT: Checking if req.user exists and has a valid _id; if not, return 401 Unauthorized.
    if (!req.user?._id) {

        return res.status(401).json({
            // WHY: The client needs to know that authentication is required to access this endpoint.
            // WHAT: Sending an "Unauthorized" error message in the response.
            message: "Unauthorized",
        });

    }

    // WHY: We need to extract the role value from the request body and ensure it's typed correctly.
    // WHAT: Destructuring the role property from req.body and casting it to the Role type for type safety.
    const { role } = req.body as { role: Role };

    // WHY: We must validate the submitted role against allowed values to prevent invalid or malicious role assignments.
    // WHAT: Checking if the provided role exists in the allowedRoles array; if not, return a 400 Bad Request.
    if (!allowedRoles.includes(role)) {
        return res.status(400).json({
            // WHY: The client needs a clear message explaining why their role selection was rejected.
            // WHAT: Sending an "Invalid role" error message when the submitted role is not in the allowed list.
            message: "Invalid role",
        });
    }

    // WHY: We need to update the user's role in the database and get the updated user document back.
    // WHAT: Using findByIdAndUpdate to set the role field on the user document, with { new: true } to return the updated version.
    const user = await User.findByIdAndUpdate(
        // WHY: We need to identify which user to update using their unique MongoDB _id from the auth token.
        // WHAT: Passing the authenticated user's _id as the filter to find the correct user document.
        req.user?._id,
        // WHY: We want to set the role field to the new value selected by the user.
        // WHAT: Passing an update object that sets the role field to the provided role value.
        { role },
        // WHY: By default, findByIdAndUpdate returns the old document; we need the updated one to send back.
        // WHAT: Setting { new: true } so Mongoose returns the document after the update is applied.
        { new: true }
    );

    // WHY: If no user document was found with that _id, the update failed and we should inform the client.
    // WHAT: Checking if the returned user is null and responding with 404 Not Found if so.
    if (!user) {
        return res.status(404).json({
            // WHY: The client needs to know the specific reason the request failed.
            // WHAT: Sending a "User not found" error message when the database query returns no matching user.
            message: "User not found"
        });
    };

    // WHY: After updating the role, we need a new JWT that includes the updated user data (with the new role).
    // WHAT: Signing a new JWT token with the updated user object so subsequent requests reflect the new role.
    const token = jwt.sign({ user }, process.env.JWT_SEC as string, { expiresIn: "15d", })

    // WHY: The frontend needs the updated user object and a fresh token to update its state and localStorage.
    // WHAT: Sending a JSON response containing the updated user data and the new JWT token.
    res.json({ user, token });

})


// WHY: We need an endpoint for the frontend to fetch the currently authenticated user's profile data.
// WHAT: Exporting the myprofile controller that returns the user object attached to the request by the isAuth middleware.
export const myprofile = TryCatch(async (req: AuthenticatedRequest, res) => {
    // WHY: The isAuth middleware has already decoded the JWT and attached the user to req.user for us.
    // WHAT: Extracting the user object from the authenticated request.
    const user = req.user

    // WHY: The frontend needs the user data to display profile information and determine the user's role.
    // WHAT: Sending the user object as a JSON response to the client.
    res.json(user)
});
