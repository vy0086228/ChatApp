import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { io } from "../socket/socket.js";
import moment from "moment";

// ✅ Send a message between users
export const sendMessage = async (req, res) => {
  try {
    console.log("📥 Incoming request body:", req.body);
    console.log("📥 Incoming request file:", req.file);

    const senderId = req.userId;
    const receiverId = req.params.id;

    let message = req.body?.message || req.body?.text || "";
    message = typeof message === "string" ? message.trim() : "";

    if (!senderId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Sender ID missing." });
    }

    if (!receiverId) {
      return res.status(400).json({ error: "Receiver ID is required." });
    }

    if (senderId === receiverId) {
      return res
        .status(400)
        .json({ error: "Cannot send messages to yourself." });
    }

    if (!message && !req.file) {
      return res
        .status(400)
        .json({ error: "Message text or file is required." });
    }

    // ✅ Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text: message, // ✅ Fixed: Save under `text` instead of `message`
      fileUrl: req.file ? req.file.path : null,
      createdAt: new Date(),
    });

    conversation.messages.push(newMessage._id);
    await conversation.save();

    const formattedMessage = {
      _id: newMessage._id,
      senderId,
      receiverId,
      text: newMessage.text, // ✅ Fixed field name
      fileUrl: newMessage.fileUrl,
      timestamp: newMessage.createdAt,
      formattedTime: moment(newMessage.createdAt).format("hh:mm A"),
    };

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", formattedMessage);
    }

    return res.status(201).json({ newMessage: formattedMessage });
  } catch (error) {
    console.error("❌ sendMessage Error:", error.message);
    return res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

// ✅ Get all messages between two users
export const getMessage = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.id;

    if (!senderId || !receiverId) {
      return res
        .status(400)
        .json({ error: "Sender and receiver IDs are required." });
    }

    console.log(
      `📥 Fetching messages between Sender: ${senderId} and Receiver: ${receiverId}`
    );

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    if (!conversation || conversation.messages.length === 0) {
      console.warn("⚠️ No messages found between users.");
      return res.status(200).json([]); // ✅ Return empty array instead of 404
    }

    const formattedMessages = conversation.messages.map((msg) => ({
      _id: msg._id,
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      text: msg.text || "[Invalid message]", // ✅ Fixed field name
      fileUrl: msg.fileUrl || null,
      timestamp: msg.createdAt || new Date().toISOString(),
      formattedTime: moment(msg.createdAt).format("hh:mm A"),
    }));

    return res.status(200).json(formattedMessages);
  } catch (error) {
    console.error("❌ getMessage Error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
