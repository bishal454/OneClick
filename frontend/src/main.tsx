// WHY: We need React's StrictMode to enable additional development checks and warnings for common mistakes.
// WHAT: Importing the StrictMode component from React which highlights potential problems in the application.
import { StrictMode } from 'react'

// WHY: We need createRoot to initialize the React 18+ rendering system for the application.
// WHAT: Importing createRoot from react-dom/client which is the modern React 18 API for rendering the app to the DOM.
import { createRoot } from 'react-dom/client'

// WHY: We need to import global CSS styles (including TailwindCSS) that apply to the entire application.
// WHAT: Importing the main CSS file which contains the TailwindCSS import and any global styles.
import './index.css'

// WHY: We need the root App component which contains all the routes and layout of the application.
// WHAT: Importing the App component which is the top-level component that holds the entire application structure.
import App from './App.tsx'

// WHY: We need the GoogleOAuthProvider to initialize Google OAuth2 with our client ID for the entire app.
// WHAT: Importing the GoogleOAuthProvider component from the @react-oauth/google library to wrap the app with Google auth context.
import { GoogleOAuthProvider } from '@react-oauth/google';

// WHY: We need the AppProvider to wrap the app with global state (user, auth status, location data).
// WHAT: Importing the AppProvider component from our context which provides app-wide state management via React Context.
import { AppProvider } from './context/AppContext.tsx'


// WHY: We need a base URL for the auth service API so all HTTP requests can reference it consistently.
// WHAT: Exporting the auth service URL as a constant so components can import it for making API calls to the backend.
export const authService = "http://localhost:5000";

// WHY: We need to mount the React application into the HTML element with id "root" in index.html.
// WHAT: Calling createRoot on the root DOM element (with ! to assert it's not null) and rendering the component tree.
createRoot(document.getElementById('root')!).render(
  // WHY: StrictMode helps detect issues like unsafe lifecycle methods and legacy API usage during development.
  // WHAT: Wrapping the entire app in StrictMode to enable extra React development warnings and checks.
  <StrictMode>
    {/* WHY: GoogleOAuthProvider must wrap any components that use Google login to provide the OAuth2 context. */}
    {/* WHAT: Wrapping the app with GoogleOAuthProvider and passing our Google OAuth client ID for authentication. */}
    <GoogleOAuthProvider clientId="768287714158-h23i4gbavljg67dqcd8lk4i9l2qmcrci.apps.googleusercontent.com">
      {/* WHY: AppProvider must wrap the app so all child components can access shared state (user, auth, location). */}
      {/* WHAT: Wrapping the App component with AppProvider to make the global context available throughout the app. */}
      <AppProvider>
        {/* WHY: The App component contains all routes and is the main entry point for the application UI. */}
        {/* WHAT: Rendering the App component which holds BrowserRouter, Routes, Navbar, and all page components. */}
        <App />
      </AppProvider>

    </GoogleOAuthProvider>

  </StrictMode>,
)
