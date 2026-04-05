import Comment from "../models/comments.model.js";
import Post from "../models/posts.model.js";

export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { body } = req.body;

    if (!body || body.trim().length === 0) {
      return res.status(400).json({ message: "Comment body is required" });
    }

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = await Comment.create({
      postId,
      author: req.user._id,
      body,
      parentComment: null,
    });

    // Increment comment count on the post
    post.commentCount += 1;
    await post.save();

    await comment.populate("author", "name username profilePicture");

    return res.status(201).json({
      message: "Comment added",
      comment,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const replyToComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { body } = req.body;

    if (!body || body.trim().length === 0) {
      return res.status(400).json({ message: "Reply body is required" });
    }

    // Verify parent comment exists and belongs to this post
    const parentComment = await Comment.findById(commentId);
    if (!parentComment || String(parentComment.postId) !== postId) {
      return res.status(404).json({ message: "Parent comment not found" });
    }

    const reply = await Comment.create({
      postId,
      author: req.user._id,
      body,
      parentComment: commentId,
    });

    // Increment comment count on the post
    const post = await Post.findById(postId);
    if (post) {
      post.commentCount += 1;
      await post.save();
    }

    await reply.populate("author", "name username profilePicture");

    return res.status(201).json({
      message: "Reply added",
      comment: reply,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const editComment = async (req, res) => {
  try {
    const comment = req.comment;
    const { body } = req.body;

    if (!body || body.trim().length === 0) {
      return res.status(400).json({ message: "Comment body is required" });
    }

    if (comment.isDeleted) {
      return res.status(400).json({ message: "Cannot edit a deleted comment" });
    }

    if (comment.body === body.trim()) {
      return res.status(200).json({ message: "No changes detected" });
    }

    comment.body = body;
    await comment.save();

    return res.status(200).json({
      message: "Comment updated",
      comment,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = req.comment;
    const { postId } = req.params;

    // Soft-delete — replies still reference this comment
    comment.isDeleted = true;
    comment.body = "";
    await comment.save();

    // Decrement comment count on the post
    const post = await Post.findById(postId);
    if (post) {
      post.commentCount = Math.max(0, post.commentCount - 1);
      await post.save();
    }

    return res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Get top-level comments (parentComment is null)
    const comments = await Comment.find({
      postId,
      parentComment: null,
      isDeleted: false,
    })
      .populate("author", "name username profilePicture")
      .sort({ createdAt: -1 });

    // For each top-level comment, get reply count
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replyCount = await Comment.countDocuments({
          parentComment: comment._id,
          isDeleted: false,
        });
        return {
          ...comment.toObject(),
          replyCount,
        };
      }),
    );

    return res.status(200).json({
      commentCount: post.commentCount,
      comments: commentsWithReplies,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getReplies = async (req, res) => {
  try {
    const { commentId } = req.params;

    const replies = await Comment.find({
      parentComment: commentId,
      isDeleted: false,
    })
      .populate("author", "name username profilePicture")
      .sort({ createdAt: 1 });

    return res.status(200).json({ replies });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
