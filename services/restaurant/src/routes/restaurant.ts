import { isAuth, isSeller } from "../middlewares/isAuth.js";
import express from "express";
import { addRestaurant, fetchMyRestaurant, fetchSingleRestaurant, gtNearbyRestaurant, updateRestaurant, updateStatusRestaurant, getAllRestaurants } from "../controllers/restaurant.js";
import uploadFile from "../middlewares/multer.js";


const router = express.Router();

router.post("/new", isAuth, isSeller, uploadFile, addRestaurant);
router.get("/my", isAuth, isSeller, fetchMyRestaurant);
router.put("/status", isAuth, isSeller, updateStatusRestaurant);
router.put("/edit", isAuth, isSeller, updateRestaurant);
router.get("/all", isAuth, gtNearbyRestaurant);
router.get("/admin/all", isAuth, getAllRestaurants);
router.get("/:id", isAuth, fetchSingleRestaurant);




export default router;
