import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { riderService } from "../main";

interface Props{
    orderId:string,
    OnAccepted:()=>void;

}


const RiderOrderRequest=({orderId, OnAccepted}:Props

)=>{

const [accepting,setAccepting]=useState(false);
const[secondsLeft,setSecondsLeft]=useState(10);

useEffect(()=>{
    const  interval=setInterval(()=>{
        setSecondsLeft((prev)=>{
            if(prev<=1){
                clearInterval(interval);
                OnAccepted();
                return 0;


            }
            return prev -1;

        });

    },1000)

    return ()=>clearInterval(interval);

},[OnAccepted]);


const acceptOrder=async()=>{
    try {
        await axios.post(`${riderService}/api/rider/accept/${orderId}`,{},{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}`
                },
            }
        );
        toast.success("Order Accepted");
        OnAccepted();


    } catch (error:any) {
        toast.error(error.response.data.message);
OnAccepted();


    }finally{

    }setAccepting(false);

}

return (


        <div className="rounded-xl bg-white p-4 shadowsm border border-green-300 space-y-3">

            <p className="text-center text-xs font-semibold text-green-600">
                Accept within {secondsLeft}</p>

    <p className="text-center text-xs font-semibold text-blue
    -600">
                New Delivery Request </p>

                <p className="text-xs text-gray-600">
                    Order ID:<b>{orderId.slice(-6)}</b>

                </p>
                <button disabled ={accepting}
                onClick={acceptOrder}
                className="w-full rounded-lg bg-gree-600 py-2 text-sm font-semibold text-white hover:bg-green-500  disabled:opacity-50">{
                    accepting?"Accepting...":"Accept Order"}</button>


                </div>
    )

}

export default RiderOrderRequest
