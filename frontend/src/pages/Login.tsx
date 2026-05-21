
import { useState } from "react";


import { useNavigate } from "react-router-dom";


import { authService } from "../main";


import axios from "axios";


import { toast } from "react-hot-toast";


import { useGoogleLogin } from '@react-oauth/google';


import { FcGoogle } from 'react-icons/fc';


import { UseAppData } from "../context/AppContext";
const Login = () => {


    const [loading, setLoading] = useState(false);


    const navigate = useNavigate();

    const { setUser, setIsAuth } = UseAppData();


    const responseGoogle = async (authResult: any) => {

        setLoading(true)


        try {

            const result = await axios.post(`${authService}/api/auth/login`, {

                code: authResult["code"],
            });


            localStorage.setItem("token", result.data.token)

            toast.success(result.data.message)

            setLoading(false)


            setUser(result.data.user);


            setIsAuth(true);

            navigate("/");

        }

        catch (error) {

            console.log(error);

            toast.error("Problem while login")


            setLoading(false)
        }
    };


    const googleLogin = useGoogleLogin({

        onSuccess: responseGoogle,


        onError: (error) => {
            console.log("Google Login Failed/Cancelled:", error);
        },
        flow: "auth-code"
    });
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">

            <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/40 space-y-6">
                <h1 className="text-center text-4xl font-extrabold text-indigo-600 tracking-tight" >
                    OneClick
                </h1>

                <p className="text-center text-sm text-slate-500 font-medium">
                    Login or sign up to continue
                </p>

                <button onClick={googleLogin} disabled={loading} className="flex w-full items-center
                justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-sm">

                    <FcGoogle size={20} />
                    {
                        loading ? 'Signing in...' : 'Continue with Google'
                    }
                </button>

                <p className="text-center text-xs text-slate-400 font-medium leading-relaxed">
                    By continuing, you agree to our {" "}
                    <span className="text-indigo-600 font-semibold hover:underline cursor-pointer">Terms of Service</span> and {" "}
                    <span className="text-indigo-600 font-semibold hover:underline cursor-pointer">Privacy Policy</span>
                </p>

            </div>
        </div>
    );
};



export default Login
