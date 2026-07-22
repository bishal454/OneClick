import * as L from "leaflet";

import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";

import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

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
                styles:[{color:"#3b82f6", weight:5}],
            },
            addWaypoints:false,
            draggableWaypoints:false,
            show:false,
            createMarker:()=>null,
            router:L.Routing.osrmv1({
                serviceUrl:"https://router.project-osrm.org/route/v1",
            }),
        }).addTo(map);

        const container = control.getContainer();
        if (container) {
            container.style.display = "none";
        }

        return ()=>{
            map.removeControl(control);
        };
    },[map]);
    return null;

};

interface props{
  riderLocation:[number,number];
  deliveryLocation:[number,number];


}
const UserOrderMap = ({riderLocation,deliveryLocation}:props) => {
  return (
   <div className="rounded-xl bg-white shadow-sm p-3">
           <MapContainer
           center={riderLocation}
           zoom={14}
           className="h-96 w-full rounded-lg">

   <TileLayer attribution="&copy; OpenStreetMap"
   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
   <Marker position={riderLocation} icon={riderIcon}>
       <Popup> Rider</Popup>

   </Marker>

   <Marker position={deliveryLocation} icon={deliveryIcon}>
       <Popup>Delivery Location </Popup>

   </Marker>
   <Routing from={riderLocation} to={deliveryLocation}/>

           </MapContainer>
       </div>
  )
}

export default UserOrderMap
