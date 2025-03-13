// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

// Create Auth Context
export const AuthContext = createContext(null);

// Auth Provider Component
export const AuthProvider = (props) => {
  console.log("AuthProvider props:", props); // ✅ Debug: Ensure props are passed

  const { children } = props || {}; // ✅ Ensure destructuring from a valid object
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
    setLoading(false);
  }, []);

  // Update localStorage when token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // Logout Function
  const clearToken = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  // Auth Context Value
  const authContextValue = { user, setUser, token, setToken, clearToken };

  // Ensure no rendering until loading finishes
  if (loading) return null;

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to access Auth Context
export const useAuth = () => useContext(AuthContext);
