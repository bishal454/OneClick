import { useEffect, useState } from "react";
import axios from "axios";
import { restaurantService } from "../main";
import { UseAppData } from "../context/AppContext";
import type { IRestaurant } from "../types";

const AdminDashboard = () => {
    const { user, setUser } = UseAppData();
    const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAllRestaurants = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${restaurantService}/api/restaurant/admin/all`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setRestaurants(data.restaurants || []);
        } catch (error) {
            console.error("Failed to fetch restaurants", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllRestaurants();
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        window.location.href = "/login";
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Admin Navbar */}
            <div className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-indigo-700">Admin Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span className="font-medium text-slate-600">{user?.name}</span>
                    <button onClick={logout} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-sm font-semibold transition">
                        Logout
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
                {/* Stats row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-center items-center">
                        <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Restaurants</p>
                        <p className="text-4xl font-extrabold text-slate-800 mt-2">{restaurants.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-center items-center">
                        <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Active Restaurants</p>
                        <p className="text-4xl font-extrabold text-green-600 mt-2">{restaurants.filter(r => r.isOpen).length}</p>
                    </div>
                </div>

                {/* Restaurants List */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100">
                        <h2 className="text-lg font-bold text-slate-800">Platform Restaurants</h2>
                    </div>
                    {loading ? (
                        <div className="p-12 text-center text-slate-500">Loading data...</div>
                    ) : restaurants.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">No restaurants registered yet.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                                        <th className="px-6 py-4 font-semibold">Restaurant Name</th>
                                        <th className="px-6 py-4 font-semibold">Owner ID</th>
                                        <th className="px-6 py-4 font-semibold">Status</th>
                                        <th className="px-6 py-4 font-semibold">Verified</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {restaurants.map((res) => (
                                        <tr key={res._id} className="hover:bg-slate-50 transition">
                                            <td className="px-6 py-4 font-medium text-slate-800">
                                                <div className="flex items-center gap-3">
                                                    <img src={res.images} alt={res.name} className="w-10 h-10 rounded-full object-cover" />
                                                    {res.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 text-sm font-mono">{res.ownerId}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${res.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {res.isOpen ? 'Open' : 'Closed'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${res.isVerified ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                                    {res.isVerified ? 'Verified' : 'Pending'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
