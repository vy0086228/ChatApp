import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { useDispatch, useSelector } from "react-redux";
import { formatChatDate } from "@/utils/momentUtils";
import { useSocket } from "@/context/SocketContext";
import { setMessages as updateReduxMessages } from "@/redux/messageSlice";
import { setOnlineUsers as updateOnlineUsers } from "@/redux/userSlice";
import API from "@/services/api";

const Messages = ({ selectedUser }) => {
  const dispatch = useDispatch();
  const socket = useSocket();
  const scrollRef = useRef(null);

  // Redux State
  const { messages } = useSelector((state) => state.message) || {
    messages: [],
  };
  const { authUser } = useSelector((state) => state.user);

  // ✅ Early return if user context is missing
  if (!authUser) {
    return (
      <div className="text-center text-gray-500 text-sm">
        ⏳ Waiting for user context...
      </div>
    );
  }

  // Local State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch messages when selectedUser changes
  useEffect(() => {
    if (!selectedUser?._id) {
      console.warn("⚠ No selected user, clearing messages.");
      dispatch(updateReduxMessages([]));
      return;
    }

    const fetchMessages = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await API.get(`/messages/${selectedUser._id}`);
        if (!data || !Array.isArray(data))
          throw new Error("Invalid message format.");
        if (data.length === 0) setError("No messages found.");
        dispatch(updateReduxMessages(data));
      } catch (error) {
        setError("Failed to fetch messages.");
        dispatch(updateReduxMessages([]));
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedUser?._id, dispatch]);

  // ✅ Listen for online users (safe)
  useEffect(() => {
    if (socket && typeof socket.on === "function") {
      const handleOnlineUsers = (onlineUsers) =>
        dispatch(updateOnlineUsers(onlineUsers));

      socket.on("updateOnlineUsers", handleOnlineUsers);
      return () => socket.off("updateOnlineUsers", handleOnlineUsers);
    }
  }, [socket, dispatch]);

  // ✅ Listen for new messages (safe)
  useEffect(() => {
    if (socket && typeof socket.on === "function") {
      const handleNewMessage = (newMsg) => {
        if (newMsg && typeof newMsg === "object") {
          dispatch(updateReduxMessages((prev) => [...prev, newMsg]));
        }
      };

      socket.on("receiveMessage", handleNewMessage);
      return () => socket.off("receiveMessage", handleNewMessage);
    }
  }, [socket, dispatch]);

  // 🔽 Scroll to bottom when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Filter and group messages
  const validMessages = (messages || [])
    .map((msg) => {
      if (!msg || !msg._id) return null;
      const hasContent = msg.text?.trim() || msg.fileUrl;
      const timestamp = msg.timestamp || msg.createdAt || msg.updatedAt;
      if (!hasContent || !timestamp) return null;
      return { ...msg, timestamp };
    })
    .filter(Boolean);

  const groupedMessages = validMessages.reduce((groups, message) => {
    const dateKey = formatChatDate(message.timestamp);
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(message);
    return groups;
  }, {});

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 py-2 space-y-2">
      {loading && <p>Loading messages...</p>}
      {error && <p className="text-center text-gray-500">❌ {error}</p>}
      {!loading && !error && validMessages.length === 0 && (
        <p className="text-center text-gray-500">No messages found</p>
      )}

      {Object.entries(groupedMessages).map(([date, msgs]) => (
        <div key={date}>
          <div className="text-center text-xs text-gray-500 py-2">{date}</div>
          {msgs.map((msg, i) => (
            <Message
              key={msg._id || `msg-${i}`}
              message={msg}
              isOwn={msg.senderId === authUser?._id}
            />
          ))}
        </div>
      ))}

      <div ref={scrollRef} />
    </div>
  );
};

export default Messages;
