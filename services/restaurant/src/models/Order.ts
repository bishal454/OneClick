
import mongoose, { Schema, Document } from "mongoose";


export interface IOrder extends Document {
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

    status: "placed" | "accepted" | "preparing" | "ready-for-pickup" | "rider-assigned" | "picked-up" | "delivered" | "cancelled";


    paymentMethod: "razorpay" | "stripe";

    paymentStatus: "pending" | "completed" | "failed";

    expiredAt: Date;

    createdAt: Date;
    updatedAt: Date;


}




const OrderSchema: Schema = new Schema({

    userId: {
        type: String,
        required: true
    },

    restaurantId: {
        type: String,
        required: true
    },
    restaurantName: {
        type: String,
        required: true
    },

    riderId: {
        type: String,
        default: null
    },
    riderPhone: {
        type: Number,
        default: null
    },
    riderName: {
        type: String,
        default: null
    },
    riderAmount: {
        type: Number,
        required: true
    },

    distance: {
        type: Number,
        required: true
    },

    items: [
        {
            itemId: String,
            name: String,
            price: Number,
            quantity: Number,

        },
    ],

    subtotal: {
        type: Number,
        required: true
    },

    deliveryFee: {
        type: Number,
        required: true
    },

    platformFee: {
        type: Number,
        required: true
    },

    totalAmount: {
        type: Number,
        required: true
    },

    addressId: {
        type: String,
        required: true
    },

    deliveryAddress: {
        formattedAddress: {
            type: String,
            required: true
        },
        mobile: {
            type: Number,
            required: true
        },
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        },
    },

    status: {
        type: String,
        enum: ["placed", "accepted", "preparing", "ready-for-pickup", "rider-assigned", "picked-up", "delivered", "cancelled"],
        default: "placed"
    },

    paymentMethod: {
        type: String,
        enum: ["razorpay", "stripe"],
        required: true
    },

    paymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending"
    },

    expiredAt: {
        type: Date,
        index: { expireAfterSeconds: 0 }
    },



},
    {
        timestamps: true,

    });


export default mongoose.model<IOrder>("Order", OrderSchema);


