import mongoose from "mongoose";
import moment from "moment";
import { formatChatDate } from "../utils/momentUtils.js";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      trim: true,
      required: function () {
        return !this.fileUrl; // ✅ Required only if no file is sent
      },
    },
    fileUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // ✅ Automatically adds createdAt & updatedAt fields
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ✅ Virtual field to format timestamp when retrieving messages
messageSchema.virtual("formattedTime").get(function () {
  return moment(this.createdAt).format("hh:mm A");
});

messageSchema.virtual("formattedDate").get(function () {
  return formatChatDate(this.createdAt);
});

export const Message = mongoose.model("Message", messageSchema);
