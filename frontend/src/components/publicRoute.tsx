
// WHY: We need the global context hook to access the user's auth status and loading state.
// WHAT: Importing the UseAppData custom hook to consume the AppContext and check if the user is authenticated.
import { UseAppData } from "../context/AppContext";

// WHY: We need Navigate to redirect authenticated users away from public pages, and Outlet to render child routes.
// WHAT: Importing Navigate (performs client-side redirects) and Outlet (renders matched child route components) from react-router.
import { Navigate, Outlet } from "react-router";


// WHY: We need a route guard component that prevents authenticated users from accessing public-only pages like Login.
// WHAT: Defining the PublicRoute functional component that redirects logged-in users to the home page.
const PublicRoute = () => {
    // WHY: We need the auth status and loading state to determine whether to show the page or redirect.
    // WHAT: Destructuring isAuth and loading from the global context using the UseAppData hook.
    const { isAuth, loading } = UseAppData();

    // WHY: While the app is still checking authentication status, we shouldn't render or redirect prematurely.
    // WHAT: Returning null (renders nothing) if loading is true, waiting for the auth check to complete.
    if (loading) return null;

    // WHY: If the user is already authenticated, they shouldn't see the login page and should go to the home page instead.
    // WHAT: If isAuth is true, redirect to "/" (home); otherwise, render the child route (Login page) via Outlet.
    return isAuth ? <Navigate to ="/"replace /> : <Outlet/>
};


// WHY: The App.tsx file needs to import this component to wrap public-only routes in the route configuration.
// WHAT: Exporting PublicRoute as the default export so it can be used as a route layout element in App.tsx.
export default PublicRoute;
