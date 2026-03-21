import Like from "../models/likes.model.js";
import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js";

export const toggleLikePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const existingLike = await Like.findOne({
      userId: req.user._id,
      targetId: postId,
      targetType: "Post",
    });

    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);
      post.likeCount = Math.max(0, post.likeCount - 1);
      await post.save();

      return res.status(200).json({
        message: "Post unliked",
        liked: false,
        likeCount: post.likeCount,
      });
    }

    await Like.create({
      userId: req.user._id,
      targetId: postId,
      targetType: "Post",
    });

    post.likeCount += 1;
    await post.save();

    return res.status(201).json({
      message: "Post liked",
      liked: true,
      likeCount: post.likeCount,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Already liked" });
    }
    return res.status(500).json({ message: error.message });
  }
};

export const toggleLikeComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const existingLike = await Like.findOne({
      userId: req.user._id,
      targetId: commentId,
      targetType: "Comment",
    });

    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);
      comment.likeCount = Math.max(0, comment.likeCount - 1);
      await comment.save();

      return res.status(200).json({
        message: "Comment unliked",
        liked: false,
        likeCount: comment.likeCount,
      });
    }

    await Like.create({
      userId: req.user._id,
      targetId: commentId,
      targetType: "Comment",
    });

    comment.likeCount += 1;
    await comment.save();

    return res.status(201).json({
      message: "Comment liked",
      liked: true,
      likeCount: comment.likeCount,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Already liked" });
    }
    return res.status(500).json({ message: error.message });
  }
};

export const getLikes = async (req, res) => {
  try {
    const { targetId, targetType } = req.query;

    if (!targetId || !targetType) {
      return res
        .status(400)
        .json({ message: "targetId and targetType query params are required" });
    }

    const likes = await Like.find({ targetId, targetType }).populate(
      "userId",
      "name username profilePicture",
    );

    return res.status(200).json({
      count: likes.length,
      likes,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
