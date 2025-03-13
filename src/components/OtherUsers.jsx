import React from "react";
import OtherUser from "./OtherUser";
import useGetOtherUsers from "../hooks/useGetOtherUsers";
import { useSelector } from "react-redux";

const OtherUsers = () => {
  // Custom hook to fetch other users
  useGetOtherUsers();

  const { otherUsers } = useSelector((store) => store.user);

  // Early return: show nothing until users load
  if (!Array.isArray(otherUsers)) return null;

  return (
    <div className="overflow-auto flex-1">
      {otherUsers.length > 0 ? (
        otherUsers.map(
          (user) =>
            user?._id ? <OtherUser key={user._id} user={user} /> : null // Fallback for safety
        )
      ) : (
        <p className="text-center text-sm text-gray-400 mt-2">
          No users available
        </p>
      )}
    </div>
  );
};

export default OtherUsers;
