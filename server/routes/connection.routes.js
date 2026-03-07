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
router.post("/send/:receiverId", verifyAccessToken, sendConnection);
router.patch("/accept/:connectionId", verifyAccessToken, acceptConnection);
router.delete("/reject/:connectionId", verifyAccessToken, rejectConnection);
router.delete("/cancel/:connectionId", verifyAccessToken, cancelConnection);
router.delete("/remove/:connectionId", verifyAccessToken, removeConnection);

export default router;
