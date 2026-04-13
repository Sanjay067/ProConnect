import { Router } from "express";
import { authLimiter, refreshLimiter } from "../middlewares/rateLimits.js";
import { issueCsrfToken } from "../middlewares/csrf.middleware.js";
import {
    loginHandler,
    logoutHandler,
    signupHandler,
} from '../controllers/auth.controller.js'

import { refreshTokenHandler } from "../controllers/authRefresh.controller.js";

const router = Router();

router.post("/refresh-token", refreshLimiter, refreshTokenHandler);
router.get("/csrf-token", issueCsrfToken);
router.post("/signup", authLimiter, signupHandler);
router.post("/login", authLimiter, loginHandler);
router.post("/logout", logoutHandler);


export default router; 