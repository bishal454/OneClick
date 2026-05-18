import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom"
import { utilsService } from "../main";
import toast from "react-hot-toast";

const OrderSuccess = () => {
    const [params] = useSearchParams();
    const sessionId = params.get("session_id");

    const [loading, setLoading] = useState(true);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [paymentId, setPaymentId] = useState<string | null>(null);

    useEffect(() => {
        const verifyPayment = async () => {
            if (!sessionId) {
                setLoading(false);
                return;
            }
            try {
                const { data } = await axios.post(`${utilsService}/api/payment/stripe/verify`, { sessionId });
                setOrderId(data.orderId);
                setPaymentId(data.paymentId);
                toast.success("Payment successful 🎉");
            }
            catch (error) {
                toast.error("Stripe verification failed ❌");
                console.log(error);
            }
            finally {
                setLoading(false);
            }
        };
        verifyPayment();
    }, [sessionId]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center space-y-6">
                {loading ? (
                    <div className="space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="text-slate-500 font-medium">Verifying your payment, please wait...</p>
                    </div>
                ) : (
                    <>
                        <h1 className="text-3xl font-bold text-emerald-600">Order Confirmed!</h1>

                        {sessionId && orderId ? (
                            <div className="space-y-4 text-left">
                                <p className="text-slate-700 text-center font-medium">
                                    Thank you for your order. Your payment has been verified successfully. 🎉
                                </p>

                                <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-3">
                                    <div>
                                        <span className="text-slate-400 block text-xs font-semibold uppercase tracking-wider">Order ID</span>
                                        <span className="font-mono text-sm text-slate-800 font-bold">{orderId}</span>
                                    </div>
                                    {paymentId && (
                                        <div className="border-t border-slate-200/60 pt-2">
                                            <span className="text-slate-400 block text-xs font-semibold uppercase tracking-wider">Transaction ID</span>
                                            <span className="font-mono text-sm text-slate-600 font-semibold">{paymentId}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className="text-slate-500 font-medium">
                                Order ID or payment details not found.
                            </p>
                        )}

                        <div className="space-y-4 pt-2">
                            <button
                                onClick={() => window.location.href = "/"}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition shadow-lg shadow-indigo-100 hover:shadow-indigo-200 cursor-pointer"
                            >
                                Go to Home
                            </button>

                            <button
                                onClick={() => window.location.href = "/orders"}
                                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 rounded-xl transition cursor-pointer"
                            >
                                View My Orders
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default OrderSuccess