// WHY: We need the global context hook to access the user's auth status, user data, and loading state.
// WHAT: Importing the UseAppData custom hook to consume the AppContext and check if the user is authenticated.
import { UseAppData } from "../context/AppContext";

// WHY: We need Navigate to redirect unauthenticated users to login, and Outlet to render child routes when authorized.
// WHAT: Importing Navigate (performs client-side redirects) and Outlet (renders matched child route components) from react-router.
import { Navigate, Outlet } from "react-router";

// WHY: We need useLocation to check the current URL path and decide whether to redirect users without a role.
// WHAT: Importing the useLocation hook from react-router-dom which returns the current location object with the pathname.
import { useLocation } from "react-router-dom"

// WHY: We need a route guard component that prevents unauthenticated users from accessing protected pages.
// WHAT: Defining the ProtectedRoute functional component that checks auth status before rendering child routes.
const ProtectedRoute = () => {
    // WHY: We need the auth status, user data, and loading state to make routing decisions.
    // WHAT: Destructuring isAuth, user, and loading from the global context using the UseAppData hook.
    const { isAuth, user, loading } = UseAppData();

    // WHY: We need the current URL path to check if the user is already on the select-role page.
    // WHAT: Calling useLocation() to get the current location object containing the pathname property.
    const location = useLocation();

    // WHY: While the app is still checking if the user is authenticated (fetching /me), we shouldn't redirect or render anything.
    // WHAT: Returning null (renders nothing) if loading is true, preventing premature redirects before auth check completes.
    if (loading) return null;

    // WHY: If the user is not authenticated, they should not be able to access protected pages and must log in first.
    // WHAT: Redirecting unauthenticated users to the /login page using Navigate with replace to avoid back-button issues.
    if (!isAuth) {
        return <Navigate to={"/login"} replace />
    }

    // WHY: If the user is logged in but hasn't selected a role yet, they must choose one before accessing the app.
    // WHAT: Redirecting users with a null role to the /select-role page, unless they're already on that page.
    if (user?.role === null && location.pathname !== "/select-role") {
        return <Navigate to={"/select-role"} replace />
    }

    // if (user?.role !== null && location.pathname === "/select-role") {
    //     return <Navigate to={"/"} replace />
    // }

    // WHY: If all checks pass (authenticated and has a role), we render the matched child route component.
    // WHAT: Rendering the Outlet component which displays the child route's element (Home, Account, etc.).
    return <Outlet />

};


// WHY: The App.tsx file needs to import this component to wrap protected routes in the route configuration.
// WHAT: Exporting ProtectedRoute as the default export so it can be used as a route layout element in App.tsx.
export default ProtectedRoute;