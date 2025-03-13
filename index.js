{
  /*import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import moment from "moment";

import connectDB from "./config/database.js";
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js";
import { Message } from "./models/messageModel.js";
import { formatChatDate } from "./utils/momentUtils.js";

// Connect DB
(async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  }
})();

// Express app and server
const app = express();
const server = http.createServer(app);

// WebSocket server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/messages", messageRoute);

// Error Handlers
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});

// Online Users Map
const onlineUsers = new Map();

// WebSocket Events
io.on("connection", async (socket) => {
  const userId = socket.handshake.query?.userId;
  if (!userId) {
    console.warn("❌ Missing userId in query");
    socket.disconnect(true);
    return;
  }

  console.log(`🟢 User connected: ${userId} (${socket.id})`);

  // Replace old socket if user reconnects
  const oldSocketId = onlineUsers.get(userId);
  if (oldSocketId && oldSocketId !== socket.id) {
    const oldSocket = io.sockets.sockets.get(oldSocketId);
    if (oldSocket) oldSocket.disconnect(true);
  }

  onlineUsers.set(userId, socket.id);
  io.emit("updateOnlineUsers", [...onlineUsers.keys()]);

  // Deliver any pending messages
  await deliverStoredMessages(userId, socket.id);

  // Listen for messages
  socket.on("sendMessage", async (data) => {
    const { senderId, receiverId, text, fileUrl } = data;
    if (!senderId || !receiverId || (!text && !fileUrl)) return;

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text: text?.trim() || "[File Attached]",
      fileUrl: fileUrl || null,
      delivered: false,
    });

    const formatted = {
      _id: newMessage._id,
      senderId,
      receiverId,
      text: newMessage.text,
      fileUrl: newMessage.fileUrl,
      timestamp: newMessage.createdAt,
      formattedTime: moment(newMessage.createdAt).format("hh:mm A"),
      formattedDate: formatChatDate(newMessage.createdAt),
    };

    const targetSocketId = onlineUsers.get(receiverId);
    const isOnline = targetSocketId && io.sockets.sockets.get(targetSocketId);

    if (isOnline) {
      io.to(targetSocketId).emit("receiveMessage", formatted);
      await Message.findByIdAndUpdate(newMessage._id, { delivered: true });
      console.log(`📤 Message delivered to ${receiverId}`);
    } else {
      console.log(`📥 Stored message for offline user ${receiverId}`);
    }
  });

  socket.on("disconnect", () => {
    if (onlineUsers.get(userId) === socket.id) {
      onlineUsers.delete(userId);
      io.emit("updateOnlineUsers", [...onlineUsers.keys()]);
      console.log(`🔴 User disconnected: ${userId} (${socket.id})`);
    }
  });
});

// Deliver stored messages
const deliverStoredMessages = async (userId, socketId) => {
  try {
    const messages = await Message.find({
      receiverId: userId,
      delivered: false,
    });
    if (!messages.length) return;

    for (const msg of messages) {
      io.to(socketId).emit("receiveMessage", {
        _id: msg._id,
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        text: msg.text,
        fileUrl: msg.fileUrl,
        timestamp: msg.createdAt,
        formattedTime: moment(msg.createdAt).format("hh:mm A"),
        formattedDate: formatChatDate(msg.createdAt),
      });
      await Message.findByIdAndUpdate(msg._id, { delivered: true });
    }
    console.log(
      `📨 Delivered ${messages.length} pending messages to ${userId}`
    );
  } catch (err) {
    console.error("❌ Error delivering messages:", err.message);
  }
};

// Launch server
const PORT = process.env.PORT || 8082;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
*/
}

import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/database.js";
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js";
import { app, server } from "./socket/socket.js";
dotenv.config();

// Connect DB
(async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  }
})();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/messages", messageRoute);

// Error Handlers
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});

// Launch server
const PORT = process.env.PORT || 8082;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
