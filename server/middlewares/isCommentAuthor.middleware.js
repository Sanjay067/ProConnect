import Comment from "../models/comments.model.js";

export const isCommentAuthor = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (String(comment.author) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    req.comment = comment;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
