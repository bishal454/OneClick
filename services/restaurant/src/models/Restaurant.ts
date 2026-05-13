import { Timestamp } from "mongodb";
import mongoose, { Document, Schema } from "mongoose";

export interface IRestaurant extends Document {
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

}


const schema: Schema<IRestaurant> = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,

    },
    description: {
        type: String,

    },
    phone: {
        type: Number,
        required: true,
    },
    images: {
        type: String,
        required: true,
    },
    ownerId: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        required: true,
    },
    autoLocation: {
        type: {
            type: String,
            enum: ["Point"],
            required: true

        },
        coordinates: {
            type: [Number],
            required: true,
        },
        formattedAddress: {
            type: String,
            required: true,
        }
    },
    isOpen: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
schema.index({ autoLocation: "2dsphere" });

export default mongoose.model<IRestaurant>("Restaurant", schema);


