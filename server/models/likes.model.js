import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    targetType: {
      type: String,
      enum: ["Post", "Comment"],
      required: true,
    },
  },
  { timestamps: true },
);

// One like per user per target — prevents double-liking
likeSchema.index({ userId: 1, targetId: 1, targetType: 1 }, { unique: true });

const Like = mongoose.model("Like", likeSchema);

export default Like;
