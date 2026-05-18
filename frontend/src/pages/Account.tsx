import { UseAppData } from "../context/AppContext"
import toast from "react-hot-toast"
import { BiLogOut, BiMapPin, BiPackage } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const Account = () => {

    const { user, setUser, setIsAuth } = UseAppData();
    const firstLetter = user?.name.charAt(0).toUpperCase();

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.setItem("token", " ");
        setUser(null);
        setIsAuth(false);
        navigate("/login");
        toast.success("Logout successful");

    };


    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8">
            <div className="mx-auto max-w-md rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-100/40 overflow-hidden">
                <div className="flex items-center gap-4 border-b border-slate-100 p-6 bg-slate-50/50">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full
                    bg-indigo-600 text-xl font-bold text-white shadow-md shadow-indigo-100">
                        {firstLetter}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">{user?.name}</h2>
                        <p className="text-sm text-slate-400 font-semibold mt-0.5">{user?.email}</p>
                    </div>
                </div>
                <div className="divide-y divide-slate-100">
                    <div
                        className="flex cursor-pointer items-center gap-4 p-5 hover:bg-slate-50 transition-colors duration-150"
                        onClick={() => navigate("/orders")}
                    >
                        <BiPackage className="h-6 w-6 text-indigo-600" />
                        <span className="font-semibold text-slate-700">Your Orders</span>
                    </div>
                    <div
                        className="flex cursor-pointer items-center gap-4 p-5 hover:bg-slate-50 transition-colors duration-150"
                        onClick={() => navigate("/address")}
                    >
                        <BiMapPin className="h-6 w-6 text-indigo-600" />
                        <span className="font-semibold text-slate-700">Addresses</span>
                    </div>
                    <div
                        className="flex cursor-pointer items-center gap-4 p-5 hover:bg-slate-50 transition-colors duration-150"
                        onClick={handleLogout}
                    >
                        <BiLogOut className="h-6 w-6 text-rose-500" />
                        <span className="font-semibold text-slate-700">Logout</span>
                    </div>
                </div>
            </div>
        </div>


    )
}

export default Account