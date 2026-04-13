import rateLimit from "express-rate-limit";

/** General API traffic per IP */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.API_RATE_LIMIT_MAX || 400),
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});

/** Stricter limit for login / signup / refresh */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.AUTH_RATE_LIMIT_MAX || 20),
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many auth attempts, please try again later." },
});

/** Separate refresh limit to avoid exhausting login attempts */
export const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.REFRESH_RATE_LIMIT_MAX || 120),
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many refresh attempts, please try again later." },
});
