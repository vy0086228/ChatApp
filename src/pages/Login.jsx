{
  /*import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../redux/userSlice";
import { Button } from "@/components/ui/button";
import API from "@/services/api";

const Login = () => {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // ✅ Check if fields are empty
    if (!email.trim() || !password.trim()) {
      setError("❌ Both email and password are required!");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const response = await API.post(`/user/login`, user, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (response.data.user) {
        dispatch(setAuthUser(response.data.user)); // ✅ Store user in Redux
        setIsLoading(false);
        console.log("✅ User set in Redux:", response.data.user);
        navigate("/"); // ✅ Redirect after login
      } else {
        console.error(
          "❌ Login response does not contain user data:",
          response
        );
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred. Please try again later.");
      }
      console.error("❌ Login Error:", error);
    }
    setIsLoading(false);

    setUser({
      username: "",
      password: "",
    });
  };

  return (
    <div className="min-w-96 mx-auto">
      <div className="w-full p-6 rounded-lg shadow-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-100">
        <form onSubmit={onSubmitHandler} action="">
          <h1 className="flex text-[30px] font-bold items-center justify-center">
            Login
          </h1>

          {error && <p className="text-red-400 mb-2">{error}</p>}

          <div>
            <label className="label p-2">
              <span className="flex text-base label-text pl-2">Username</span>
            </label>
            <input
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className="w-full input input-bordered h-8 my-1 px-2 py-1"
              type="text"
              placeholder="Username"
            />
          </div>
          <div>
            <label className="label p-2">
              <span className="flex text-base label-text pl-2">Password</span>
            </label>
            <input
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="w-full input input-bordered h-8 my-1 px-2 py-1"
              type="password"
              placeholder="Password"
            />
          </div>
          <div>
            <Button
              type="submit"
              className={`btn btn-block btn-sm mt-3 border border-slate-700 hover:text-white transition duration-300 cursor-pointer ${
                isLoading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={isLoading} // ✅ Disable button while loading
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </div>
          <p className="flex items-center justify-center my-2 gap-2">
            Don't have an account? <Link to="/signup"> Signup </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login; */
}

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../redux/userSlice";
import { Button } from "@/components/ui/button";
import API from "@/services/api";

const Login = () => {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Function to validate fields and show error message
  const validateFields = () => {
    if (!user.username.trim() || !user.password.trim()) {
      setError("❌ Both username and password are required!");
      return false;
    }
    setError(""); // ✅ Clear error if fields are filled
    return true;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!validateFields()) return; // ✅ Check fields before submitting

    setIsLoading(true);
    setError("");
    try {
      const response = await API.post(`/user/login`, user, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (response.data.user) {
        dispatch(setAuthUser(response.data.user)); // ✅ Store user in Redux
        setIsLoading(false);
        console.log("✅ User set in Redux:", response.data.user);
        navigate("/"); // ✅ Redirect after login
      } else {
        console.error(
          "❌ Login response does not contain user data:",
          response
        );
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred. Please try again later.");
      }
      console.error("❌ Login Error:", error);
    }
    setIsLoading(false);

    setUser({
      username: "",
      password: "",
    });
  };

  return (
    <div className="min-w-96 mx-auto">
      <div className="w-full p-6 rounded-lg shadow-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-100">
        <form onSubmit={onSubmitHandler} action="">
          <h1 className="flex text-[30px] font-bold items-center justify-center">
            Login
          </h1>
          {error && <p className="text-red-400 mb-2">{error}</p>}{" "}
          {/* ✅ Show error message */}
          <div>
            <label className="label p-2">
              <span className="flex text-base label-text pl-2">Username</span>
            </label>
            <input
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className="w-full input input-bordered h-8 my-1 px-2 py-1"
              type="text"
              placeholder="Username"
            />
          </div>
          <div>
            <label className="label p-2">
              <span className="flex text-base label-text pl-2">Password</span>
            </label>
            <input
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="w-full input input-bordered h-8 my-1 px-2 py-1"
              type="password"
              placeholder="Password"
            />
          </div>
          <div>
            <Button
              type="submit"
              className={`btn btn-block btn-sm mt-3 border border-slate-700 hover:text-white transition duration-300 cursor-pointer ${
                isLoading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={isLoading} // ✅ Disable button while loading
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </div>
          <p className="flex items-center justify-center my-2 gap-2">
            Don't have an account? <Link to="/signup"> Signup </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
