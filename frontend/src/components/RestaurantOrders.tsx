import { useEffect, useRef, useState } from "react"

import type { IOrder } from "../types"
import { useSocket } from "../context/SocketContext"
import audio from "../assets/rider.mp3";
import axios from "axios";
import { restaurantService } from "../main";


const ACTIVE_STATUSES = [
    "placed",
    "accepted",
    "preparing",
    "ready-for-pickup",
    "rider-assigned",
    "picked-up",

    "cancelled"
]

const RestaurantOrders = ({ restaurantId }: { restaurantId: string }) => {
    const [orders, setOrders] = useState<IOrder[]>([])
    const [loading, setLoading] = useState(false);
    const [audioUnlocked, setAudioUnlocked] = useState(false);
    const [showCompleted, setShowCompleted] = useState(false);


    const { socket } = useSocket();
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        audioRef.current = new Audio(audio);
        audioRef.current.load();

    }, [])


    const unlockAudio = () => {
        if (audioRef.current) {
            audioRef.current.play().then(() => {
                audioRef.current!.pause();
                audioRef.current!.currentTime = 0;
                setAudioUnlocked(true);
                console.log("Audio is unlocked")
            }).catch((err) => {
                console.log("failed to unlock audio", err);
            });
        }
    };

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get(`${restaurantService}/api/order/${restaurantId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,

                },

            });

            setOrders(data.orders || []);
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            await axios.put(`${restaurantService}/api/order/${orderId}`, {
                status: newStatus
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            fetchOrders();
        } catch (error) {
            console.log("Failed to update status", error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [restaurantId])


    useEffect(() => {
        if (!socket) return;

        const onNewOrder = () => {

            console.log("new order received through socket");
            if (audioUnlocked && audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch((err) => {
                    console.error("failed to play audio", err);
                });

            }
            fetchOrders();



        };
        socket.on("order:new", onNewOrder);

        return () => {
            socket.off("order:new", onNewOrder);
        }

    },
        [socket, audioUnlocked]);

    if (loading) {

        return <div className="text-gray-500">Loading orders...</div>
    }

    const activeOrders = orders.filter((o) => ACTIVE_STATUSES.includes(o.status));
    const completedOrders = orders.filter((o) => !ACTIVE_STATUSES.includes(o.status));



    return (
        <div className="space-y-6">
            {
                !audioUnlocked && (
                    <div className=" bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">

                            <span className="text-2xl">🔔</span>
                            <div>
                                <p className="font-medium text-blue-900">
                                    Enable Sound Notification
                                </p>
                                <p className="text-sm text-blue-700">
                                    Get Notification when orders arrive
                                </p>
                            </div>

                        </div>

                        <button onClick={unlockAudio} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
                            Enable Sound
                        </button>
                    </div>
                )}


            {/*Active orders*/}

            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800">Active Orders ({activeOrders.length})</h3>

                {
                    activeOrders.length === 0 ? (
                        <p className=" text-sm text-gray-500">
                            No Active Orders.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {
                                activeOrders.map((order) => (
                                    <div key={order._id} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 space-y-4 hover:shadow-lg transition">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Order ID</span>
                                                <h4 className="font-mono text-sm font-bold text-gray-800">#{order._id.slice(-8).toUpperCase()}</h4>
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                                                order.status === "placed" ? "bg-orange-100 text-orange-800" :
                                                order.status === "accepted" ? "bg-blue-100 text-blue-800" :
                                                order.status === "preparing" ? "bg-yellow-100 text-yellow-800" :
                                                order.status === "ready-for-pickup" ? "bg-purple-100 text-purple-800" :
                                                order.status === "rider-assigned" ? "bg-indigo-100 text-indigo-800" :
                                                order.status === "picked-up" ? "bg-teal-100 text-teal-800" :
                                                order.status === "cancelled" ? "bg-red-100 text-red-800" :
                                                "bg-gray-100 text-gray-800"
                                            }`}>
                                                {order.status}
                                            </span>
                                        </div>

                                        <div className="border-y border-gray-100 py-3">
                                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Items</p>
                                            <div className="space-y-1.5">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between text-sm">
                                                        <span className="text-gray-600 font-medium">
                                                            {item.name} <span className="text-xs text-gray-400 font-semibold">x{item.quantity}</span>
                                                        </span>
                                                        <span className="font-semibold text-gray-800">₹{item.price * item.quantity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center text-sm gap-4">
                                            <div className="min-w-0 flex-1">
                                                <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Deliver to</span>
                                                <span className="text-gray-600 font-medium truncate block" title={order.deliveryAddress.formattedAddress}>
                                                    {order.deliveryAddress.formattedAddress}
                                                </span>
                                                <span className="text-xs text-gray-500 font-medium block">📞 {order.deliveryAddress.mobile}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Total</span>
                                                <span className="text-base font-bold text-gray-900">₹{order.totalAmount}</span>
                                            </div>
                                        </div>

                                        {["placed", "accepted", "preparing"].includes(order.status) && (
                                            <div className="pt-2">
                                                <button
                                                    onClick={() => {
                                                        const nextStatus = 
                                                            order.status === "placed" ? "accepted" :
                                                            order.status === "accepted" ? "preparing" :
                                                            "ready-for-pickup";
                                                        handleStatusChange(order._id, nextStatus);
                                                    }}
                                                    className={`w-full py-2 rounded-lg text-white font-semibold text-sm transition shadow-sm ${
                                                        order.status === "placed" ? "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800" :
                                                        order.status === "accepted" ? "bg-blue-600 hover:bg-blue-700 active:bg-blue-800" :
                                                        "bg-purple-600 hover:bg-purple-700 active:bg-purple-800"
                                                    }`}
                                                >
                                                    {
                                                        order.status === "placed" ? "Accept Order" :
                                                        order.status === "accepted" ? "Start Preparing" :
                                                        "Mark Ready for Pickup"
                                                    }
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            }
                        </div>
                    )
                }
            </div>

            {/* Completed Orders */}
            <div className="space-y-3 pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">Completed Orders ({completedOrders.length})</h3>
                    {completedOrders.length > 0 && (
                        <button
                            onClick={() => setShowCompleted(!showCompleted)}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
                        >
                            {showCompleted ? "Hide Past Orders" : "Show Past Orders"}
                        </button>
                    )}
                </div>

                {showCompleted && completedOrders.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {completedOrders.map((order) => (
                            <div key={order._id} className="bg-gray-50 rounded-xl p-5 border border-gray-200/60 space-y-3">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="text-[10px] font-semibold text-gray-400 uppercase">Order ID</span>
                                        <h5 className="font-mono text-xs font-bold text-gray-700">#{order._id.slice(-8).toUpperCase()}</h5>
                                    </div>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-green-100 text-green-800">
                                        {order.status}
                                    </span>
                                </div>
                                <div className="text-xs space-y-1">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-gray-600">
                                            <span>{item.name} x{item.quantity}</span>
                                            <span>₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-gray-200/50 text-xs">
                                    <span className="text-gray-500 font-medium truncate max-w-[200px]" title={order.deliveryAddress.formattedAddress}>
                                        Delivered to: {order.deliveryAddress.formattedAddress}
                                    </span>
                                    <span className="font-bold text-gray-800">₹{order.totalAmount}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {completedOrders.length === 0 && (
                    <p className="text-sm text-gray-500">
                        No Completed Orders.
                    </p>
                )}
            </div>

        </div>
    )
}

export default RestaurantOrders