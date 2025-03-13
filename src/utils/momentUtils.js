import moment from "moment";

// ✅ Format message time
export const formatTime = (timestamp) => moment(timestamp).format("hh:mm A");

// ✅ Format date for chat
export const formatStandardDate = (timestamp) =>
  moment(timestamp).format("D MMM YYYY");

// ✅ Show "Last Seen" (e.g., "5 minutes ago")
export const formatLastSeen = (timestamp) => moment(timestamp).fromNow();

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
    return moment(timestamp).format("DD/MM/YYYY"); // Default format
  }
};
