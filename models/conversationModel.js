/*import mongoose from "mongoose";

const conversationModel = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  { timestamps: true }
);
export const Conversation = mongoose.model("Conversation", conversationModel); */

import mongoose from "mongoose";
import moment from "moment";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  {
    timestamps: true, // ✅ Automatically adds `createdAt` and `updatedAt`
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ✅ Virtual field to format `createdAt`
conversationSchema.virtual("formattedCreatedAt").get(function () {
  return moment(this.createdAt).format("D MMM YYYY, hh:mm A");
});

// ✅ Virtual field to format `updatedAt`
conversationSchema.virtual("formattedUpdatedAt").get(function () {
  return moment(this.updatedAt).format("D MMM YYYY, hh:mm A");
});

export const Conversation = mongoose.model("Conversation", conversationSchema);
