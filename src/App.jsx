import { useEffect, useState } from "react";
import "./App.css";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useSelector, useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { setAuthUser, setOnlineUsers } from "./redux/userSlice";
import { Card, CardContent } from "@/components/ui/card";
import API from "./services/api";
import { SocketProvider } from "@/context/SocketContext.jsx";
import { selectUserId } from "./redux/auth/authSelectors";
import { io } from "socket.io-client";
import { setSocketConnected } from "./redux/socketSlice";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/signup", element: <Signup /> },
  { path: "/login", element: <Login /> },
]);

function App() {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const [loading, setLoading] = useState(true);
  const { authUser } = useSelector((store) => store.user);

  useEffect(() => {
    if (authUser) {
      const socket = io("http://localhost:8082", {
        query: {
          userId: authUser._id,
        },
      });
      dispatch(setSocketConnected(socket));

      socket.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });
    }
  }, [authUser]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/user");
        dispatch(setAuthUser(res.data));
      } catch (error) {
        console.error(
          "User not authenticated:",
          error.response?.data || error.message
        );

        // 🔥 Optional: clear localStorage or any session token if needed
        localStorage.removeItem("token"); // or however you're storing the auth token
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-900 p-4">
      <Card className="w-full bg-gray-800 text-white border border-gray-700 shadow-lg">
        <CardContent className="p-6">
          {userId ? (
            <SocketProvider>
              <RouterProvider router={router} />
            </SocketProvider>
          ) : (
            <RouterProvider router={router} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
