// WHY: We need Express type definitions to properly type the wrapper function and the handler it wraps.
// WHAT: Importing Request, Response, RequestHandler, and NextFunction types from Express for TypeScript type safety.
import { Request, Response, RequestHandler, NextFunction } from "express"

// WHY: Writing try-catch in every controller is repetitive; this higher-order function handles errors in one place.
// WHAT: Defining a TryCatch function that takes a request handler and returns a new handler with automatic error catching.
const TryCatch = (handler: RequestHandler): RequestHandler => {
    // WHY: We need to return a new function that has the same signature as an Express middleware/handler.
    // WHAT: Returning an async function that accepts req, res, and next — matching Express's RequestHandler type.
    return async (req: Request, res: Response, next: NextFunction) => {
        // WHY: We wrap the original handler in try-catch so any thrown error is caught instead of crashing the server.
        // WHAT: Starting a try block to execute the original handler and catch any errors it might throw.
        try {
            // WHY: We need to execute the original controller function and wait for it to complete (since it's async).
            // WHAT: Awaiting the handler function call, passing through the original req, res, and next arguments.
            await handler(req, res, next);

            // WHY: If the handler throws any error (database error, validation error, etc.), we catch it here.
            // WHAT: Catching the error thrown by the handler and storing it in the err variable (typed as any for flexibility).
        } catch (err: any) {
            // WHY: The client needs to receive an error response instead of the request hanging or the server crashing.
            // WHAT: Sending a 500 Internal Server Error response with the error's message as the JSON payload.
            res.status(500).json({
                // WHY: Including the actual error message helps developers debug issues during development.
                // WHAT: Extracting the message property from the caught error and including it in the response.
                message: err.message,
            });
        };
    };
};

// WHY: Controllers need to import this wrapper function to use it for automatic error handling.
// WHAT: Exporting TryCatch as the default export so it can be imported and used to wrap any controller function.
export default TryCatch;
