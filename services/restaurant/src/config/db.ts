// WHY: We need an ODM (Object Data Modeling) library to interact with MongoDB from Node.js.
// WHAT: Importing Mongoose which provides schema-based modeling, validation, and query building for MongoDB.
import mongoose from "mongoose";

// WHY: We need an async function to handle the database connection because connecting to a remote DB is asynchronous.
// WHAT: Defining an async arrow function called connectDB that will establish the MongoDB connection.
const connectDB = async () => {

    // WHY: Database connections can fail (wrong URI, network issues), so we wrap it in try-catch for error handling.
    // WHAT: Starting a try block to attempt the MongoDB connection and catch any errors that occur.
    try {

        // WHY: We need to connect to the MongoDB server using the connection string stored in environment variables.
        // WHAT: Calling mongoose.connect() with the MONGO_URI env variable (cast to string) and specifying the database name "OneClick".
        await mongoose.connect(process.env.MONGO_URI as string, {
            // WHY: We want all collections to be stored in a specific database called "OneClick" for organization.
            // WHAT: Setting the dbName option to "OneClick" so Mongoose uses this database instead of the default.
            dbName: "OneClick",
        });

        // WHY: We want confirmation in the console that the database connection was successful.
        // WHAT: Logging a success message to the console indicating the database is connected.
        console.log(`Connected to the database`);

    }
    // WHY: If the connection fails, we need to log the error instead of crashing the server silently.
    // WHAT: Catching any error thrown during the connection attempt and storing it in the error variable.
    catch (error) {
        // WHY: Developers need to see the exact error to diagnose connection issues (wrong credentials, network, etc.).
        // WHAT: Logging the error message and details to the console for debugging purposes.
        console.error("Database connection error:", error);

    }
};

// WHY: Other files (like index.ts) need to import and call this function to start the DB connection.
// WHAT: Exporting connectDB as the default export so it can be imported and used in the main server file.
export default connectDB;