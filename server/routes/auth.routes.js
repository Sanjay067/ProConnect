import { Router } from "express";
import { verifyAccessToken } from "../middlewares/verifyAccessToken.middleware.js";
import { authLimiter } from "../middlewares/rateLimits.js";
import {
  loginHandler,
  logoutHandler,
  signupHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
  verifyEmailHandler,
} from "../controllers/auth.controller.js";

import { refreshTokenHandler } from "../controllers/authRefresh.controller.js";

const router = Router();

router.post("/refresh-token", authLimiter, refreshTokenHandler);
router.post("/signup", authLimiter, signupHandler);
router.post("/login", authLimiter, loginHandler);
router.post("/logout", verifyAccessToken, logoutHandler);
router.post("/forgot-password", authLimiter, forgotPasswordHandler);
router.post("/reset-password", authLimiter, resetPasswordHandler);
router.get("/verify-email", verifyEmailHandler);

export default router; 