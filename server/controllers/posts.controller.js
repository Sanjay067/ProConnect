import Post from "../models/posts.model.js";
import fs from "fs";
import path from "path";

export const activeCheck = async (req, res) => {
  return res.status(200).json({ message: "Serving is active" });
};

export const createPost = async (req, res) => {
  try {
    const { body } = req.body;

    if (!body || body.trim().length === 0) {
      return res.status(400).json({ message: "Post body is required" });
    }

    const media = req.files
      ? req.files.map((file) => ({
          url: file.filename,
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
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const { body } = req.body;

    if (body === undefined || body.trim().length === 0) {
      return res.status(400).json({ message: "Post body is required" });
    }

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

    // Delete media files from uploads/ folder
    if (post.media && post.media.length > 0) {
      post.media.forEach((file) => {
        const filePath = path.join("uploads", file.url);
        fs.unlink(filePath, (err) => {
          if (err) console.error(`Failed to delete file: ${filePath}`, err);
        });
      });
    }

    return res.status(200).json({ message: "Post deleted!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
