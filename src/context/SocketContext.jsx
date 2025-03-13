{
  /*import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { setSocketConnected, setSocketDisconnected } from "@/redux/socketSlice";
import { setOnlineUsers } from "@/redux/userSlice";
import { selectUserId } from "@/redux/auth/authSelectors";
import { AuthContext } from "@/redux/auth/AuthContext";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const reconnectTimer = useRef(null);
  const [isSocketConnected, setIsSocketConnected] = useState(true);

  const userId = useSelector(selectUserId);
  const authContext = useContext(AuthContext);
  const token = authContext?.token || null;

  const isReady = Boolean(token && userId);

  const initializeSocket = () => {
    if (!isReady) return;

    if (socketRef.current) {
      console.log("♻️ Cleaning up old socket...");
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    console.log("🔌 Establishing WebSocket connection...");

    const socket = io("http://localhost:8082", {
      withCredentials: true,
      transports: ["websocket"],
      query: { userId },
      auth: { token },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 3000,
    });

    socketRef.current = socket;

    // Debug: Log all socket events
    socket.onAny((event, ...args) => {
      console.log(`📡 [Socket] ${event}:`, args);
    });

    socket.on("connect", () => {
      console.log("✅ Connected to WebSocket:", socket.id);
      setIsSocketConnected(true);
      dispatch(setSocketConnected(socket.id));
      socket.emit("userOnline", userId);
    });

    socket.on("disconnect", (reason) => {
      console.warn("⚠️ Disconnected from WebSocket:", reason);
      setIsSocketConnected(false);
      dispatch(setSocketDisconnected());

      // Attempt reconnection manually if server forcibly disconnects
      if (reason === "io server disconnect") {
        console.warn(
          "⚠️ Server disconnected socket. Attempting manual reconnect..."
        );
        socket.connect();
      }
    });

    socket.on("updateOnlineUsers", (onlineUsers) => {
      dispatch(setOnlineUsers(onlineUsers || []));
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Connection error:", err.message);
    });
  };

  useEffect(() => {
    if (isReady) {
      initializeSocket();
    }

    return () => {
      if (socketRef.current) {
        console.log("🧹 Disconnecting socket on unmount...");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
      }
    };
  }, [userId, token, isReady]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
      {isReady && !isSocketConnected && (
        <p className="text-red-400 text-sm mt-2">
          ⚠️ WebSocket disconnected. Trying to reconnect...
        </p>
      )}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext); */
}

// SocketContext.jsx
// src/context/SocketContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext"; // ✅ Import useAuth hook
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth(); // ✅ Get user from AuthContext

  useEffect(() => {
    if (user?._id) {
      // ✅ Initialize socket connection when user is available
      const newSocket = io("http://localhost:8082", {
        query: { userId: user._id },
      });
      setSocket(newSocket);

      return () => newSocket.disconnect(); // Cleanup on unmount
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
      {!socket && (
        <p className="text-red-400 text-sm mt-2">
          ⚠️ WebSocket disconnected. Trying to reconnect...
        </p>
      )}
    </SocketContext.Provider>
  );
};

// Custom hook to use the socket context
export const useSocket = () => useContext(SocketContext);
