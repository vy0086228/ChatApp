import React, { useState } from "react";
import { Menu, Search, LogOut, Users, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  setAuthUser,
  setOtherUsers,
  setSelectedUser,
} from "../redux/userSlice";
import { setMessages } from "../redux/messageSlice";
import OtherUsers from "./OtherUsers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import API from "@/services/api";

const Sidebar = () => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [isHidden, setIsHidden] = useState(false);
  const { otherUsers } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await API.get("/user/logout");
      navigate("/login");
      toast.success(res.data.message);
      dispatch(setAuthUser(null));
      dispatch(setMessages(null));
      dispatch(setOtherUsers(null));
      dispatch(setSelectedUser(null));
    } catch (error) {
      console.log(error);
    }
  };

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    const conversationUser = otherUsers?.find((user) =>
      user.fullName.toLowerCase().includes(search.toLowerCase())
    );
    if (conversationUser) {
      dispatch(setOtherUsers([conversationUser]));
    } else {
      toast.error("User not found!");
    }
  };

  return (
    <div className="flex text-white">
      {/* Sidebar Toggle Button (Hidden/Show) */}
      <Button
        variant="ghost"
        onClick={() => setIsHidden(!isHidden)}
        className="absolute top-4 left-4 z-50 bg-white-900 text-white"
      >
        {isHidden ? (
          <Menu className="w-6 h-6 text-white" />
        ) : (
          <X className="w-6 h-6 text-white hover:text-white transition duration-300 cursor-pointer" />
        )}
      </Button>
      {/* Sidebar */}
      <div
        className={cn(
          "border-r border-slate-500 p-4 flex flex-col my-2 bg-gray-900 text-white h-screen transition-all duration-300 ease-in-out h-[100%]",
          isOpen ? "w-[100%]" : "w-20",
          isHidden && "hidden"
        )}
      >
        {/* Sidebar Toggle Button */}
        <Button
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          className="mb-4 flex items-center gap-2 hover:text-white transition duration-300 cursor-pointer text-white"
        >
          <Menu className="w-6 h-6 text-white" />
          {isOpen && <span>Menu</span>}
        </Button>

        {/* Search Bar */}
        <form
          onSubmit={searchSubmitHandler}
          className="flex items-center gap-2"
        >
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(
              "border rounded-md px-3 py-2 bg-gray-800 text-white transition-all duration-300",
              !isOpen ? "opacity-0 w-0 p-0" : "opacity-100 w-full"
            )}
            type="text"
            placeholder="Search..."
          />

          <Button
            variant="outline"
            size="icon"
            className="hover:text-white transition duration-300 cursor-pointer"
          >
            <Search className="w-6 h-6 " />
          </Button>
        </form>

        <div className="divider px-3 my-2"></div>

        {/* Other Users List */}
        <OtherUsers />

        <div className="mt-auto">
          {/* Logout Button */}
          <Button
            onClick={logoutHandler}
            variant="destructive"
            className="flex items-center gap-2 w-full bg-white text-black hover:text-white transition duration-300 cursor-pointer"
          >
            <LogOut className="w-[20%] h-[20%]" />
            {isOpen && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
