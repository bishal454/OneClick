import { Server } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import { Socket } from "dgram";

let io: Server;

export const initSocket = (server: http.Server) => {
    io = new Server(server, {
        cors: {
            origin: "*",

        },

    });

    io.use((socket, next) => {

        try {
            const token = socket.handshake.auth?.token;
            if (!token) {
                return next(new Error("Unauthorized"));



            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

            if (!decoded || !decoded.user) {
                return next(new Error("Unauthorized"));

            }

            socket.data.user = decoded.user;
            next();

        } catch (error) {
            console.log("❌Socket auth failed : ", error);
            next(new Error("Unauthorized"));


        }
    });
    io.on("connection", (socket) => {
        const user = socket.data.user;

        if (!user) {
            socket.disconnect();
            return;
        }
        const userId = user._id;
        socket.join(`user:${userId}`);

        if (user.restaurantId) {
            socket.join(`restaurant:${user.restaurantId}`);

        }

        // WHY: Allow clients to join specific rooms dynamically (e.g., order:123).
        // WHAT: Listening for join and leave events to manage custom socket rooms.
        socket.on("join", (room: string) => {
            socket.join(room);
        });

        socket.on("leave", (room: string) => {
            socket.leave(room);
        });

        console.log(`User connected:${userId}`);
        console.log("Socket room: ", [...socket.rooms]);

        socket.on("disconnect", () => {
            console.log(`User disconnected : ${userId}`);




        })

    })

    return io;

};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io is not initialized");



    }
    return io;

}
