/*import mongoose from "mongoose";

const userModel = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePhoto: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
  },
  { timestamps: true }
);
export const User = mongoose.model("User", userModel); */

import mongoose from "mongoose";
import moment from "moment";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePhoto: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
  },
  {
    timestamps: true, // ✅ Automatically adds `createdAt` and `updatedAt`
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ✅ Virtual field to format `createdAt`
userSchema.virtual("formattedCreatedAt").get(function () {
  return moment(this.createdAt).format("D MMM YYYY, hh:mm A");
});

// ✅ Virtual field to format `updatedAt`
userSchema.virtual("formattedUpdatedAt").get(function () {
  return moment(this.updatedAt).format("D MMM YYYY, hh:mm A");
});

// ✅ Virtual field to show "Last Seen" as a relative time (e.g., "5 minutes ago")
userSchema.virtual("lastSeen").get(function () {
  return moment(this.updatedAt).fromNow();
});

export const User = mongoose.model("User", userSchema);
