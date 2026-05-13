// WHY: We need useState to manage the local loading state while the Google login request is in progress.
// WHAT: Importing the useState hook from React to create a boolean loading state for the login button.
import { useState } from "react";

// WHY: We need useNavigate to programmatically redirect the user to the home page after a successful login.
// WHAT: Importing the useNavigate hook from react-router-dom which returns a function for navigating to different routes.
import { useNavigate } from "react-router-dom";

// WHY: We need the auth service base URL to construct the API endpoint for the login request.
// WHAT: Importing the authService constant (e.g., "http://localhost:5000") from main.tsx for API calls.
import { authService } from "../main";

// WHY: We need axios to make the POST request to the backend login endpoint with the Google auth code.
// WHAT: Importing the axios HTTP client library for making API requests to the auth service.
import axios from "axios";

// WHY: We need toast notifications to display success or error messages to the user after login attempts.
// WHAT: Importing the toast function from react-hot-toast to show pop-up notification messages.
import { toast } from "react-hot-toast";

// WHY: We need the useGoogleLogin hook to initiate the Google OAuth login flow from a custom button.
// WHAT: Importing useGoogleLogin from @react-oauth/google which returns a function to trigger the Google OAuth popup.
import { useGoogleLogin } from '@react-oauth/google';

// WHY: We need the Google icon to display inside the login button for brand recognition.
// WHAT: Importing the FcGoogle icon component (full-color Google logo) from the react-icons library.
import { FcGoogle } from 'react-icons/fc'

// WHY: We need the global context setters to update the user data and auth status after a successful login.
// WHAT: Importing the UseAppData hook to access setUser and setIsAuth functions from the global context.
import { UseAppData } from "../context/AppContext";

// WHY: We need a Login page component that provides the Google OAuth login UI for unauthenticated users.
// WHAT: Defining the Login functional component that renders the login form with the Google sign-in button.
const Login = () => {

    // WHY: We need a loading state to disable the login button and show "Signing in..." while the request is processing.
    // WHAT: Initializing a loading boolean state as false using useState; it becomes true during the API call.
    const [loading, setLoading] = useState(false);

    // WHY: We need the navigate function to redirect users to the home page after they successfully log in.
    // WHAT: Calling useNavigate() to get the navigation function from react-router-dom.
    const navigate = useNavigate();

    // WHY: We need the setUser and setIsAuth functions to update the global auth state after login.
    // WHAT: Destructuring setUser and setIsAuth from the global context using the UseAppData hook.
    const { setUser, setIsAuth } = UseAppData();

    // WHY: We need an async callback function to handle the response from Google's OAuth popup.
    // WHAT: Defining the responseGoogle async function that receives the Google auth result and sends it to our backend.
    const responseGoogle = async (authResult: any) => {
        // WHY: We want to show a loading state on the button while the backend processes the login request.
        // WHAT: Setting loading to true to disable the button and display "Signing in..." text.
        setLoading(true)

        // WHY: The API call to our backend can fail, so we use try-catch for error handling.
        // WHAT: Starting a try block to attempt the login API call and catch any errors.
        try {
            // WHY: We need to send the Google authorization code to our backend to exchange it for user tokens.
            // WHAT: Making a POST request to /api/auth/login with the Google auth code in the request body.
            const result = await axios.post(`${authService}/api/auth/login`, {
                // WHY: The backend needs the authorization code from Google to exchange it for access tokens.
                // WHAT: Extracting the "code" property from the Google auth result object.
                code: authResult["code"],
            });

            // WHY: We need to store the JWT token in localStorage so it persists across page refreshes and browser sessions.
            // WHAT: Saving the JWT token returned by the backend to localStorage under the key "token".
            localStorage.setItem("token", result.data.token)

            // WHY: We want to show the user a success message confirming they've logged in successfully.
            // WHAT: Displaying a success toast notification with the message from the backend (e.g., "Logged Successfully").
            toast.success(result.data.message)

            // WHY: The login process is complete, so we should stop showing the loading state on the button.
            // WHAT: Setting loading to false to re-enable the button and show "Continue with Google" text.
            setLoading(false)

            // WHY: We need to update the global state with the user data so the entire app knows who is logged in.
            // WHAT: Setting the user state in the global context with the user object returned by the backend.
            setUser(result.data.user);

            // WHY: We need to mark the user as authenticated so protected routes become accessible.
            // WHAT: Setting isAuth to true in the global context to indicate the user is now logged in.
            setIsAuth(true);

            // WHY: After successful login, the user should be taken to the home page instead of staying on the login page.
            // WHAT: Navigating to the root "/" path to redirect the user to the home page.
            navigate("/");

        }
        // WHY: If the API call fails (network error, server error), we need to handle it gracefully.
        // WHAT: Catching any error thrown during the login process.
        catch (error) {
            // WHY: We log the error to the console so developers can debug login issues.
            // WHAT: Printing the error object to the console for debugging purposes.
            console.log(error);

            // WHY: The user needs to know that the login attempt failed so they can try again.
            // WHAT: Displaying an error toast notification with a generic error message.
            toast.error("Problem while login")

            // WHY: Even if login fails, we need to re-enable the button so the user can try again.
            // WHAT: Setting loading to false to stop the loading state and restore the button.
            setLoading(false)
        }
    };

    // WHY: We need to configure the Google login behavior (flow type, success/error callbacks) using the hook.
    // WHAT: Calling useGoogleLogin with configuration options and storing the returned trigger function.
    const googleLogin = useGoogleLogin({
        // WHY: When Google login succeeds, we need to handle the response by sending the code to our backend.
        // WHAT: Setting responseGoogle as the callback for successful Google authentication.
        onSuccess: responseGoogle,

        // WHY: When Google login fails, we want to handle the error using the same function for consistent behavior.
        // WHAT: Setting responseGoogle as the callback for Google authentication errors.
        onError: responseGoogle,

        // WHY: We use "auth-code" flow because our backend needs the authorization code to exchange for tokens server-side.
        // WHAT: Setting the flow to "auth-code" which returns an authorization code instead of tokens directly.
        flow: "auth-code"
    });



    // WHY: The component must return JSX that defines the visual layout of the login page.
    // WHAT: Returning the JSX structure for the centered login form with Google sign-in button.
    return (
        // WHY: The login form should be centered both vertically and horizontally on a white background.
        // WHAT: Rendering a full-height flex container with centered alignment for the login card.
        <div className="flex min-h-screen items-center justify-center bg-white px-4">

            {/* WHY: The login card needs a max width and vertical spacing between its child elements. */}
            {/* WHAT: Rendering a container div with max width of sm and vertical spacing for the login form elements. */}
            <div className="w-full max-w-sm space-y-6 ">
                {/* WHY: The app name serves as the brand header on the login page to establish identity. */}
                {/* WHAT: Rendering the "OneClick" brand name as a centered h1 heading in the app's primary color. */}
                <h1 className="text-center text-3xl font-bold text-[#E23774]" >
                    OneClick
                </h1>

                {/* WHY: A subtitle helps users understand what action they need to take on this page. */}
                {/* WHAT: Rendering a centered paragraph with instructions to "Login or sign up to continue". */}
                <p className="text-center text-sm  text-gray-500"    >
                    Login or sign up to continue
                </p>

                {/* WHY: Users need a clickable button to initiate the Google OAuth login flow. */}
                {/* WHAT: Rendering a styled button that calls googleLogin on click and shows loading state when processing. */}
                <button onClick={googleLogin} disabled={loading} className="flex w-full items-center 
                justify-center gap-3 border-xl border border-gray-300 bg-white px-4 py-3">

                    {/* WHY: The Google logo icon makes the button instantly recognizable as a Google sign-in option. */}
                    {/* WHAT: Rendering the full-color Google logo icon (FcGoogle) at size 20px. */}
                    <FcGoogle size={20} />
                    {/* WHY: The button text should change based on loading state to give users feedback. */}
                    {/* WHAT: Conditionally displaying "Signing in..." during loading or "Continue with Google" when idle. */}
                    {
                        loading ? 'Signing in...' : 'Continue with Google'
                    }
                </button>

                {/* WHY: Legal compliance requires informing users about Terms of Service and Privacy Policy. */}
                {/* WHAT: Rendering a small text paragraph with links to Terms of Services and Privacy Policy. */}
                < p className="text-center text-xs text-grey-400">
                    By continuning , you agree with our {" "}
                    {/* WHY: The Terms of Service text should be highlighted in the brand color to look like a link. */}
                    {/* WHAT: Rendering "Terms of Services" in the app's primary pink/red color. */}
                    <span className="text-[#E23774]">Terms of Services</span>& {" "}
                    {/* WHY: The Privacy Policy text should also be highlighted to look like a clickable link. */}
                    {/* WHAT: Rendering "Privacy Policy" in the app's primary pink/red color. */}
                    <span className="text-[#E23774]">Privacy Policy</span>
                </p>

            </div>
        </div >
    );
};


// WHY: The App.tsx route configuration needs to import this component to render it at the "/login" path.
// WHAT: Exporting the Login component as the default export for use in the route definitions.
export default Login