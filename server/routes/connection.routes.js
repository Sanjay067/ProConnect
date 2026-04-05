import { Router } from "express";
import { verifyAccessToken } from "../middlewares/verifyAccessToken.middleware.js";
import {
  sendConnection,
  acceptConnection,
  rejectConnection,
  cancelConnection,
  removeConnection,
  getMyConnections,
  getConnectionsOverview,
} from "../controllers/connection.controller.js";

const router = Router();

router.get("/overview", verifyAccessToken, getConnectionsOverview);
router.get("/me", verifyAccessToken, getMyConnections);

router.delete(
  "/pending/:connectionId",
  verifyAccessToken,
  cancelConnection,
);
router.delete(
  "/accepted/:connectionId",
  verifyAccessToken,
  removeConnection,
);

router.post("/:receiverId", verifyAccessToken, sendConnection);

router.patch("/:connectionId/accept", verifyAccessToken, acceptConnection);
router.patch("/:connectionId/reject", verifyAccessToken, rejectConnection);

export default router;
