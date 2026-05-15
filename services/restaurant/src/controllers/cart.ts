import mongoose from "mongoose";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import Cart from "../models/Cart.js";
import TryCatch from "../middlewares/TryCatch.js";

export const addToCart = TryCatch(async (req: AuthenticatedRequest, res) => {

    if (!req.user) {
        return res.status(401).json({
            message: "Please Login",

        });

    }



    const userId = req.user._id;

    const { restaurantId, itemId } = req.body;


    if (!mongoose.Types.ObjectId.isValid(restaurantId) || !mongoose.Types.ObjectId.isValid(itemId)) {

        return res.status(400).json({
            message: "Invalid restaurant and item id",

        });

    }
    const cartFromDifferentRestaurant = await Cart.findOne({
        userId,
        restaurantId: {
            $ne: restaurantId
        },
    });

    if (cartFromDifferentRestaurant) {
        return res.status(400).json({
            message: "You can't add items from different restaurat , so Please clear your cart from the previous restaurant first."
        });

    }

    const cartItem = await Cart.findOneAndUpdate(
        { userId, restaurantId, itemId },

        {

            $inc: { quantity: 1 },
            $setOnInsert: { userId, restaurantId, itemId },



        },

        { upsert: true, new: true, setDefaultOnInsert: true }



    );



    return res.json({

        message: "Item added to cart",
        cart: cartItem,

    });

});



export const fetchMyCart = TryCatch(async (req: AuthenticatedRequest, res) => {

    if (!req.user) {
        return res.status(401).json({
            message: "Please Login",
        });
    }

    const userId = req.user._id;

    const cartItems = await Cart.find({ userId })
        .populate("itemId")
        .populate("restaurantId");


    let subtotal = 0;
    let cartLength = 0;

    for (const cartItem of cartItems) {

        const item: any = cartItem.itemId;
        subtotal += item.price * cartItem.quantity;
        cartLength += cartItem.quantity;

    }
    return res.json({

        success: true,
        cartLength,
        subtotal,
        cart: cartItems,

    });


}); 