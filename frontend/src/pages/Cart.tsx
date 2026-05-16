import { UseAppData } from "../context/AppContext";
import axios from "axios";
import { restaurantService } from "../main";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AiOutlinePlus, AiOutlineMinus, AiOutlineDelete } from "react-icons/ai";
import { useState } from "react";
import { type IMenuItem, type IRestaurant } from "../types";

const Cart = () => {
    const { cart, subTotal, fetchCart, quantity: totalItems } = UseAppData();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    async function increment(itemId: string) {
        try {
            setLoading(true);
            const { data } = await axios.put(`${restaurantService}/api/cart/inc`, { itemId }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            toast.success(data.message);
            fetchCart();
        } catch (error) {
            console.log(error);
            toast.error("Failed to increment item");
        } finally {
            setLoading(false);
        }
    }

    async function decrement(itemId: string) {
        try {
            setLoading(true);
            const { data } = await axios.put(`${restaurantService}/api/cart/dec`, { itemId }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            toast.success(data.message);
            fetchCart();
        } catch (error) {
            console.log(error);
            toast.error("Failed to decrement item");
        } finally {
            setLoading(false);
        }
    }

    async function clearCart() {
        try {
            setLoading(true);
            const { data } = await axios.delete(`${restaurantService}/api/cart/clear`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            toast.success(data.message);
            fetchCart();
        } catch (error) {
            console.log(error);
            toast.error("Failed to clear cart");
        } finally {
            setLoading(false);
        }
    }

    if (!cart || cart.length === 0) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
                <img
                    src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
                    alt="Empty Cart"
                    className="h-40 w-40 opacity-50"
                />
                <h2 className="text-2xl font-bold text-gray-700">Your cart is empty</h2>
                <button
                    onClick={() => navigate("/")}
                    className="rounded-lg bg-[#FF5200] px-6 py-2 font-semibold text-white transition hover:bg-[#e64a00]"
                >
                    Explore Restaurants
                </button>
            </div>
        );
    }

    const platformFee = 10;
    const deliveryFee = subTotal >= 250 ? 0 : 40;
    const grandTotal = subTotal + deliveryFee + platformFee;

    // Since all items in cart are from the same restaurant (enforced by backend)
    const firstItemRestaurant = cart[0].restaurantId as IRestaurant;
    const isRestaurantOpen = firstItemRestaurant.isOpen;

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="mx-auto max-w-4xl">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Cart</h1>
                    <button
                        onClick={clearCart}
                        disabled={loading}
                        className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium transition"
                    >
                        <AiOutlineDelete size={20} />
                        Clear Cart
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item) => {
                            const menuItem = item.itemId as IMenuItem;
                            const restaurant = item.restaurantId as IRestaurant;
                            return (
                                <div
                                    key={item._id}
                                    className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 transition hover:shadow-md"
                                >
                                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-gray-100">
                                        <img
                                            src={menuItem.image}
                                            alt={menuItem.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    <div className="flex flex-1 flex-col justify-between h-24 py-1">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900 leading-tight">
                                                {menuItem.name}
                                            </h3>
                                            <p className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-wide">
                                                {restaurant.name}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between mt-2">
                                            <span className="font-extrabold text-[#FF5200] text-lg">
                                                ₹{menuItem.price}
                                            </span>

                                            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1 px-3 border border-gray-200">
                                                <button
                                                    onClick={() => decrement(menuItem._id)}
                                                    disabled={loading}
                                                    className="p-1 hover:bg-gray-200 rounded-lg transition-colors text-gray-600"
                                                >
                                                    <AiOutlineMinus size={14} />
                                                </button>
                                                <span className="font-bold text-gray-800 w-4 text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => increment(menuItem._id)}
                                                    disabled={loading}
                                                    className="p-1 hover:bg-gray-200 rounded-lg transition-colors text-gray-600"
                                                >
                                                    <AiOutlinePlus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Summary Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-4">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b">
                                Summary
                            </h2>
                            <div className="space-y-4">
                                <div className="flex justify-between text-gray-500 text-sm">
                                    <span>Total Items</span>
                                    <span className="font-semibold">{totalItems}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span className="font-medium">Subtotal</span>
                                    <span className="font-bold">₹{subTotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span className="font-medium">Platform Fee</span>
                                    <span className="font-bold">₹{platformFee}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span className="font-medium">Delivery Fee</span>
                                    <span className="font-bold">
                                        {deliveryFee === 0 ? (
                                            <span className="text-green-600">FREE</span>
                                        ) : (
                                            `₹${deliveryFee}`
                                        )}
                                    </span>
                                </div>

                                {subTotal < 250 && (
                                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 mt-2">
                                        <p className="text-xs text-orange-700 leading-relaxed">
                                            Add <span className="font-bold">₹{250 - subTotal}</span> more to get <span className="font-bold">FREE Delivery</span>!
                                        </p>
                                    </div>
                                )}

                                <div className="pt-4 border-t mt-4">
                                    <div className="flex justify-between text-xl font-black text-gray-900">
                                        <span>Grand Total</span>
                                        <span className="text-[#FF5200]">₹{grandTotal}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                disabled={!isRestaurantOpen || loading}
                                className={`w-full py-4 rounded-xl font-bold text-lg mt-8 transition-all shadow-lg shadow-orange-100 active:scale-[0.98] ${isRestaurantOpen
                                    ? "bg-[#FF5200] text-white hover:bg-[#e64a00]"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                                    }`}
                            >
                                {isRestaurantOpen ? "Proceed to Checkout" : "Restaurant is Closed"}
                            </button>

                            <p className="text-center text-[10px] text-gray-400 mt-4 font-medium uppercase tracking-widest">
                                Secure Checkout with OneClick
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;