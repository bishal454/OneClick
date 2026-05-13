// WHY: We need axios to make HTTP requests to the auth service backend API for fetching user data.
// WHAT: Importing the axios HTTP client library for making GET/POST/PUT requests to the backend.
import axios from "axios";

// WHY: We need React hooks and types to create a context provider that manages and shares global state.
// WHAT: Importing createContext (to create the context), useContext (to consume it), useEffect (for side effects), useState (for state), and ReactNode type (for children prop).
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// WHY: We need the auth service base URL to construct API endpoint URLs for fetching user data.
// WHAT: Importing the authService constant which holds the backend server URL (e.g., "http://localhost:5000").
import { authService } from "../main";

// WHY: We need TypeScript type definitions for the context value, user data, and location data.
// WHAT: Importing the AppContextType, User, and LocationData interfaces for type safety in state and context.
import type { AppContextType, User, LocationData } from "../types";


// WHY: We need a React Context to share global state (user, auth, location) across all components without prop drilling.
// WHAT: Creating the AppContext with createContext, typed as AppContextType or undefined (undefined when used outside provider).
const AppContext = createContext<AppContextType | undefined>(undefined)


// WHY: We need a TypeScript interface to type the props of AppProvider, specifically the children it wraps.
// WHAT: Defining the AppProviderProps interface with a children prop typed as ReactNode (any valid React child).
interface AppProviderProps {
    // WHY: The provider wraps child components that need access to the global context values.
    // WHAT: Declaring the children prop as ReactNode, which can be any React element, string, number, etc.
    children: ReactNode;
}

// WHY: We need a provider component that initializes and manages all the global state for the application.
// WHAT: Exporting the AppProvider functional component that wraps children with AppContext.Provider.
export const AppProvider = ({ children }: AppProviderProps) => {
    // WHY: We need to store the currently authenticated user's data so all components can access it.
    // WHAT: Initializing user state as null (no user logged in) with the useState hook, typed as User or null.
    const [user, setUser] = useState<User | null>(null);

    // WHY: We need to track whether the user is authenticated to conditionally render protected/public content.
    // WHAT: Initializing isAuth state as false (not authenticated) with useState.
    const [isAuth, setIsAuth] = useState(false);

    // WHY: We need a loading state to prevent rendering protected routes before we've checked if the user is logged in.
    // WHAT: Initializing loading state as true (loading by default) because we need to check for an existing token first.
    const [loading, setLoading] = useState(true);


    // WHY: We need to store the user's geographic location data for location-based features like showing nearby restaurants.
    // WHAT: Initializing location state as null (no location yet) with useState, typed as LocationData or null.
    const [location, setLocation] = useState<LocationData | null>(null);

    // WHY: We need to track if the geolocation is still being fetched to show a loading indicator in the UI.
    // WHAT: Initializing loadingLocation state as false with useState.
    const [loadingLocation, setLoadingLocation] = useState(false);

    // WHY: We need to display the user's city name in the Navbar and show a loading message while fetching.
    // WHAT: Initializing city state with a "Fetching Location..." message that will be replaced once location is determined.
    const [city, setCity] = useState("Fecthing Location..... ");


    // WHY: We need an async function to fetch the current user's profile from the backend when the app loads.
    // WHAT: Defining the fetchUser async function that calls the /api/auth/me endpoint with the stored JWT token.
    async function fetchUser() {
        // WHY: The API call can fail (expired token, network error), so we use try-catch for error handling.
        // WHAT: Starting a try block to attempt fetching the user profile from the backend.
        try {
            // WHY: We need to retrieve the JWT token from localStorage to authenticate the API request.
            // WHAT: Getting the token string from localStorage that was saved during login.
            const token = localStorage.getItem("token");

            // WHY: We need to call the /me endpoint to get the current user's data and verify they're still authenticated.
            // WHAT: Making a GET request to the auth service's /api/auth/me endpoint with the Bearer token in the Authorization header.
            const { data } = await axios.get(`${authService}/api/auth/me`, {
                // WHY: The backend isAuth middleware expects the JWT token in the Authorization header as "Bearer <token>".
                // WHAT: Setting the Authorization header with the Bearer token format for the API request.
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            // WHY: If the API call succeeds, we have a valid user and need to update the state with their data.
            // WHAT: Setting the user state with the user data received from the backend.
            setUser(data);

            // WHY: A successful response means the token is valid and the user is authenticated.
            // WHAT: Setting isAuth to true to indicate the user is logged in.
            setIsAuth(true);
        }
        // WHY: If the API call fails (invalid/expired token), we log the error but don't crash the app.
        // WHAT: Catching any error (401, network error, etc.) and logging it to the console for debugging.
        catch (error) {
            console.log(error);
        }
        // WHY: Whether the request succeeds or fails, we need to stop showing the loading state.
        // WHAT: Setting loading to false in the finally block so it always runs, allowing the app to render.
        finally {
            setLoading(false);
        }
    }


    // WHY: We need to fetch the user's profile when the app first mounts to check if they're already logged in.
    // WHAT: Using useEffect with an empty dependency array to call fetchUser() once when the component first renders.
    useEffect(() => {
        fetchUser();
    }, []);

    // WHY: We need to get the user's geographic location when the app loads for location-based features.
    // WHAT: Using useEffect with an empty dependency array to request geolocation once when the component first mounts.
    useEffect(() => {
        // WHY: Some browsers don't support the Geolocation API, so we need to check before using it.
        // WHAT: Checking if navigator.geolocation is not available and alerting the user to allow location access.
        if (!navigator.geolocation)
            return alert("Please  allow Location to continue");

        // WHY: We want to show a loading indicator while the browser is determining the user's position.
        // WHAT: Setting loadingLocation to true to indicate that geolocation is in progress.
        setLoadingLocation(true);

        // WHY: We need to request the user's current GPS coordinates from the browser's Geolocation API.
        // WHAT: Calling getCurrentPosition which prompts the user for location permission and returns their coordinates.
        navigator.geolocation.getCurrentPosition(async (position) => {
            // WHY: We need the latitude and longitude values from the position object to reverse geocode the address.
            // WHAT: Destructuring latitude and longitude from the position.coords object.
            const { latitude, longitude } = position.coords;

            // WHY: Reverse geocoding can fail (API down, rate limited), so we wrap it in try-catch.
            // WHAT: Starting a try block to attempt converting coordinates into a human-readable address.
            try {
                // WHY: We need to convert GPS coordinates into a human-readable address (city, street, etc.).
                // WHAT: Making a fetch request to OpenStreetMap's Nominatim reverse geocoding API with the user's coordinates.
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                );

                // WHY: The API returns JSON data containing the address components, so we need to parse it.
                // WHAT: Parsing the response body as JSON to extract the address data.
                const data = await res.json();

                // WHY: We need to store the complete location data (coordinates + address) in the state for other components.
                // WHAT: Setting the location state with latitude, longitude, and the formatted address from the API response.
                setLocation({
                    latitude,
                    longitude,
                    formattedAddress: data.display_name || "current Location"
                })

                // WHY: We want to display just the city name in the Navbar's location indicator.
                // WHAT: Setting the city state using the most specific city-level value available from the API response.
                setCity(
                    data.address.city ||
                    data.address.town ||
                    data.address.village ||
                    "Your Location"
                );
                setLoadingLocation(false);
                // WHY: If reverse geocoding fails, we still have the coordinates and should set them with a fallback address.
                // WHAT: Catching the error and setting location with coordinates and a generic fallback address string.
            } catch (error) {
                setLocation({
                    latitude,
                    longitude,
                    formattedAddress: "Current Location",
                });
                // WHY: Even if geocoding fails, we should display something meaningful instead of the "Fetching" message.
                // WHAT: Setting the city to a generic "Your Location" fallback string.
                setCity("failed to fetch location");
                setLoadingLocation(false);
            }

        });

    }, []);


    // WHY: We need to provide all the global state values and setters to the component tree via Context.
    // WHAT: Returning the AppContext.Provider with all state values and setters as the context value, wrapping children.
    return <AppContext.Provider value={{ isAuth, loading, setIsAuth, setLoading, setUser, user, location, loadingLocation, city }}>
        {/* WHY: The children are all the components wrapped by AppProvider that need access to the context. */}
        {/* WHAT: Rendering the children components inside the provider so they can consume the context. */}
        {children}
    </AppContext.Provider>
};


// WHY: We need a custom hook that simplifies consuming the AppContext and throws an error if used outside AppProvider.
// WHAT: Exporting the UseAppData hook function that returns the typed context value or throws if context is undefined.
export const UseAppData = (): AppContextType => {

    // WHY: We need to access the current value of AppContext using React's useContext hook.
    // WHAT: Calling useContext with AppContext to get the context value (or undefined if outside a provider).
    const context = useContext(AppContext)

    // WHY: If context is undefined, it means this hook was called outside of AppProvider, which is a programming error.
    // WHAT: Checking if context is falsy and throwing a descriptive error to help developers debug the issue.
    if (!context) {
        throw new Error("useAppData must be used within AppProvider")
    }

    // WHY: If context exists, we return it so the consuming component can access user, isAuth, location, etc.
    // WHAT: Returning the validated context object typed as AppContextType.
    return context;
};
