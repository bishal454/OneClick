import axios from "axios";
import * as L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { realtimeService } from "../main";
import type { IOrder } from "../types";





declare module "leaflet" {
    namespace Routing{
        function control(options:any):any;
        function osrmv1(options?:any):any;

    }
}

const riderIcon=new L.DivIcon({
    html:"🛵",
    iconSize:[30,30],
    className:"",
});


const deliveryIcon=new L.DivIcon({
    html:"🏦",
    iconSize:[30,30],
    className:"",
});


interface Props {
    order:IOrder;

}


const Routing =({
    from,
    to
}:{

from:[number,number],
to:[number,number],

})=>{

    const map=useMap();

    useEffect(()=>{
        const control =L.Routing.control({
            waypoints:[L.latLng(from),L.latLng(to)],
            lineOptions:{
                style:[{color:"blue-500", weight:5}],
            },
            addWaypoints:false,
            draggableWaypoints:false,
            show:false,
            createMaker:()=>null,
            router:L.Routing.osrmv1({
                serviceUrl:"https://router.project-osrm.org/route/v1"

            })
        }).addTo(map);
        return ()=>{
            map.removeControl(control);

        }
    },[from,to,map]);
    return null;

};



const RiderOrderMap = ({order}:Props)=>{
    const [riderLocation,setRiderLocation]=useState<[number,number ] | null >(null);

    if(
        order.deliveryAddress.latitude==null ||
        order.deliveryAddress.longitude ==null

    )
    {
        return null;

    }


const deliveryLocation :[number,number ]=[order.deliveryAddress.latitude,
    order.deliveryAddress.longitude
];


useEffect(()=>{
    const fetchLocation =()=>{
        navigator.geolocation.getCurrentPosition((pos)=>{

            const latitude =pos.coords.latitude;
            const longitude=pos.coords.longitude;

            setRiderLocation([latitude,longitude]);

            axios.post(`${realtimeService}/api/v1/internal/emit`,
                {
                    event:"rider:location",
                    room:`user:${order.userId}`,
                    payload:{latitude,longitude},

                },
                {
                    headers:{
                        "x-internal-key":import.meta.env.VITE_INTERNAL_SERVICE_KEY,

                    }
                }
            );

        },(err)=>console.log("Location Error:",err),

    {
        enableHighAccuracy:true,
        maximumAge:5000,
        timeout:10000,

    });
    };
    fetchLocation();
    const interval =setInterval(fetchLocation,10000);

    return()=>clearInterval(interval);

},[order.userId]);

if(!riderLocation)return null;

  return (
    <div className="rounded-xl bg-white shadow-sm p-3">
        <MapContainer
        center={riderLocation}
        zoom={14}
        className="h-87.5 w-full rounded-lg">

<TileLayer attribution="&copy; OpenStreetMap"
url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
<Marker position={riderLocation} icon={riderIcon}>
    <Popup>Your (Rider)</Popup>

</Marker>

<Marker position={deliveryLocation} icon={deliveryIcon}>
    <Popup>Delivery Location </Popup>

</Marker>
<Routing from={riderLocation} to={deliveryLocation}/>

        </MapContainer>
    </div>
  )
}

export default RiderOrderMap
