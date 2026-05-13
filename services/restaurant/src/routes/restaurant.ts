import { isAuth, isSeller } from "../middlewares/isAuth.js";
import express from "express";
import { addRestaurant } from "../controllers/restaurant.js";


const router = express.Router();

router.post("/new", isAuth, isSeller, addRestaurant)


export default router;
