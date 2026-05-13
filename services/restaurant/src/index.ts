import express from "express";

import connectDB from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();


const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Resturant service is running on port ${PORT}`)
    connectDB();
});







