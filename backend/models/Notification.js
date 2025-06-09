import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: { type: String, required: true }, // e.g., "friend_request", "trip_invite", "admin_verification", "post_like", "comment", "reply", "review_approved"
    message: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed }, // Additional data if needed (postId, commentId, etc.)
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", NotificationSchema);
