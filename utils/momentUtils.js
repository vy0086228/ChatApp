import moment from "moment";

// ✅ Format timestamp for chat messages
export const formatTimestamp = (timestamp) =>
  moment(timestamp).format("D MMM YYYY, hh:mm A");

// ✅ Display relative time (e.g., "5 minutes ago")
export const formatRelativeTime = (timestamp) => moment(timestamp).fromNow();

// ✅ Generate a timestamp when saving to MongoDB
export const generateTimestamp = () => moment().toDate();

// ✅ Format date to show "Today", "Yesterday", or "20 Feb 2025"
export const formatChatDate = (timestamp) => {
  if (!timestamp) return "Unknown Date";

  const today = moment().startOf("day");
  const date = moment(timestamp).startOf("day");

  if (date.isSame(today, "day")) {
    return "Today";
  } else if (date.isSame(today.subtract(1, "day"), "day")) {
    return "Yesterday";
  } else {
    return moment(timestamp).format("DD/MM/YYYY");
  }
};
