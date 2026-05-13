// WHY: We need a web framework to create HTTP endpoints for our auth service.
// WHAT: Importing the Express library which provides routing, middleware, and HTTP server functionality.
import express from 'express'

// WHY: We need to load environment variables (like PORT, MONGO_URI, JWT_SEC) from a .env file securely.
// WHAT: Importing the dotenv package that reads .env files and injects variables into process.env.
import dotenv from 'dotenv'

// WHY: We need a function to establish the MongoDB database connection when the server starts.
// WHAT: Importing the connectDB function from our database configuration file.
import connectDB from './config/db.js';

// WHY: We need to register all authentication-related API routes under a single router.
// WHAT: Importing the auth route handler that contains login, role, and profile endpoints.
import authRoute from './routes/auth.js';

// WHY: The frontend runs on a different port/domain, so we need to allow cross-origin requests.
// WHAT: Importing the CORS (Cross-Origin Resource Sharing) middleware to enable cross-origin HTTP requests.
import cors from 'cors';

// WHY: Environment variables must be loaded before any code tries to access them (e.g., PORT, DB URI).
// WHAT: Calling dotenv.config() to read the .env file and populate process.env with the key-value pairs.
dotenv.config()

// WHY: We need an Express application instance to configure middleware and define routes.
// WHAT: Creating a new Express app object which will be our main server application.
const app = express()

// WHY: Without CORS middleware, browsers will block requests from the frontend to this backend API.
// WHAT: Enabling CORS for all origins so any frontend domain can make requests to this server.
app.use(cors());

// WHY: Our API receives JSON payloads (e.g., login credentials, role data) in request bodies.
// WHAT: Adding Express built-in JSON parser middleware so req.body is automatically populated with parsed JSON.
app.use(express.json());

// WHY: All auth endpoints need a common URL prefix for organized API routing.
// WHAT: Mounting the auth router at "/api/auth" so all auth routes are accessible under this base path.
app.use("/api/auth", authRoute);

// WHY: We need a configurable port so the service can run on different ports in different environments.
// WHAT: Reading the PORT from environment variables, falling back to 5000 if not set.
const PORT = process.env.PORT || 5000;

// WHY: The server needs to start listening for incoming HTTP requests on the specified port.
// WHAT: Starting the Express HTTP server on the configured PORT and logging a confirmation message.
app.listen(PORT, () => {
    // WHY: We want to confirm in the console that the server has started successfully.
    // WHAT: Logging the port number to the console so the developer knows the server is running.
    console.log(`Auth service is running on port ${PORT}`);

    // WHY: The database connection should be established once the server is up and listening.
    // WHAT: Calling connectDB() to initiate the MongoDB connection using Mongoose.
    connectDB()
});
