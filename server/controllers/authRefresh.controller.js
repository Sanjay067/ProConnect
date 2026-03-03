import jwt from "jsonwebtoken";
import User from "../models/users.model.js";

export const refreshTokenHandler = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) return res.status(400).json({ message: "No refresh token" });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_TOKEN);

    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== token)
      return res.status(400).json({ message: "Invalid refresh token" });

    const newAccessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_ACCESS_TOKEN,
      { expiresIn: "60m" },
    );

    return res
      .cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        maxAge: 60 * 60 * 1000,
      })
      .status(200)
      .json({ message: "Access token Refreshed" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
