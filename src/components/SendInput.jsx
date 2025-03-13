import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "@/context/SocketContext";
import { setMessages as setMessagesRedux } from "@/redux/messageSlice";
import API from "../services/api";
import { FaPaperclip, FaPaperPlane } from "react-icons/fa";

const SendInput = ({ setMessages }) => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const [isSocketConnected, setIsSocketConnected] = useState(true);

  const { socket } = useSocket() || {};
  const socketRef = useRef(null);

  const authUser = useSelector((state) => state.user?.authUser || null);
  const selectedUser = useSelector((state) => state.user?.selectedUser || null);
  const { messages } = useSelector((store) => store.message);
  const authToken = localStorage.getItem("authToken");

  const senderId = authUser?._id;
  const receiverId = selectedUser?._id;

  useEffect(() => {
    if (socket && typeof socket.on === "function") {
      socketRef.current = socket;
      setIsSocketConnected(socket.connected);

      const handleConnect = () => {
        console.log("✅ WebSocket Connected.");
        setIsSocketConnected(true);
      };

      const handleDisconnect = () => {
        console.warn("❌ WebSocket Disconnected.");
        setIsSocketConnected(false);
      };

      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);

      return () => {
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
      };
    }
  }, [socket]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!socketRef.current || !socketRef.current.connected) {
      console.error("❌ WebSocket is not connected. Cannot send message.");
      return;
    }

    if (!senderId || !receiverId) {
      console.error("❌ Missing sender or receiver ID.");
      return;
    }

    if (!message.trim() && !file) {
      console.error("❌ Message or file is required.");
      return;
    }

    const finalMessage = message.trim();
    const finalFile = file || null;

    const formData = new FormData();
    formData.append("text", finalMessage);
    formData.append("senderId", senderId);
    formData.append("receiverId", receiverId);
    if (finalFile) formData.append("file", finalFile);

    const tempMessage = {
      _id: Date.now(),
      senderId,
      receiverId,
      text: finalMessage,
      fileUrl: finalFile ? URL.createObjectURL(finalFile) : null,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);
    dispatch(setMessagesRedux([...messages, tempMessage]));

    try {
      const res = await API.post(`/message/send/${receiverId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
        withCredentials: true,
      });

      const newMessage = res.data?.newMessage;

      dispatch(
        setMessagesRedux([
          ...messages.filter((m) => m._id !== tempMessage._id),
          newMessage,
        ])
      );

      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit("sendMessage", newMessage || tempMessage);
        console.log(
          "📩 Message sent via WebSocket:",
          newMessage || tempMessage
        );
      } else {
        console.warn("⚠️ Socket disconnected before emit.");
      }
    } catch (error) {
      console.error("❌ Error sending message:", error.response?.data || error);
    }

    setMessage("");
    setFile(null);
  };

  return (
    <form onSubmit={sendMessage} className="px-4 my-3">
      <div className="w-full relative">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Send a message..."
          className="border text-sm rounded-lg block w-full p-3 border-zinc-500 bg-gray-600 text-white"
          disabled={!isSocketConnected}
        />

        <input
          type="file"
          id="fileInput"
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
        />

        {file && (
          <div className="text-xs text-gray-400 mt-2">
            📎 {file.name} ({(file.size / 1024).toFixed(2)} KB)
          </div>
        )}

        <label
          htmlFor="fileInput"
          className="absolute flex inset-y-1 justify-between gap-10 end-0 items-center pr-15 hover:bg-gray-700 hover:text-white transition duration-300 cursor-pointer text-white p-4 rounded"
        >
          <FaPaperclip className="text-gray-500" size={20} />
        </label>

        <button
          type="submit"
          className="absolute flex inset-y-0 end-0 items-center pr-4 hover:bg-gray-700 hover:text-white transition duration-300 cursor-pointer text-white p-2 rounded"
          disabled={!isSocketConnected}
        >
          <FaPaperPlane />
        </button>
      </div>

      {!isSocketConnected && (
        <p className="text-red-400 text-sm mt-2">
          ⚠️ WebSocket disconnected. Trying to reconnect...
        </p>
      )}
    </form>
  );
};

export default SendInput;
