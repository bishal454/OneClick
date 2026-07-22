
// WHY: We need useState to track which role the user has selected.
// WHAT: Importing useState hook from React for local state management.
import { useState } from 'react';

// WHY: We need the setUser function to update global user state after role assignment.
// WHAT: Importing UseAppData hook to access the global context.
import { UseAppData } from '../context/AppContext';

// WHY: We need to redirect the user to home after role selection.
// WHAT: Importing useNavigate for programmatic navigation.
import { useNavigate } from 'react-router-dom';

// WHY: We need the backend URL to make the API call for updating the role.
// WHAT: Importing the authService base URL constant.
import { authService } from '../main';

// WHY: We need an HTTP client to send the role update request to the backend.
// WHAT: Importing axios for making PUT requests.
import axios from 'axios';

// WHY: We need a type to restrict role values to valid options or null.
// WHAT: Defining a Role union type with valid role strings and null.
type Role = "customer" | "rider" | "seller" | "admin" | null;

// WHY: New users must select a role before using the app.
// WHAT: Defining the SelectRole page component.
const SelectRole = () => {
    // WHY: We track the selected role locally before submitting.
    // WHAT: Creating role state initialized to null (no selection).
    const [role, setRole] = useState<Role>(null);

    // WHY: We need to update global user data after role is saved.
    // WHAT: Getting setUser from global context.
    const { setUser } = UseAppData()

    // WHY: We redirect to home after successful role selection.
    // WHAT: Getting the navigate function from react-router.
    const navigate = useNavigate()

    // WHY: We render a button for each role dynamically from this array.
    // WHAT: Defining the array of available roles.
    const roles: Role[] = ['customer', 'rider', 'seller', 'admin'];

    // WHY: We need to send the selected role to the backend API.
    // WHAT: Defining the addRole async function for the API call.
    const addRole = async () => {
        try {
            // WHY: The backend PUT endpoint updates the user's role in the database.
            // WHAT: Making a PUT request with role in body and JWT token in header.
            const { data } = await axios.put(
                `${authService}/api/auth/add/role`,
                { role },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            // WHY: Backend returns a new token with updated role, we must save it.
            // WHAT: Storing the new JWT token in localStorage.
            localStorage.setItem("token", data.token);

            // WHY: The global state must reflect the updated user with the new role.
            // WHAT: Updating the user in global context with backend response data.
            setUser(data.user)

            // WHY: User should go to home page after choosing a role.
            // WHAT: Navigating to "/" with replace to prevent going back.
            navigate("/", { replace: true })

        }
        catch (error) {
            // WHY: User needs feedback if the role update fails.
            // WHAT: Showing an alert and logging the error.
            alert("something went wrong");
            console.log(error)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/40 space-y-6">
                <h1 className="text-center text-3xl font-extrabold text-slate-800 tracking-tight">Choose your role</h1>
                <p className="text-center text-sm text-slate-500 font-medium">Select how you want to use OneClick to get started</p>
                
                <div className="space-y-3">
                    {
                        roles.map((r) => (
                            <button key={r} onClick={() => setRole(r)} className={`
                        w-full rounded-xl border px-5 py-4 text-sm font-semibold
                         capitalize transition-all duration-200 cursor-pointer ${role === r
                                    ? "border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                                } 
                          `}>
                                Continue as {r}
                            </button>
                        ))}
                </div>

                <button disabled={!role} onClick={addRole} className={`w-full rounded-xl 
                px-5 py-4 text-sm font-bold transition-all duration-200 ${role 
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 hover:shadow-indigo-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer" 
                    : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                    }`}>
                    Next
                </button>
            </div>
        </div>
    );
};

// WHY: App.tsx needs this component for the /select-role route.
// WHAT: Exporting SelectRole as default export.
export default SelectRole;
