import { Router } from "express";
import { verifyAccessToken } from "../middlewares/verifyAccessToken.middleware.js";
import {
  openOrCreateConversation,
  listConversations,
  listMessages,
  sendMessage,
} from "../controllers/messages.controller.js";

const router = Router();

router.post("/conversations", verifyAccessToken, openOrCreateConversation);
router.get("/conversations", verifyAccessToken, listConversations);
router.get(
  "/conversations/:conversationId/messages",
  verifyAccessToken,
  listMessages,
);
router.post(
  "/conversations/:conversationId/messages",
  verifyAccessToken,
  sendMessage,
);

export default router;
