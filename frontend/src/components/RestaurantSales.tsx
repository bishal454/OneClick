import { useEffect, useState } from "react";
import axios from "axios";
import { restaurantService } from "../main";

interface IRecentOrder {
    _id: string;
    items: { name: string; quantity: number }[];
    subtotal: number;
    totalAmount: number;
    status: string;
    createdAt: string;
}

interface IStats {
    totalRevenue: number;
    totalOrders: number;
    completedDeliveries: number;
    averageOrderValue: number;
    recentOrders: IRecentOrder[];
}

const statusColor = (status: string) => {
    switch (status) {
        case "delivered": return "bg-green-100 text-green-700";
        case "cancelled": return "bg-red-100 text-red-700";
        case "picked-up": return "bg-blue-100 text-blue-700";
        case "rider-assigned": return "bg-purple-100 text-purple-700";
        default: return "bg-yellow-100 text-yellow-700";
    }
};

const StatCard = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
    <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100 flex flex-col gap-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-extrabold text-gray-800">{value}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
);

const RestaurantSales = ({ restaurantId }: { restaurantId: string }) => {
    const [stats, setStats] = useState<IStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                setError(null);
                const { data } = await axios.get(
                    `${restaurantService}/api/order/restaurant/${restaurantId}/stats`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                setStats(data);
            } catch (err: any) {
                setError(err?.response?.data?.message || "Failed to load sales data.");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [restaurantId]);

    if (loading) {
        return (
            <div className="flex h-40 items-center justify-center">
                <p className="text-gray-400 text-sm">Loading sales data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-40 items-center justify-center">
                <p className="text-red-500 text-sm">{error}</p>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    label="Total Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString()}`}
                    sub="from paid orders"
                />
                <StatCard
                    label="Total Orders"
                    value={`${stats.totalOrders}`}
                    sub="all paid orders"
                />
                <StatCard
                    label="Deliveries"
                    value={`${stats.completedDeliveries}`}
                    sub="successfully delivered"
                />
                <StatCard
                    label="Avg Order Value"
                    value={`₹${stats.averageOrderValue}`}
                    sub="per order"
                />
            </div>

            {/* Recent Orders */}
            <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Orders</h3>
                {stats.recentOrders.length === 0 ? (
                    <p className="text-sm text-gray-400">No recent orders found.</p>
                ) : (
                    <div className="space-y-3">
                        {stats.recentOrders.map((order) => (
                            <div key={order._id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                                <div className="space-y-0.5">
                                    <p className="text-xs font-mono text-gray-400">#{order._id.slice(-6).toUpperCase()}</p>
                                    <p className="text-sm font-medium text-gray-700">
                                        {order.items.map(i => `${i.name} x${i.quantity}`).join(", ")}
                                    </p>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className="text-sm font-bold text-gray-800">₹{order.subtotal}</p>
                                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(order.status)}`}>
                                        {order.status.replace(/-/g, " ")}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RestaurantSales;
