
import { UseAppData } from "../context/AppContext";

// WHY: We need Navigate to redirect unauthenticated users to login, and Outlet to render child routes when authorized.
// WHAT: Importing Navigate (performs client-side redirects) and Outlet (renders matched child route components) from react-router.
import { Navigate, Outlet } from "react-router";

// WHY: We need useLocation to check the current URL path and decide whether to redirect users without a role.
// WHAT: Importing the useLocation hook from react-router-dom which returns the current location object with the pathname.
import { useLocation } from "react-router-dom";


const ProtectedRoute = () => {

    const { isAuth, user, loading } = UseAppData();


    const location = useLocation();


    if (loading) return null;


    if (!isAuth) {
        return <Navigate to={"/login"} replace />
    }


    if (user?.role === null && location.pathname !== "/select-role") {
        return <Navigate to={"/select-role"} replace />
    }

    if (user?.role !== null && location.pathname === "/select-role") {
        return <Navigate to={"/"} replace />
    }


    return <Outlet />

};



export default ProtectedRoute;
