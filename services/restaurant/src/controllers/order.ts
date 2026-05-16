import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import TryCatch from "../middlewares/TryCatch.js";
import Address from "../models/Address.js";
import Cart from "../models/Cart.js";
import { IMenuItem } from "../models/MenuItems.js";
import Order from "../models/Order.js";
import Restaurant, { IRestaurant } from "../models/Restaurant.js";

export const createOrder = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user;

    if (!user) {
        return res.status(404).json({ message: "User not found" });

    }

    const { paymentMethod, addressId, distance } = req.body


    if (!addressId) {
        return res.status(400).json({ message: "Address is required" });
    }

    const address = await Address.findOne({

        _id: addressId,
        userId: user._id,


    });

    if (!address) {
        return res.status(404).json({
            message: "Address not Found",
        });

    }

    const cartItems = await Cart.find({ userId: user._id })
        .populate<{ itemId: IMenuItem }>("itemId")
        .populate<{ restaurantId: IRestaurant }>("restaurantId");

    if (cartItems.length === 0) {
        return res.status(400).json({
            message: "Cart is empty",
        });
    }

    const firstCartItem = cartItems[0];

    if (!firstCartItem || !firstCartItem.restaurantId) {
        return res.status(400).json({
            message: "Invalid Cart Data",
        });
    }


    const restaurantId = firstCartItem.restaurantId._id;



    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
        return res.status(404).json({
            message: "Restaurant not found with this id ",
        });
    }



    if (!restaurant.isOpen) {
        return res.status(404).json({
            message: "Restaurant is closed",
        });
    }




    let subtotal = 0;

    const orderItems = cartItems.map((cartItem) => {
        const item = cartItem.itemId;

        if (!item) {
            throw new Error("Invalid cart Item");

        }
        const itemTotal = item.price * cartItem.quantity;

        subtotal += itemTotal;

        return {
            itemId: item._id.toString(),
            name: item.name,
            quantity: cartItem.quantity,
            price: item.price,

        };




    });

    const deliveryFee = subtotal > 250 ? 49 : 0;
    const platformFee = 10;
    const totalAmount = subtotal + deliveryFee + platformFee;

    const expiredAt = new Date(Date.now() + 15 * 60 * 1000);

    const [longitude, latitude] = address.location.coordinates;


    const riderAmount = Math.ceil(distance) * 16;

    const order = await Order.create({


        userId: user._id.toString(),
        restaurantId: restaurantId.toString(),
        restaurantName: restaurant.name,
        riderId: null,
        riderName: null,
        riderPhone: null,
        distance,
        riderAmount,
        items: orderItems,
        subtotal,
        deliveryFee,
        platformFee,
        totalAmount,
        addressId: address._id.toString(),
        deliveryAddress: {
            formattedAddress: address.formattedAddress,
            mobile: address.mobile,
            latitude,
            longitude,

        },
        paymentMethod,
        paymentStatus: "pending",
        status: "placed",
        expiredAt,

    });

    await Cart.deleteMany({ userId: user._id });

    res.json({
        message: "Order placed successfully",
        orderId: order._id.toString(),
        amount: totalAmount,

    });
});



export const fetchOrderForPayment = TryCatch(async (req, res) => {


    if (req.headers["x-internal_key"] !== process.env.INTERNAL_SERVICE_KEY) {
        return res.status(403).json({
            message: "Forbidden",

        });

    }

    const order = await Order.findById(req.params.id)


    if (!order) {

        return res.status(404).json({
            message: "Order not Found",
        });

    }

    if (order.paymentStatus !== "pending") {
        return res.status(400).json({
            message: "Order already paid",

        });

    }

    res.json({
        orderId: order._id,
        amount: order.totalAmount,
        currency: "INR"
    });

});