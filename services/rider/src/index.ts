import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";

import { startOrderReadyConsumer } from "./config/orderReady.consumer.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";
import riderRoutes from "./routes/rider.js";

dotenv.config();

await connectRabbitMQ();

startOrderReadyConsumer();

const app = express();

app.use(express.json());

app.use(cors());



app.use("/api/rider", riderRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Rider Service is running on port ${process.env.PORT}`);
    connectDB();

})
