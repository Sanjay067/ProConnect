import { Router } from "express";
import { verifyAccessToken } from "../middlewares/verifyAccessToken.middleware.js";
import {
  sendConnection,
  acceptConnection,
  rejectConnection,
  cancelConnection,
  removeConnection,
  getMyConnections,
} from "../controllers/connection.controller.js";

const router = Router();

router.get("/me", verifyAccessToken, getMyConnections);

router.post("/:receiverId", verifyAccessToken, sendConnection);

router.patch("/:connectionId/accept", verifyAccessToken, acceptConnection);
router.patch("/:connectionId/reject", verifyAccessToken, rejectConnection);

export default router;
