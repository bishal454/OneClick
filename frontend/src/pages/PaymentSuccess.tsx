import { useNavigate, useParams } from "react-router-dom"
import { UseAppData } from "../context/AppContext";
import { useEffect } from "react";
import { BiCheckCircle } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";


const PaymentSuccess = () => {
    const { paymentId } = useParams<{ paymentId: string }>();
    const navigate = useNavigate();
    const { fetchCart } = UseAppData();

    useEffect(() => {


        fetchCart();

    }, [])
    return (
        <div className="flex min-h-[70vh] items-center justify-center px-4 bg-slate-50">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 border border-slate-100 shadow-xl shadow-slate-100/50 text-center space-y-6">
                <BiCheckCircle size={72} className="mx-auto text-emerald-500 animate-pulse" />
                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Payment Successful</h1>
                <p className="text-slate-500 font-medium">Your order has been placed successfully 🎉</p>

                {
                    paymentId && (
                        <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                            <span className="text-slate-400 block text-xs font-semibold uppercase tracking-wider mb-1">Payment ID</span>
                            <span className="font-mono text-sm text-slate-700 font-semibold">{paymentId}</span>
                        </div>
                    )
                }

                <div className="space-y-3 pt-2">
                    <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                        onClick={() => {
                            navigate("/")
                        }}>
                        Order More <BsArrowRight size={16} />
                    </button>

                    <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-100 hover:shadow-emerald-200 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                        onClick={() => {
                            navigate("/orders")
                        }}>
                        My Orders <BsArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PaymentSuccess