// production: secure + sameSite=none for cross-origin
const isProd = () => process.env.NODE_ENV === "production";

export function accessCookieOptions() {
  return {
    httpOnly: true,
    secure: isProd(),
    sameSite: isProd() ? "none" : "lax",
    maxAge: 60 * 60 * 1000,
  };
}

export function refreshCookieOptions() {
  return {
    httpOnly: true,
    secure: isProd(),
    sameSite: isProd() ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}
