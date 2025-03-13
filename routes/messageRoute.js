import express from "express";
import multer from "multer";
import { sendMessage, getMessage } from "../controllers/messageController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { Message } from "../models/messageModel.js";

const router = express.Router();

// ✅ Setup Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

/**
 * ✅ Send Message API
 * POST /messages/send/:receiverId
 */
router.post(
  "/send/:receiverId",
  isAuthenticated,
  upload.single("file"),
  async (req, res) => {
    try {
      const senderId = req.userId;
      const receiverId = req.params.receiverId;
      let text = req.body.text?.trim() || "";
      const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

      // ✅ Validation Checks
      if (!senderId)
        return res.status(400).json({ message: "Sender ID is required." });
      if (!receiverId)
        return res.status(400).json({ message: "Receiver ID is required." });
      if (!text && !fileUrl)
        return res
          .status(400)
          .json({ message: "Message text or file is required." });
      if (senderId === receiverId)
        return res
          .status(400)
          .json({ message: "Cannot send a message to yourself." });

      // ✅ If only a file is attached, set a default message
      if (!text && fileUrl) {
        text = "[File Attached]";
      }

      console.log("📩 Incoming message:", {
        senderId,
        receiverId,
        text,
        fileUrl,
      });

      // ✅ Save message in DB
      const newMessage = new Message({
        senderId,
        receiverId,
        text,
        fileUrl,
        timestamp: new Date(),
      });

      const savedMessage = await newMessage.save();
      console.log("✅ Message saved:", savedMessage);

      return res
        .status(201)
        .json({
          success: true,
          message: "Message sent!",
          newMessage: savedMessage,
        });
    } catch (error) {
      console.error("❌ Error sending message:", error);
      return res
        .status(500)
        .json({ message: "Failed to send message", error: error.message });
    }
  }
);

/**
 * ✅ Get Messages API (Fetch chat history)
 * GET /messages/:receiverId
 */
router.get("/:receiverId", isAuthenticated, async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.receiverId;

    if (!senderId || !receiverId) {
      return res
        .status(400)
        .json({ message: "Sender and receiver IDs are required." });
    }

    console.log(`📡 Fetching messages between ${senderId} and ${receiverId}`);

    // ✅ Fetch messages between sender & receiver
    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    })
      .sort({ createdAt: 1 })
      .lean(); // ✅ Convert Mongoose docs to plain JSON

    // ✅ Filter out invalid messages
    const validMessages = messages.filter(
      (msg) => msg.text?.trim() || msg.fileUrl
    );

    console.log("📡 Sending valid messages:", validMessages);
    return res.status(200).json(validMessages);
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch messages", error: error.message });
  }
});

export default router;
