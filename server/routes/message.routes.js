import { Router } from "express";
import { verifyAccessToken } from "../middlewares/verifyAccessToken.middleware.js";
import {
  getConversations,
  getConversationMessages,
  sendMessage,
} from "../controllers/message.controller.js";

const router = Router();

router.get("/conversations", verifyAccessToken, getConversations);
router.get("/:peerId", verifyAccessToken, getConversationMessages);
router.post("/:peerId", verifyAccessToken, sendMessage);

export default router;
