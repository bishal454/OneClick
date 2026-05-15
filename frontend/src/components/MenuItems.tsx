import { useState } from "react";
import type { IMenuItem } from "../types"
import axios from "axios";
import { restaurantService } from "../main";
import { BsCartPlus, BsEye } from "react-icons/bs";
import { FiEyeOff } from "react-icons/fi";
import { BiTrash } from "react-icons/bi";
import { VscLoading } from "react-icons/vsc";
import toast from "react-hot-toast";




interface MenuItemsProps {
    items: IMenuItem[];
    onItemDeleted: () => void;
    isSeller?: boolean




}

const MenuItems = ({ items, onItemDeleted, isSeller }: MenuItemsProps) => {
    const [loadingItemId, setLoadingItemId] = useState<string | null>(null);

    const toggleAvailability = async (itemId: string) => {
        try {
            setLoadingItemId(itemId);
            const { data } = await axios.put(`${restaurantService}/api/item/status/${itemId}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            toast.success(data.message);
            onItemDeleted();
        } catch (error) {
            console.log(error);
            toast.error("Failed to update status.")
        } finally {
            setLoadingItemId(null);
        }
    };

    const handleDelete = async (itemId: string) => {
        const confirm = window.confirm("Are you sure you want to delete this item?")
        if (!confirm) return;
        try {
            setLoadingItemId(itemId);
            await axios.delete(`${restaurantService}/api/item/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            toast.success("Item deleted successfully.");

            onItemDeleted();
        } catch (error) {
            console.log(error);
            toast.error("Failed to deleted Item.");

        } finally {
            setLoadingItemId(null);
        }
    };


    return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => {
            const isLoading = loadingItemId === item._id;
            return (
                <div
                    className={`relative flex gap-4 rounded-lg bg-white shadow-sm  transition ${!item.isAvailable ? "opacity-70 " :
                        ""
                        }`}>

                    <div className="relative shrink-0 ">
                        <img src={item.image}
                            alt={item.name} className={`h-20 w-20 rounded object-cover ${!item.isAvailable ? "grayscale brightness-75 " : ""
                                }`} />
                        {!item.isAvailable && (
                            <span className="absolute inset-0 flex items-center justify-center rounded bg-black/60 text-[10px] font-semibold text-white"> Not Available</span>
                        )}
                    </div>


                    <div className="flex flex-1 flex-col justify-center py-2 pr-2">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">{item.name}</h3>
                            <span className="font-bold text-black-500">₹{item.price}</span>
                        </div>
                        <p className="mt-1 line-clamp-1 text-xs text-gray-500">{item.description}</p>

                        {isSeller && (
                            <div className="mt-2 flex gap-4">
                                <button
                                    onClick={() => toggleAvailability(item._id)}
                                    disabled={isLoading}
                                    className={`rounded px-2 py-1 text-[10px] font-medium text-white transition ${item.isAvailable ? "bg-green-300 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"
                                        }`}
                                >
                                    {isLoading ? "..." : item.isAvailable ? (<BsEye size={18} />) : (<FiEyeOff size={18} />)}</button>
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    disabled={isLoading}
                                    className="rounded bg-blue-300 px-2 py-1 text-[10px] font-medium text-white transition hover:bg-blue-600"
                                >
                                    <BiTrash size={18} />

                                </button>
                            </div>
                        )}


                        {
                            !isSeller && (

                                <button
                                    disabled={!item.isAvailable || isLoading}
                                    onClick={() => { }}
                                    className={`flex items-center justify-center rounded-lg p-2  ${!item.isAvailable || isLoading ?
                                        "cursor-not-allowed  text-gray-500"
                                        : "text-blue-500 hover:bg-blue-50"

                                        }`}

                                >

                                    {isLoading ? (
                                        <VscLoading size={18} className="animate-spin" />

                                    ) :
                                        (
                                            <BsCartPlus size={18} />

                                        )}
                                </button>
                            )
                        }





                    </div>

                </div>
            );
        })}
    </div>
};




export default MenuItems