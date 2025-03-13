import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isConnected: false,
  socketId: null,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setSocketConnected: (state, action) => {
      state.isConnected = true;
      state.socketId = action.payload || null; // safety fallback
    },
    setSocketDisconnected: (state) => {
      state.isConnected = false;
      state.socketId = null;
    },
  },
});

export const { setSocketConnected, setSocketDisconnected } =
  socketSlice.actions;

export default socketSlice.reducer;
