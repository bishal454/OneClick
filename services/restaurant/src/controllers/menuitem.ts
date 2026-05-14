import axios from "axios";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import TryCatch from "../middlewares/TryCatch.js";
import Restaurant from "../models/Restaurant.js";
import getBuffer from "../config/datauri.js";
import MenuItems from "../models/MenuItems.js";

export const addMenuItem = TryCatch(async (req: AuthenticatedRequest, res) => {


    if (!req.user) {
        return res.status(401).json({
            message: "Please Login",

        });

    }

    const restaurant = await Restaurant.findOne({ OwnerId: req.user._id })

    if (!restaurant) {
        return res.status(404).json({
            message: "NO Restaurant Found",

        });
    }
    const { name, description, price } = req.body;

    if (!name || !price) {
        return res.status(400).json({
            message: "Name and price are required",

        });

    }


    const file = req.file;


    if (!file) {
        return res.status(400).json({
            message: "Please give image for restaurant.",
        });
    }

    const fileBuffer = getBuffer(file);

    if (!fileBuffer?.content) {
        return res.status(500).json({
            message: "Failed  to upload file buffer.",

        });

    }

    const { data: uploadResult } = await axios.post(
        `${process.env.UTILS_SERVICE}/api/upload`,
        {

            buffer: fileBuffer.content,

        }
    );



    const item = await MenuItems.create({
        name,
        description,
        price,
        restaurantId: restaurant._id,
        image: uploadResult.url,
    })
    res.json({
        message: "Item Added Successfully",
        item,

    });


});
