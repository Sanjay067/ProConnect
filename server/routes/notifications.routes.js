import { Router } from "express";
import { verifyAccessToken } from "../middlewares/verifyAccessToken.middleware.js";
import {
  listNotifications,
  unreadCount,
  markRead,
  markAllRead,
} from "../controllers/notifications.controller.js";

const router = Router();

router.get("/", verifyAccessToken, listNotifications);
router.get("/unread-count", verifyAccessToken, unreadCount);
router.patch("/read-all", verifyAccessToken, markAllRead);
router.patch("/:id/read", verifyAccessToken, markRead);

export default router;
