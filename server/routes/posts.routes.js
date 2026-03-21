import { Router } from "express";

import {
  activeCheck,
  getAllUserPosts,
  createPost,
  deletePost,
  editPost,
} from "../controllers/posts.controller.js";
import { toggleLikePost } from "../controllers/likes.controller.js";
import { verifyAccessToken } from "../middlewares/verifyAccessToken.middleware.js";
import { isPostAuthor } from "../middlewares/isPostAuthor.middleware.js";
import commentRoutes from "./comments.routes.js";

const router = Router();

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

import { uploadPostMedia } from "../config/cloudinary.js";

router
  .route("/")
  .get(verifyAccessToken, getAllUserPosts)
  .post(verifyAccessToken, uploadPostMedia.array("media", 5), createPost);
router
  .route("/:postId")
  .patch(verifyAccessToken, isPostAuthor, editPost)
  .delete(verifyAccessToken, isPostAuthor, deletePost);

// Like/unlike a post
router.post("/:postId/like", verifyAccessToken, toggleLikePost);

// Mount comment routes under /:postId/comments
router.use("/:postId/comments", commentRoutes);

export default router;
