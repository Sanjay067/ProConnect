import { Router } from "express";
import multer from "multer";
import {
  activeCheck,
  createPost,
  deletePost,
  editPost,
} from "../controllers/posts.controller.js";
import { verifyAccessToken } from "../middlewares/verifyAccessToken.middleware.js";
import { isPostAuthor } from "../middlewares/isPostAuthor.middleware.js";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.route("/").post(verifyAccessToken, upload.array("media", 5), createPost);
router
  .route("/:postId")
  .patch(verifyAccessToken, isPostAuthor, editPost)
  .delete(verifyAccessToken, isPostAuthor, deletePost);

export default router;
