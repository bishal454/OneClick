import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { restaurantService } from "../main";
import type { IOrder } from "../types";

const ACTIVE_STATUSES = [
    "placed",
    "accepted",
    "preparing",
    "ready-for-pickup",
    "rider-assigned",
    "picked-up",

]

const Order = () => {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { socket } = useSocket();


    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${restaurantService}/api/order/myorder`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setOrders(data.orders || []);
        } catch (error) {
            console.log(error);

        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchOrders();


    }, [])

    useEffect(() => {
        if (!socket) return;
        const onOrderUpdate = () => {

            fetchOrders();

        };


        socket.on("order:update", onOrderUpdate);
        socket.on("order:rider_assigned", onOrderUpdate);
        return () => {
            socket.off("order:update", onOrderUpdate);
            socket.off("order:rider_assigned", onOrderUpdate);
        }
    }, [socket])



    if (loading) {
        return <div className="flex-center text-gray-500 ">Loading Orders......</div>;



    }

    if (orders.length === 0) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">

                <p className="text-gray-500"> No orders yet</p>
            </div>
        );

    }


    const activeOrders = orders.filter((o) => ACTIVE_STATUSES.includes(o.status));

    const completedOrders = orders.filter((o) => !ACTIVE_STATUSES.includes(o.status));

    return (
        <div className="mx-auto max-w-4xl px-4 py-6 space-y-6">


            <h1 className="text-2xl font-bold">My Orders</h1>

            <section className="space-y-3">
                <h2 className="text-lg font-semibold">Active Orders ({activeOrders.length})</h2>
                {
                    activeOrders.length === 0 ? (
                        <p className="text-gray-500">No Active Orders.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {
                                activeOrders.map((order) => (
                                    <OrderRow
                                        key={order._id}
                                        order={order}
                                        onClick={() => navigate(`/order/${order._id}`)}
                                    />
                                ))
                            }
                        </div>
                    )
                }
            </section>


            <section className="space-y-3">
                <h2 className="text-lg font-semibold">Completed  Orders ({completedOrders.length})</h2>
                {
                    completedOrders.length === 0 ? (
                        <p className="text-gray-500">No Completed Orders.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {
                                completedOrders.map((order) => (
                                    <OrderRow
                                        key={order._id}
                                        order={order}
                                        onClick={() => navigate(`/order/${order._id}`)}
                                    />
                                ))
                            }
                        </div>
                    )
                }
            </section>
        </div>
    )
}

export default Order;


const OrderRow = ({

    order,
    onClick,

}:

    {
        order: IOrder;
        onClick: () => void;
    }) => {
    return (
        <div className="cursor-pointer rounded-xl bg-white p-4 shadow-sm hover:bg-gray-50"
            onClick={onClick}
        >
            <div className="flex justify-between items-center">
                <p className="text-sm font-medium "> Order  #{order._id.slice(-6)}</p>
                <span className="text-xs capitalize text-gray-500">{order.status}</span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
                {order.items.map((item, i) => (

                    <span key={i}>
                        {item.name} x {item.quantity}
                        {i < order.items.length - 1 && " , "}

                    </span>
                ))}
            </div>
            <div className="mt-2 flex justify-between text-sm font-medium">
                <span >Total</span>
                <span> ₹{order.totalAmount}</span>

            </div>
        </div>
    );
};
