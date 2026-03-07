import jwt from "jsonwebtoken";
import User from "../models/users.model.js";

export const verifyAccessToken = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN);
    const user = await User.findById(decoded.userId);

    if (!user) return res.status(400).json({ message: "User doesn't exist" });

    req.user = user;
    console.log("Access  token verified");
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
