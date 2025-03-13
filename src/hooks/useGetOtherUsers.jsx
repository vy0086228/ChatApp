import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setOtherUsers } from "../redux/userSlice";
import API from "@/services/api";

const useGetOtherUsers = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOtherUsers = async () => {
      try {
        axios.defaults.withCredentials = true;
        const res = await API.get(`/user`);
        // store
        console.log("Fetched other users:", res.data);
        if (Array.isArray(res.data)) {
          dispatch(setOtherUsers(res.data));
        } else {
          console.error("Expected an array but got:", res.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchOtherUsers();
  }, [dispatch]);
  return null;
};

export default useGetOtherUsers;
