import { Router } from "express";
import { verifyAccessToken } from "../middlewares/verifyAccessToken.middleware.js";
import { getFeed } from "../controllers/feed.controller.js";

const router = Router();

router.get("/", verifyAccessToken, getFeed);

export default router;

