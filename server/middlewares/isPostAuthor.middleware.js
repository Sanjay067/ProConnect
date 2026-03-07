import Post from "../models/posts.model.js";

export const isPostAuthor = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
