{
  /*import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import moment from "moment";

const Message = ({ message, prevMessage, nextMessage }) => {
  // ✅ Validate message before rendering
  if (
    !message ||
    typeof message !== "object" ||
    (!message.text?.trim() && !message.fileUrl)
  ) {
    console.warn("❌ Skipping invalid message:", message);
    return null; // Stop rendering invalid messages
  }

  console.log("✅ Rendering message:", message);

  const scroll = useRef();
  const { authUser, selectedUser } = useSelector((store) => store.user);

  // ✅ Auto-scroll to the latest message
  useEffect(() => {
    if (scroll.current) {
      scroll.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [message]);

  const isSentByAuthUser = message.senderId === authUser?._id;
  const isSameSender = prevMessage?.senderId === message.senderId;
  const isNextSameSender = nextMessage?.senderId === message.senderId;

  const formatTime = (timestamp) =>
    timestamp ? moment(timestamp).format("hh:mm A") : "⏳";

  return (
    <div
      ref={scroll}
      className={`chat flex w-full items-end ${
        isSentByAuthUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isSentByAuthUser && !isSameSender && selectedUser?.profilePhoto && (
        <div className="w-10 h-10 rounded-full overflow-hidden mr-2">
          <img
            src={selectedUser.profilePhoto}
            alt="Receiver Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div
        className={`relative px-4 py-2 shadow-md text-sm max-w-10px sm:max-w-10px flex flex-col gap-2 justify-between ${
          isSentByAuthUser ? "bg-blue-600 text-white" : "bg-gray-200 text-black"
        }`}
      >
        <p className="flex items-end justify-between gap-2 text-sm">
          <span className="break-words">
            {message.text?.trim() || "📎 Attachment received"}
          </span>
        </p>

        {!isNextSameSender && message.timestamp && (
          <span className="flex text-[11px] text-gray-500 text-left whitespace-nowrap">
            {formatTime(message.timestamp)}
          </span>
        )}
      </div>

      {isSentByAuthUser && !isSameSender && authUser?.profilePhoto && (
        <div className="w-10 h-10 rounded-full overflow-hidden ml-2">
          <img
            src={authUser.profilePhoto}
            alt="Your Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default Message; */
}

import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import moment from "moment";

const Message = ({ message, prevMessage, nextMessage }) => {
  const scroll = useRef();
  const { authUser, selectedUser } = useSelector((store) => store.user);

  // ⏳ Wait for user context to be available
  if (!authUser || !selectedUser) {
    return (
      <div className="text-sm text-gray-400 px-4 py-2">
        ⏳ Waiting for user context...
      </div>
    );
  }

  // ✅ Validate message before rendering
  if (
    !message ||
    typeof message !== "object" ||
    (!message.text?.trim() && !message.fileUrl)
  ) {
    console.warn("❌ Skipping invalid message:", message);
    return null; // Stop rendering invalid messages
  }

  console.log("✅ Rendering message:", message);

  // ✅ Auto-scroll to the latest message
  useEffect(() => {
    if (scroll.current) {
      scroll.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [message]);

  const isSentByAuthUser = message.senderId === authUser?._id;
  const isSameSender = prevMessage?.senderId === message.senderId;
  const isNextSameSender = nextMessage?.senderId === message.senderId;

  const formatTime = (timestamp) =>
    timestamp ? moment(timestamp).format("hh:mm A") : "⏳";

  return (
    <div
      ref={scroll}
      className={`chat flex w-full items-end ${
        isSentByAuthUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isSentByAuthUser && !isSameSender && selectedUser?.profilePhoto && (
        <div className="w-10 h-10 rounded-full overflow-hidden mr-2">
          <img
            src={selectedUser.profilePhoto}
            alt="Receiver Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div
        className={`relative px-4 py-2 shadow-md text-sm max-w-10px sm:max-w-10px flex flex-col gap-2 justify-between ${
          isSentByAuthUser ? "bg-blue-600 text-white" : "bg-gray-200 text-black"
        }`}
      >
        <p className="flex items-end justify-between gap-2 text-sm">
          <span className="break-words">
            {message.text?.trim() || "📎 Attachment received"}
          </span>
        </p>

        {!isNextSameSender && message.timestamp && (
          <span className="flex text-[11px] text-gray-500 text-left whitespace-nowrap">
            {formatTime(message.timestamp)}
          </span>
        )}
      </div>

      {isSentByAuthUser && !isSameSender && authUser?.profilePhoto && (
        <div className="w-10 h-10 rounded-full overflow-hidden ml-2">
          <img
            src={authUser.profilePhoto}
            alt="Your Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default Message;
