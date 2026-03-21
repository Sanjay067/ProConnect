import { Router } from "express";
import {
  addComment,
  replyToComment,
  editComment,
  deleteComment,
  getComments,
  getReplies,
} from "../controllers/comments.controller.js";
import { toggleLikeComment } from "../controllers/likes.controller.js";
import { verifyAccessToken } from "../middlewares/verifyAccessToken.middleware.js";
import { isCommentAuthor } from "../middlewares/isCommentAuthor.middleware.js";

const router = Router({ mergeParams: true });

// Get all top-level comments for a post
router.get("/", verifyAccessToken, getComments);

// Add a comment to a post
router.post("/", verifyAccessToken, addComment);

// Reply to a comment
router.post("/:commentId/reply", verifyAccessToken, replyToComment);

// Get replies for a comment
router.get("/:commentId/replies", verifyAccessToken, getReplies);

// Edit a comment (author only)
router.patch("/:commentId", verifyAccessToken, isCommentAuthor, editComment);

// Delete a comment (author only, soft-delete)
router.delete("/:commentId", verifyAccessToken, isCommentAuthor, deleteComment);

// Like/unlike a comment
router.post("/:commentId/like", verifyAccessToken, toggleLikeComment);

export default router;
