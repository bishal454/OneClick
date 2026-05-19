import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { fetchMyprofile, toggleRiderAvailability } from "../controllers/rider.js";


const router = express.Router()


router.get("/myprofile", isAuth, fetchMyprofile);

router.patch("toggle", isAuth, toggleRiderAvailability)
export default router;
