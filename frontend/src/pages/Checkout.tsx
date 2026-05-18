import { useEffect, useState } from "react";
import { UseAppData } from "../context/AppContext"

import axios from "axios";
import { restaurantService, utilsService } from "../main";
import { useNavigate } from "react-router-dom";
import type { IMenuItem, IRestaurant } from "../types";
import toast from "react-hot-toast";
import { BiCreditCard, BiLoader } from "react-icons/bi";


interface Address {

    _id: string,
    formattedAddress: string,
    mobile: number,

}


const CheckOut = () => {

    const { cart, subTotal, quantity } = UseAppData();

    const [addresses, setAddresses] = useState<Address[]>([]);

    const [selectAddressId, setSelectAddressId] = useState<string | null>(null);

    const [loadingAddress, setLoadingAddress] = useState(true);

    const [loadingRazorpay, setLoadingRazorpay] = useState(false);
    const [loadingStripe, setLoadingStripe] = useState(false);
    const [creatingOrder, setCreatingOrder] = useState(false);


    useEffect(() => {
        const fetchAddress = async () => {

            if (!cart || cart.length == 0) {

                setLoadingAddress(false);
                return;

            }
            try {

                const { data } = await axios.get(`${restaurantService}/api/address/all`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,

                        },

                    });

                setAddresses(data.addresses || []);
            } catch (error) {
                console.log(error);


            } finally {
                setLoadingAddress(false);

            }
        };


        fetchAddress();

    }, [cart]);
    const navigate = useNavigate();
    if (!cart || cart.length === 0) {

        return (
            <div className="flex min-h-[60vh] item-center justify-center">

                <p className="text-gray-500 text-lg"> Your Cart is Empty

                </p>
            </div>
        );


    }



    const restaurant = cart[0].restaurantId as IRestaurant;

    const deliveryFee = subTotal < 250 ? 49 : 0;

    const platformFee = 10;

    const grandTotal = subTotal + deliveryFee + platformFee;

    const createOrder = async (paymentMethod: "razorpay" | "stripe") => {
        if (!selectAddressId) return null;

        setCreatingOrder(true);

        try {
            const { data } = await axios.post(`${restaurantService}/api/order/new`, {
                paymentMethod,
                addressId: selectAddressId,

            },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

            return data;

        } catch (error) {
            toast.error("Failed to create order");



        } finally {

            setCreatingOrder(false);

        }
    };

    const paywithRazorpay = async () => {
        try {
            setLoadingAddress(true);

            const order = await createOrder("razorpay");
            if (!order) return;

            const { orderId, amount } = order;

            const { data } = await axios.post(`${utilsService}/api/payment/create`, {
                orderId,
            });

            const { razorpayOrderId, key } = data;
            const options = {
                key,
                amount: amount * 100,
                currency: "INR",
                name: "Oneclick",
                description: "Food Order Payment",
                order_id: razorpayOrderId,
                handler: async (response: any) => {
                    try {
                        await axios.post(`${utilsService}/api/payment/verify`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderId,
                        });
                        toast.success("Payment successfully 🎉 ");

                        navigate("/paymentsuccess/" + response.razorpay_payment_id);

                    } catch (error) {
                        toast.error("Payment verification failed");
                        console.log(error);

                    }
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const razorpay = new (window as any).Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong , Please refresh ");
        } finally {
            setLoadingRazorpay(false);
        }
    };





    const paywithStripe = async () => {

        try {
            setLoadingStripe(true);
            const order = await createOrder("stripe");
            if (!order) return;
            // const { orderId, amount } = order;
            // const { data } = await axios.post(`${utilsService}/api/payment/create-stripe-intent`, {
            // orderId,
            // });
            console.log("Stripe checkout", order);

            // const stripe = await (window as any).Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
            // const { error } = await stripe.redirectToCheckout({
            //    sessionId: data.sessionId,
            // });
            //     if (error) {
            //         toast.error(error.message);
            //     }
        }
        catch (error) {
            console.log(error);
            toast.error("Something went wrong , Please refresh ");
        } finally {
            setLoadingStripe(false);
        }


    };

    return (
        <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">

            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Checkout</h1>

            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-100/50">
                <h2 className="text-xl font-bold text-slate-800"> {restaurant.name}</h2>
                <p className="text-sm text-slate-500 mt-1 font-medium">
                    {restaurant.autoLocation.formattedAddress}
                </p>
            </div>


            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-100/50 space-y-4 ">
                <h3 className="text-lg font-bold text-slate-800">Delivery Address</h3>
                {
                    loadingAddress ? <p className="text-sm text-slate-500 font-medium">
                        Loading Address ....</p>
                        : addresses.length === 0 ? (
                            <p className="text-sm text-slate-500 font-medium">No Address Found. Please Add One.</p>

                        ) : (addresses.map((add) => (
                            <label key={add._id} className={`flex gap-3 rounded-xl border p-4 cursor-pointer transition-all duration-200 ${selectAddressId === add._id ? "border-indigo-600 bg-indigo-50/30 text-slate-800 shadow-sm" : "border-slate-100 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-200"
                                }`}
                            >
                                <input
                                    type="radio"
                                    checked={selectAddressId === add._id}
                                    onChange={() => setSelectAddressId(add._id)}
                                    className="accent-indigo-600" />

                                <div >
                                    <p className="text-sm font-semibold text-slate-800">{add.formattedAddress}</p>
                                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                                        {add.mobile}
                                    </p>
                                </div>

                            </label>
                        ))

                        )

                }

            </div>


            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-100/50 space-y-4 ">
                <h3 className="text-lg font-bold text-slate-800">Order Summary</h3>
                {

                    cart.map((cartItem) => {

                        const item = cartItem.itemId as IMenuItem;

                        return <div className="flex justify-between text-sm font-medium text-slate-700" key={cartItem._id}>

                            <span className="text-slate-600">
                                {item.name} <span className="text-slate-400 font-semibold">x {cartItem.quantity}</span>
                            </span>
                            <span className="font-semibold text-slate-800">₹ {item.price * cartItem.quantity}</span>

                        </div>

                    })
                }


                <hr className="border-slate-100" />
                <div className="flex justify-between text-sm font-medium text-slate-600">
                    <span>Items ({quantity})</span>
                    <span className="font-semibold text-slate-800">₹ {subTotal}</span>
                </div>

                <div className="flex justify-between text-sm font-medium text-slate-600">
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-slate-800"> {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`} </span>
                </div>

                <div className="flex justify-between text-sm font-medium text-slate-600">
                    <span>Platform Fee</span>
                    <span className="font-semibold text-slate-800">₹ {platformFee}</span>
                </div>
                {subTotal < 250 && (
                    <div className="bg-indigo-50/40 p-4 rounded-xl border border-indigo-100/50 mt-2">
                        <p className="text-xs text-indigo-700 leading-relaxed font-medium">
                            Add <span className="font-bold text-indigo-600">₹{250 - subTotal}</span> more to get <span className="font-bold text-indigo-600">FREE Delivery</span>!
                        </p>
                    </div>
                )}

                <div className="flex justify-between text-base font-extrabold text-slate-800 pt-2 border-t border-dashed border-slate-100">
                    <span>Grand Total</span>
                    <span>₹ {grandTotal}</span>
                </div>

            </div>


            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-100/50 space-y-4">
                <h3 className="text-lg font-bold text-slate-800">Payment Method</h3>

                <button disabled={!selectAddressId || loadingRazorpay || creatingOrder}
                    onClick={paywithRazorpay}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-100 hover:shadow-cyan-200 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none">

                    {
                        loadingRazorpay ? (
                            <BiLoader size={18} className="animate-spin" />

                        ) : (
                            <BiCreditCard size={18} />
                        )
                    }
                    pay With Razorpay
                </button>


                <button disabled={!selectAddressId || loadingStripe || creatingOrder}
                    onClick={paywithStripe}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none">

                    {
                        loadingStripe ? (
                            <BiLoader size={18} className="animate-spin" />

                        ) : (
                            <BiCreditCard size={18} />
                        )
                    }
                    pay With Stripe
                </button>
            </div>




        </div >
    );
};

export default CheckOut;