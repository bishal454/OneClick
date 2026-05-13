// WHY: We need Express type definitions to properly type the middleware function parameters (req, res, next).
// WHAT: Importing Request, Response, and NextFunction types from Express for TypeScript type safety.
import { Request, Response, NextFunction } from "express";

// WHY: We need the jwt library to verify the token from the Authorization header and decode user data from it.
// WHAT: Importing the jsonwebtoken library and the JwtPayload type for token verification and type casting.
import jwt, { JwtPayload } from "jsonwebtoken";

// WHY: We need the IUser interface to properly type the user property that we attach to the request object.
// WHAT: Importing the IUser interface from the User model which defines the shape of a user document.
import { IUser } from "../model/User.js";

// WHY: Express's default Request type doesn't have a 'user' property, so we need to extend it for authenticated routes.
// WHAT: Defining and exporting a custom interface that extends Express Request with an optional user property of type IUser.
export interface AuthenticatedRequest extends Request {
    // WHY: After verifying the JWT, we attach the decoded user data to the request so controllers can access it.
    // WHAT: Declaring an optional 'user' property that can hold an IUser object or null.
    user?: IUser | null;
}

// WHY: We need a middleware function that runs before protected routes to verify the user is authenticated.
// WHAT: Exporting the isAuth async middleware function that checks for a valid JWT token in the Authorization header.
export const isAuth = async (
    // WHY: We use AuthenticatedRequest instead of Request so TypeScript knows about the 'user' property we'll attach.
    // WHAT: Typing the request parameter as AuthenticatedRequest to allow setting req.user later.
    req: AuthenticatedRequest,
    // WHY: We need the response object to send error responses (401, 500) if authentication fails.
    // WHAT: Typing the response parameter as Express Response for sending JSON error messages.
    res: Response,
    // WHY: We need the next function to pass control to the next middleware/controller if authentication succeeds.
    // WHAT: Typing the next parameter as NextFunction which, when called, moves to the next handler in the chain.
    next: NextFunction
    // WHY: The function returns a Promise<void> because it's async and doesn't return a value directly.
    // WHAT: Declaring the return type as Promise<void> since the middleware either sends a response or calls next().
): Promise<void> => {
    // WHY: Token verification can throw errors (expired, malformed), so we wrap everything in try-catch.
    // WHAT: Starting a try block to handle any errors during the authentication process.
    try {

        // WHY: The JWT token is sent by the frontend in the Authorization header as "Bearer <token>".
        // WHAT: Extracting the Authorization header value from the incoming request.
        const authHeader = req.headers.authorization;

        // WHY: If there's no Authorization header or it doesn't start with "Bearer ", the request is unauthenticated.
        // WHAT: Checking if the auth header is missing or doesn't follow the "Bearer <token>" format.
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            // WHY: We need to inform the client that they must provide valid authentication credentials.
            // WHAT: Sending a 401 Unauthorized response with a descriptive error message.
            res.status(401).json({
                message: "Please Login - No auth header",
            });
            // WHY: After sending the error response, we must stop execution to prevent further processing.
            // WHAT: Returning void to exit the middleware function without calling next().
            return;
        }

        // WHY: We need to extract just the token string from the "Bearer <token>" format by splitting on the space.
        // WHAT: Splitting the Authorization header by space and taking the second element (the actual JWT token).
        const token = authHeader.split(" ")[1];

        // WHY: Even after splitting, the token could be empty or undefined if the header format was "Bearer " with no token.
        // WHAT: Checking if the extracted token is falsy (empty, undefined, null).
        if (!token) {
            // WHY: We need to tell the client that a token was expected but not found in the header.
            // WHAT: Sending a 401 Unauthorized response indicating the token is missing.
            res.status(401).json({
                message: "please login  - token  missing ."
            })
            // WHY: After sending the error, we must stop the middleware chain to prevent unauthorized access.
            // WHAT: Returning void to exit the function without calling next().
            return;
        }

        // WHY: We need to verify the JWT token is valid (not expired, not tampered with) using our secret key.
        // WHAT: Calling jwt.verify() with the token and JWT_SEC secret, casting the result to JwtPayload for type access.
        const decodeValue = jwt.verify(token, process.env.JWT_SEC as string) as JwtPayload

        // WHY: Even if verification succeeds, we need to ensure the decoded payload contains a user object.
        // WHAT: Checking if decodeValue is falsy or if it doesn't contain a user property.
        if (!decodeValue || !decodeValue.user) {
            // WHY: A token without user data is invalid for our application, even if it was properly signed.
            // WHAT: Sending a 401 Unauthorized response indicating the token is invalid.
            res.status(401).json({
                message: "Invalid token."
            })
            // WHY: We must stop execution after sending the error response to prevent unauthorized access.
            // WHAT: Returning void to exit the middleware without calling next().
            return;
        }

        // WHY: Controllers downstream need access to the authenticated user's data to perform user-specific operations.
        // WHAT: Attaching the decoded user object from the JWT payload to the request object.
        req.user = decodeValue.user;

        // WHY: Authentication passed, so we need to hand off control to the next middleware or route handler.
        // WHAT: Calling next() to move to the next function in the Express middleware chain.
        next();

    }
    // WHY: If jwt.verify() throws (expired token, invalid signature), we need to catch and handle it gracefully.
    // WHAT: Catching any error thrown during the token verification process.
    catch (error) {
        // WHY: The client needs to know that their token is invalid and they should re-authenticate.
        // WHAT: Sending a 500 Internal Server Error response with a message indicating a JWT-related error.
        res.status(500).json({
            message: "Please login -jwt error."
        })
    }
}
