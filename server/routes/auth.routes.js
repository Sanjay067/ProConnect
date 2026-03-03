import { Router } from 'express';
import { verifyAccessToken } from "../middlewares/verifyAccessToken.middleware.js";
import {
    loginHandler,
    logoutHandler,
    signupHandler,
} from '../controllers/auth.controller.js'

import { refreshTokenHandler } from "../controllers/authRefresh.controller.js";

const router = Router();

router.post("/refresh-token", refreshTokenHandler);
router.post("/signup", signupHandler);
router.post("/login", loginHandler);
router.post("/logout", verifyAccessToken, logoutHandler);


export default router; 