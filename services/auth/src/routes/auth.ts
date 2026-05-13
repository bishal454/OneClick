// WHY: We need Express's Router to create modular, mountable route handlers for the auth endpoints.
// WHAT: Importing express to access the Router() factory method for creating route handlers.
import express from "express";

// WHY: We need the loginUser controller function to handle the POST /login endpoint logic.
// WHAT: Importing the loginUser controller from the auth controllers file.
import { loginUser } from "../controllers/auth.js";

// WHY: We need the isAuth middleware to protect routes that require the user to be authenticated.
// WHAT: Importing the isAuth middleware that verifies JWT tokens from the Authorization header.
import { isAuth } from "../middlewares/isAuth.js";

// WHY: We need the addUserRole controller to handle the PUT /add/role endpoint where users select their role.
// WHAT: Importing the addUserRole controller from the auth controllers file.
import { addUserRole } from "../controllers/auth.js";

// WHY: We need the myprofile controller to handle the GET /me endpoint that returns the current user's data.
// WHAT: Importing the myprofile controller from the auth controllers file.
import { myprofile } from "../controllers/auth.js";

// WHY: We need a router instance to define and group all authentication-related routes together.
// WHAT: Creating a new Express Router instance that will hold all the /api/auth/* route definitions.
const router = express.Router();

// WHY: Users need an endpoint to authenticate using their Google authorization code.
// WHAT: Defining a POST route at "/login" that maps to the loginUser controller for handling Google OAuth login.
router.post("/login", loginUser);

// WHY: Authenticated users who haven't selected a role yet need an endpoint to set their role (customer/rider/seller).
// WHAT: Defining a PUT route at "/add/role" protected by isAuth middleware, mapped to the addUserRole controller.
router.put("/add/role", isAuth, addUserRole)

// WHY: The frontend needs an endpoint to fetch the current user's profile data on page load/refresh.
// WHAT: Defining a GET route at "/me" protected by isAuth middleware, mapped to the myprofile controller.
router.get("/me", isAuth, myprofile);

// WHY: The main index.ts file needs to import this router to mount it at the "/api/auth" base path.
// WHAT: Exporting the router as the default export so it can be used with app.use() in the main server file.
export default router;
