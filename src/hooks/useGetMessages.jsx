import React, { useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from "../redux/messageSlice";
import API from "@/services/api";

const useGetMessages = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser || !selectedUser._id) {
        console.warn("⚠ No selectedUser or user ID available.");
        dispatch(setMessages([]));
        return;
      }

      try {
        axios.defaults.withCredentials = true;
        console.log(`📡 Fetching messages for user ID: ${selectedUser._id}`);

        const res = await API.get(`/messages/${selectedUser._id}`);

        dispatch(setMessages(res.data || []));
      } catch (error) {
        console.error(
          "❌ Error fetching messages:",
          error.response?.data || error.message
        );
        dispatch(setMessages([]));
      }
    };

    fetchMessages();
  }, [selectedUser?._id, dispatch]);

  return null;
};

export default useGetMessages;
