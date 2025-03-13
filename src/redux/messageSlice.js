import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: [],
  },
  reducers: {
    setMessages: (state, action) => {
      console.log("📩 Redux - Updating messages:", action.payload);

      if (!Array.isArray(action.payload)) {
        console.warn("❌ Invalid messages format:", action.payload);
        state.messages = [];
        return;
      }

      // ✅ Log every message BEFORE filtering
      action.payload.forEach((msg, index) => {
        console.log(`🔍 Checking message [Index ${index}]:`, msg);
      });

      // ✅ Accept `createdAt` if `timestamp` is missing
      state.messages = action.payload.filter((msg, index) => {
        const isValid =
          msg &&
          typeof msg === "object" &&
          typeof msg.senderId === "string" &&
          typeof msg.receiverId === "string" &&
          (msg.text?.trim() !== "" || msg.fileUrl) && // ✅ Allow file-only messages
          (msg.timestamp || msg.createdAt) &&
          !isNaN(new Date(msg.timestamp || msg.createdAt).getTime()); // ✅ Fix timestamp check

        if (!isValid) {
          console.warn(`❌ Skipping invalid message [Index ${index}]:`, msg);
        }

        return isValid;
      });

      console.log("✅ Valid messages stored in Redux:", state.messages);
    },
  },
});

export const { setMessages } = messageSlice.actions;
export default messageSlice.reducer;
