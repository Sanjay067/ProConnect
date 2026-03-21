import Post from "../models/posts.model.js";
import { cloudinary } from "../config/cloudinary.js";

export const activeCheck = async (req, res) => {
  return res.status(200).json({ message: "Serving is active" });
};

export const getAllUserPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    // Sort by newest first and populate author
    const posts = await Post.find({ author: userId })
      .populate("author", "name username profilePicture")
      .sort({ createdAt: -1 });
    return res
      .status(200)
      .json({ message: "Posts fetched successfully", posts });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, identifier: "get all posts" });
  }
};

export const createPost = async (req, res) => {
  try {
    const { body } = req.body;

    if (!body || body.trim().length === 0) {
      return res.status(400).json({ message: "Post body is required" });
    }

    const media = req.files
      ? req.files.map((file) => ({
          url: file.path,
          publicId: file.filename,
          type: file.mimetype.startsWith("image/")
            ? "image"
            : file.mimetype.startsWith("video/")
              ? "video"
              : "file",
        }))
      : [];

    const newPost = new Post({
      author: req.user._id,
      body,
      media,
    });

    await newPost.save();

    return res.status(200).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const editPost = async (req, res) => {
  try {
    const { body } = req.body;

    if (body === undefined || body.trim().length === 0) {
      return res.status(400).json({ message: "Post body is required" });
    }
    const post = await Post.findById(req.params.postId);

    // Skip save if nothing changed
    if (post.body === body.trim()) {
      return res.status(200).json({ message: "No changes detected" });
    }

    post.body = body;
    await post.save();

    return res.status(200).json({
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.postId);

    if (post.media && post.media.length > 0) {
      for (const file of post.media) {
        try {
          await cloudinary.uploader.destroy(file.publicId);
        } catch (err) {
          console.error(
            `Failed to delete from Cloudinary: ${file.publicId}`,
            err,
          );
        }
      }
    }

    return res.status(200).json({ message: "Post deleted!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
