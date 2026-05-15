import { useNavigate } from "react-router-dom";

type RestaurantCardProps = {
    id: string;
    name: string;
    description?: string;
    distance: string;
    image: string;
    isOpen: boolean;
}

const RestaurantCard = ({ id, name, description, distance, image, isOpen }: RestaurantCardProps) => {
    const navigate = useNavigate();





    return (
        <div
            className={`cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md ${!isOpen ? "opacity-75" : ""
                }`}
            onClick={() => navigate(`/restaurant/${id}`)}
        >
            <div className="relative h-40 w-full overflow-hidden">
                <img src={image} alt="image" className={`h-full w-full object-cover transition duration-300 hover:scale-105 ${!isOpen ? "grayscale" : ""}`} />



                {
                    !isOpen && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <span className="rounded-md bg-black/80 px-3 py-1 font-semibold text-sm  text-white">
                                Closed </span>
                        </div>
                    )

                }
            </div>



            <div className="p-3 space-y-1">
                <h3 className="truncate text-base font-semibold text-gray-800">
                    {name}

                </h3>
                <p className="text-gray-600 text-sm" > {description}</p>
                <p className="text-gray-600 text-sm" > {distance}km away </p>

            </div>
        </div>

    );
};

export default RestaurantCard;