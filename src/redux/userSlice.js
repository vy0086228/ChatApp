import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    authUser: null,
    otherUsers: null,
    selectedUser: null,
    onlineUsers: null,
  },
  reducers: {
    setAuthUser: (state, action) => {
      console.log("✅ Setting Auth User:", action.payload);
      state.authUser = action.payload;
    },
    setOtherUsers: (state, action) => {
      console.log("✅ Setting Other Users:", action.payload);
      state.otherUsers = action.payload; // Ensure it's always an array
    },
    setSelectedUser: (state, action) => {
      console.log("✅ Setting Selected User:", action.payload);
      state.selectedUser = action.payload;
    },
    setOnlineUsers: (state, action) => {
      console.log("✅ Updating Online Users:", action.payload);
      state.onlineUsers = action.payload; // Ensure it's always an array
    },
    logoutUser: (state) => {
      console.log("✅ Logging out user...");
      state.authUser = null;
      state.selectedUser = null;
      state.otherUsers = null;
      state.onlineUsers = null; // Optionally clear online users on logout
    },
  },
});

export const {
  setAuthUser,
  setOtherUsers,
  setSelectedUser,
  setOnlineUsers,
  logoutUser,
} = userSlice.actions;

export default userSlice.reducer;
