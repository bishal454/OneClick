
export interface User {
    _id: string;
    name: string;
    email: string;
    image: string;
    role: string;
    id: string;
};

export interface LocationData {

    latitude: number;

    longitude: number;

    // WHY: We need a human-readable address string to display the user's location in the UI.
    // WHAT: Declaring the formattedAddress field as a string type to hold the reverse-geocoded address.
    formattedAddress: string;
}

export interface AppContextType {
    user: User | null;
    loading: boolean;
    isAuth: boolean;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
    location: LocationData | null;
    loadingLocation: boolean;
    city: string;
    cart: ICart[] | null;
    fetchCart: () => Promise<void>;
    subTotal: number;
    quantity: number;
}




export interface IRestaurant {
    _id: string;
    name: string;

    description?: string;
    phone: number;
    images: string;
    ownerId: string;
    isVerified: boolean;

    autoLocation: {
        type: "Point",
        coordinates: [number, number],
        formattedAddress: string;

    }
    isOpen: boolean;
    createdAt: Date;
    updatedAt: Date;
}


export interface IMenuItem {
    _id: string;
    restaurantId: string;
    name: string;
    description: string;
    price: number;
    image?: string;

    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
}


export interface ICart {
    _id: string;
    userId: string;
    restaurantId: string | IRestaurant;
    itemId: string | IMenuItem;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;

}



export interface IOrder {
    _id: string;

    userId: string;
    restaurantId: string,
    restaurantName: string,
    riderId?: string | null;
    riderPhone?: number | null;
    riderName?: string | null;
    distance: number;
    riderAmount: number;



    items: {
        itemId: string,
        name: string,
        price: number,
        quantity: number,
    }[];

    subtotal: number;
    deliveryFee: number;
    platformFee: number,
    totalAmount: number,

    addressId: string,


    deliveryAddress: {
        formattedAddress: string,
        mobile: number,
        latitude: number,
        longitude: number,

    };

    status: "placed"
    | "accepted"
    | "preparing"
    | "ready-for-pickup"
    | "rider-assigned"
    | "picked-up"
    | "delivered"
    | "cancelled";


    paymentMethod: "razorpay" | "stripe";

    paymentStatus: "pending" | "completed" | "failed";

    expiredAt: Date;

    createdAt: Date;
    updatedAt: Date;


}