import axios from "axios";
import getBuffer from "../config/datauri.js";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import TryCatch from "../middlewares/TryCatch.js";
import { Rider } from "../model/Rider.js";

export const addRiderProfile = TryCatch(
    async (req: AuthenticatedRequest, res) => {

        const user = req.user;

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        if (user.role !== "rider") {
            return res.status(403).json({
                message: "Only riders can create rider profile"
            })
        }


        const file = req.file;

        if (!file) {
            return res.status(400).json({
                message: "Rider Image is Required",
            });
        }

        const fileBuffer = getBuffer(file);

        if (!fileBuffer?.content) {
            return res.status(500).json({
                message: "failed to generate image buffer",
            });
        }

        const { data: uploadResult } = await axios.post(
            `${process.env.UTILS_SERVICE}/api/upload`,
            {
                buffer: fileBuffer.content,


            },
        );

        const { phoneNumber,
            aadharNumber,
            drivingLicenseNumber,
            latitude,
            longitude } = req.body;

        if (!phoneNumber || !drivingLicenseNumber || !aadharNumber || latitude === undefined || longitude === undefined) {

            return res.status(400).json({
                message: "All Fields Are Required",
            })
        };

        const existingProfile = await Rider.findOne({
            userId: user._id,

        });

        if (existingProfile) {
            return res.status(400).json({
                message: "Rider profile already exists"
            });

        }
        const riderProfile = await Rider.create({
            userId: user._id,
            picture: uploadResult.url,
            phoneNumber,
            aadharNumber,
            drivingLicenseNumber,
            location: {
                type: "Point",
                coordinates: [
                    longitude,
                    latitude
                ],
            },
            isAvailable: false,
            isVerified: false,
        });

        return res.status(201).json({
            message: "Rider profile created successfully",
            riderProfile,
        });

    }

);

export const fetchMyprofile = TryCatch(async (req: AuthenticatedRequest, res) => {

    const user = req.user;

    if (!user) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    const account = await Rider.findOne({
        userId: user._id,
    });

    if (!account) {
        return res.status(404).json({
            message: "Rider profile not found",
        });
    }

    return res.status(200).json({
        message: "Rider profile fetched successfully",
        account,
    });

});


export const toggleRiderAvailability = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    if (user.role !== "rider") {
        return res.status(403).json({
            message: "Only riders can create rider profile"
        })
    }


    const { isAvailable, latitude, longitude } = req.body;


    if (typeof isAvailable !== "boolean") {

        return res.status(400).json({
            message: "Invalid isAvailable value",
        });
    }


    if (latitude === undefined || longitude === undefined) {
        return res.status(400).json({
            message: "Latitude and longitude are required when toggling availability",
        });
    }

    if (typeof latitude !== "number" || typeof longitude !== "number") {
        return res.status(400).json({
            message: "Invalid latitude or longitude value",
        });
    }


    const rider = await Rider.findOne({
        userId: user._id,
    });

    if (!rider) {
        return res.status(404).json({
            message: "Rider profile not found",
        });
    }

    if (!isAvailable && !rider.isVerified) {
        return res.status(403).json({
            message: "Rider is not verified",
        });
    }




    rider.isAvailable = isAvailable;
    rider.location = {
        type: "Point",
        coordinates: [longitude, latitude],
    };
    await rider.save();

    return res.status(200).json({
        message: isAvailable ? "Rider  is now online " : "Rider is now offline",
        rider,
    });

});
