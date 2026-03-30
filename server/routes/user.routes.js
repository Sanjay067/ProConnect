import { Router } from "express";
import {
  updateAvatar,
  getMyProfile,
  getAllProfiles,
  updateMyProfile,
  updateUser,
  userProfileDownload,
  searchUsers,
} from "../controllers/user.controller.js";
import { uploadAvatar } from "../config/cloudinary.js";
import { verifyAccessToken } from "../middlewares/verifyAccessToken.middleware.js";

const router = Router();

// Search users
router.get("/search", verifyAccessToken, searchUsers);

// Get current user's profile
router.get("/profiles/me", verifyAccessToken, getMyProfile);

// Get all profiles
router.get("/profiles", verifyAccessToken, getAllProfiles);

// Download user profile
router.get(
  "/profiles/download/:userId",
  verifyAccessToken,
  userProfileDownload,
);

// Update profile (bio, pastWork, education)
router.patch("/profiles/me", verifyAccessToken, updateMyProfile);

// Update user account (name, email, username)
router.patch("/me", verifyAccessToken, updateUser);

// Update avatar
router.patch(
  "/profiles/me/avatar",
  verifyAccessToken,
  uploadAvatar.single("avatar"),
  updateAvatar,
);

export default router;
