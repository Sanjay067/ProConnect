import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    body: {
      type: String,
      trim: true,
      maxlength: 5000,
    },

    media: [
      {
        url: String,
        publicId: String,
        type: {
          type: String,
          enum: ["image", "video", "file"],
        },
      },
    ],

    likeCount: {
      type: Number,
      default: 0,
    },

    commentCount: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

postSchema.index({ createdAt: -1 });

export default mongoose.model("Post", postSchema);
