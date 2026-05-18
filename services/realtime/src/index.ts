import express from "express";
import dotenv from "dotenv";

import http from "http";
// import { Server } from "socket.io";
import cors from "cors";
import { initSocket } from "./socket.js";
import internalRoute from "./routes/internal.js";


dotenv.config();

const app = express();

app.use(cors());


app.use(express.json());



app.use("/api/v1/internal", internalRoute)

const server = http.createServer(app);

initSocket(server);


server.listen(process.env.PORT, () => {
    console.log(`Realtime service is running on port ${process.env.PORT}`);

});
