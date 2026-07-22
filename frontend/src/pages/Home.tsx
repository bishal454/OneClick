import { useSearchParams } from "react-router-dom";
import { UseAppData } from "../context/AppContext"
import { useEffect, useState } from "react";
import type { IRestaurant } from "../types";
import axios from "axios";
import { restaurantService } from "../main";
import RestaurantCard from "../components/RestaurantCard";


const Home = () => {

    const { location } = UseAppData();
    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get("search") || "";
    const CATEGORIES = ["All", "Pizza", "Burger", "Vegan", "Dessert", "Healthy", "Beverages"];
    const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);

    const [loading, setLoading] = useState(true);


    const getDistancekm = (
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number,
    ): number => {
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;

        const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = (R * c).toFixed(2);
        return +distance


    };

    const fetchRestaurants = async () => {
        if (!location?.latitude || !location?.longitude) {
            // alert("You need to give permission of your location to access.");
            return;

        }
        try {
            setLoading(true);

            const { data } = await axios.get(
                `${restaurantService}/api/restaurant/all`,
                {
                    params: {
                        latitude: location.latitude,
                        longitude: location.longitude,
                        search,

                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            )
            setRestaurants(data.restaurants ?? []);



        } catch (error) {
            console.log(error);

        }
        finally {
            setLoading(false);

        }
    }

    useEffect(() => {
        fetchRestaurants();

    }, [location, search]);
    if (loading || !location) {
        return <div className="flex h-[60vh] items-center justify-center ">
            <p className="text-gray-500">Finding restaurants  in your area...</p>
        </div>
    }
    return (

        <div className=" mx-auto max-w-7xl px-4 py-6 space-y-6">

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {CATEGORIES.map((cat) => {
                    const isActive = search.toLowerCase() === cat.toLowerCase() || (search === "" && cat === "All");
                    return (
                        <button
                            key={cat}
                            onClick={() => {
                                if (cat === "All") {
                                    setSearchParams({});
                                } else {
                                    setSearchParams({ search: cat });
                                }
                            }}
                            className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition ${
                                isActive
                                    ? "bg-[#e32447] text-white shadow-md"
                                    : "bg-white text-gray-600 shadow-sm hover:bg-red-50 hover:text-[#e32447]"
                            }`}
                        >
                            {cat}
                        </button>
                    );
                })}
            </div>

            {restaurants.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">

                    {

                        restaurants.map((res) => {


                            const [resLng, resLat] = res.autoLocation.coordinates;

                            const distance = getDistancekm(
                                location.latitude,
                                location.longitude,
                                resLat,
                                resLng
                            );

                            return (
                                <RestaurantCard
                                    key={res._id}
                                    id={res._id}
                                    name={res.name}
                                    description={res.description}
                                    distance={`${distance}`}
                                    image={res.images ?? ""}
                                    isOpen={res.isOpen}



                                />
                            )
                        })
                    }
                </div>
            ) : (
                <div className="flex h-[40vh] flex-col items-center justify-center space-y-2">
                    <p className="text-gray-500">No restaurants found in your area.</p>
                </div>
            )}
        </div>
    )
}


export default Home