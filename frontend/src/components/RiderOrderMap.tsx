import * as L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";
import type { IOrder } from "../types";


declare module "leaflet"{
    namespace Routing{
        function control(option:any):any;
        function osrmvl(option:any):any;

    }
}

const riderIcon=new L.DivIcon({
    html:"🛵",
    iconSize:[30,30],
    className:"",
})


const deliveryIcon=new L.DivIcon({
    html:"🏦",
    iconSize:[30,30],
    className:"",
})

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

    const map=
}



const RiderOrderMap = ({order}:Props)=>{
  return (
    <div>RiderOrderMap</div>
  )
}

export default RiderOrderMap
