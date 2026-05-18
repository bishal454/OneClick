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
                <h2 className="text-2xl font-bold text-slate-700">Your cart is empty</h2>
                <button
                    onClick={() => navigate("/")}
                    className="rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
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
        <div className="min-h-screen bg-slate-50 px-4 py-8">
            <div className="mx-auto max-w-4xl">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">My Cart</h1>
                    <button
                        onClick={clearCart}
                        disabled={loading}
                        className="flex items-center gap-2 text-rose-500 hover:text-rose-700 font-semibold transition cursor-pointer"
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
                                    className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 transition hover:shadow-md"
                                >
                                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-100">
                                        <img
                                            src={menuItem.image}
                                            alt={menuItem.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    <div className="flex flex-1 flex-col justify-between h-24 py-1">
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-800 leading-tight">
                                                {menuItem.name}
                                            </h3>
                                            <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wide">
                                                {restaurant.name}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between mt-2">
                                            <span className="font-extrabold text-indigo-600 text-lg">
                                                ₹{menuItem.price}
                                            </span>

                                            <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-1 px-3 border border-slate-200">
                                                <button
                                                    onClick={() => decrement(menuItem._id)}
                                                    disabled={loading}
                                                    className="p-1 hover:bg-slate-200 rounded-lg transition-colors text-slate-600 cursor-pointer"
                                                >
                                                    <AiOutlineMinus size={14} />
                                                </button>
                                                <span className="font-bold text-slate-800 w-4 text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => increment(menuItem._id)}
                                                    disabled={loading}
                                                    className="p-1 hover:bg-slate-200 rounded-lg transition-colors text-slate-600 cursor-pointer"
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
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-4">
                            <h2 className="text-xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">
                                Summary
                            </h2>
                            <div className="space-y-4 font-medium">
                                <div className="flex justify-between text-slate-500 text-sm">
                                    <span>Total Items</span>
                                    <span className="font-semibold text-slate-800">{totalItems}</span>
                                </div>
                                <div className="flex justify-between text-slate-600 text-sm">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-slate-800">₹{subTotal}</span>
                                </div>
                                <div className="flex justify-between text-slate-600 text-sm">
                                    <span>Platform Fee</span>
                                    <span className="font-bold text-slate-800">₹{platformFee}</span>
                                </div>
                                <div className="flex justify-between text-slate-600 text-sm">
                                    <span>Delivery Fee</span>
                                    <span className="font-bold text-slate-800">
                                        {deliveryFee === 0 ? (
                                            <span className="text-emerald-500 font-bold">FREE</span>
                                        ) : (
                                            `₹${deliveryFee}`
                                        )}
                                    </span>
                                </div>

                                {subTotal < 250 && (
                                    <div className="bg-indigo-50/40 p-4 rounded-xl border border-indigo-100/50 mt-2">
                                        <p className="text-xs text-indigo-700 leading-relaxed font-medium">
                                            Add <span className="font-bold text-indigo-600">₹{250 - subTotal}</span> more to get <span className="font-bold text-indigo-600">FREE Delivery</span>!
                                        </p>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-slate-100 mt-4">
                                    <div className="flex justify-between text-lg font-extrabold text-slate-800">
                                        <span>Grand Total</span>
                                        <span className="text-indigo-600 font-extrabold text-xl">₹{grandTotal}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate("/checkout")}
                                disabled={!isRestaurantOpen || loading}
                                className={`w-full py-4 rounded-xl font-bold text-base mt-8 transition-all shadow-lg active:scale-[0.98] ${isRestaurantOpen
                                    ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 hover:shadow-indigo-200 cursor-pointer"
                                    : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                                    }`}
                            >
                                {isRestaurantOpen ? "Proceed to Checkout" : "Restaurant is Closed"}
                            </button>

                            <p className="text-center text-[10px] text-slate-400 mt-4 font-semibold uppercase tracking-widest">
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