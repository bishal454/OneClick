import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode
} from "react";
import { io, Socket } from "socket.io-client";
import { realtimeService } from "../main";
import { UseAppData } from "./AppContext";

interface SocketContextType {
    socket: Socket | null,
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const { isAuth } = UseAppData();
    const [socket, setSocket] = useState<Socket | null>(null);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!isAuth) {
            socketRef.current?.disconnect();
            socketRef.current = null;
            setSocket(null);
            return;
        }

        if (socketRef.current) return;

        const newSocket = io(realtimeService, {
            auth: {
                token: localStorage.getItem("token")
            },
            transports: ["websocket"],
        });

        socketRef.current = newSocket;

        newSocket.on("connect", () => {
            console.log("Socket connected", newSocket.id);
            setSocket(newSocket);
        });

        newSocket.on("disconnect", () => {
            console.log("Socket Disconnected");
            setSocket(null);
        });

        newSocket.on("connect_error", (err) => {
            console.log("Connection Error:", err.message);
        });

        return () => {
            newSocket.disconnect();
            socketRef.current = null;
            setSocket(null);
        }

    }, [isAuth]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    )
};

export const useSocket = () => useContext(SocketContext);
