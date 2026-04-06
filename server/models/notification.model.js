import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: [
        "comment",
        "connection_request",
        "connection_accept",
        "dm",
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, default: "" },
    read: { type: Boolean, default: false },
    meta: {
      postId: mongoose.Schema.Types.ObjectId,
      commentId: mongoose.Schema.Types.ObjectId,
      connectionId: mongoose.Schema.Types.ObjectId,
      conversationId: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true },
);

notificationSchema.index({ recipientId: 1, read: 1, createdAt: -1 });

export default mongoose.model("Notification", notificationSchema);
