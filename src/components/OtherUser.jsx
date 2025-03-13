import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";

function OtherUser({ user }) {
  const dispatch = useDispatch();
  const { selectedUser, onlineUsers } = useSelector((state) => state.user);

  if (!user) return null; // ✅ Safety check

  const isOnline = onlineUsers?.includes(user._id);

  const handleSelectUser = () => {
    dispatch(setSelectedUser(user));
  };

  return (
    <>
      <div
        onClick={handleSelectUser}
        className={`${
          selectedUser?._id === user._id
            ? "bg-zinc-200 text-black"
            : "text-white"
        } flex gap-2 hover:text-black items-center hover:bg-zinc-200 rounded p-2 cursor-pointer`}
      >
        <div className={`avatar ${isOnline ? "online" : ""}`}>
          <div className="w-8 rounded-full">
            <img
              src={user.profilePhoto || "/default-avatar.png"}
              alt={`${user.fullName || "User"} profile`}
            />
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex justify-between gap-2">
            <p>{user.fullName}</p>
          </div>
        </div>
      </div>
      <div className="divider my-1 py-0"></div>
    </>
  );
}

export default OtherUser;
