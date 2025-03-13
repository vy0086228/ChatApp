{
  /*import React, { useState } from "react";
import SendInput from "./SendInput";
import Messages from "./Messages";
import { useSelector } from "react-redux";

const MessageContainer = () => {
  const { selectedUser, authUser, onlineUsers } = useSelector(
    (store) => store.user
  );
  const [messages, setMessages] = useState([]);

  // ⏳ Prevent early render before user context is ready
  if (!authUser) {
    return (
      <div className="flex flex-col justify-center items-center h-full text-gray-400">
        ⏳ Waiting for user context...
      </div>
    );
  }

  const isOnline =
    Array.isArray(onlineUsers) && selectedUser?._id
      ? onlineUsers.includes(selectedUser._id)
      : false;

  return (
    <>
      {selectedUser ? (
        <div className="flex flex-col w-full bg-gray-900 text-white">
          
          <div className="flex gap-4 items-center bg-zinc-800 text-white px-6 py-3 mb-2 shadow-md">
            <div className={`avatar ${isOnline ? "online" : ""}`}>
              <div className="w-14 h-14 rounded-full overflow-hidden">
                <img
                  src={selectedUser?.profilePhoto || "/default-avatar.png"}
                  alt="user-profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex justify-between gap-2">
                <p className="font-semibold text-lg">
                  {selectedUser?.fullName}
                </p>
                <span
                  className={`text-sm ${
                    isOnline ? "text-green-400" : "text-gray-400"
                  }`}
                >
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          </div>

          
          <div className="flex-1 overflow-auto p-4">
            <Messages selectedUser={selectedUser} />
          </div>

      
          <SendInput setMessages={setMessages} />
        </div>
      ) : (
        <div className="md:min-w-[550px] flex flex-col justify-center items-center">
          <h1 className="text-4xl text-white font-bold">
            Hi, {authUser?.fullName || "User"}
          </h1>
          <h1 className="text-2xl text-white">Let's start a conversation</h1>
        </div>
      )}
    </>
  );
};

export default MessageContainer; */
}

import React, { useState } from "react";
import SendInput from "./SendInput";
import Messages from "./Messages";
import { useSelector } from "react-redux";

const MessageContainer = () => {
  const { selectedUser, authUser, onlineUsers } = useSelector(
    (store) => store.user
  );
  const [messages, setMessages] = useState([]);

  const isOnline =
    Array.isArray(onlineUsers) && selectedUser?._id
      ? onlineUsers.includes(selectedUser._id)
      : false;

  if (!authUser) {
    return (
      <div className="text-center text-white p-6">
        🔒 Please log in to start messaging.
      </div>
    );
  }

  if (!selectedUser) {
    return (
      <div className="md:min-w-[550px] flex flex-col justify-center items-center">
        <h1 className="text-4xl text-white font-bold">
          Hi, {authUser?.fullName || "User"}
        </h1>
        <h1 className="text-2xl text-white">Let's start a conversation</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full bg-gray-900 text-white">
      {/* Header */}
      <div className="flex gap-4 items-center bg-zinc-800 text-white px-6 py-3 mb-2 shadow-md">
        <div className={`avatar ${isOnline ? "online" : ""}`}>
          <div className="w-14 h-14 rounded-full overflow-hidden">
            <img
              src={selectedUser?.profilePhoto || "/default-avatar.png"}
              alt="user-profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex justify-between gap-2">
            <p className="font-semibold text-lg">{selectedUser?.fullName}</p>
            <span
              className={`text-sm ${
                isOnline ? "text-green-400" : "text-gray-400"
              }`}
            >
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4">
        <Messages selectedUser={selectedUser} />
      </div>

      {/* Input */}
      <SendInput setMessages={setMessages} />
    </div>
  );
};

export default MessageContainer;
