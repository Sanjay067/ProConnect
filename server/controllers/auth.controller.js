import User from "../models/users.model.js";
import {
  accessCookieOptions,
  clearAuthCookieOptions,
  refreshCookieOptions,
} from "../utils/cookieOptions.js";

import bcrypt from "bcrypt";
import Profile from "../models/profile.model.js";
import jwt from "jsonwebtoken";

export const signupHandler = async (req, res) => {
  try {
    const { name, username, email, password, confirmPassword } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res
        .status(400)
        .json({ message: "User with this email already exists" });

    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
      return res
        .status(400)
        .json({ message: "User with this username already exists" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });

    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_ACCESS_TOKEN,
      { expiresIn: "60m" },
    );
    const refreshToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_REFRESH_TOKEN,
      { expiresIn: "7d" },
    );

    newUser.refreshToken = refreshToken;

    await newUser.save();

    const profile = new Profile({
      userId: newUser._id,
    });

    await profile.save();

    return res
      .cookie("accessToken", accessToken, accessCookieOptions())
      .cookie("refreshToken", refreshToken, refreshCookieOptions())
      .status(201)
      .json({
        message: "User Created Successfully",
        userName: newUser.username,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, identify: "signup route" });
  }
};

export const loginHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required " });

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User doesn't exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_ACCESS_TOKEN,
      { expiresIn: "60m" },
    );
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_TOKEN,
      { expiresIn: "7d" },
    );

    user.refreshToken = refreshToken;
    await user.save();

    return res
      .cookie("accessToken", accessToken, accessCookieOptions())
      .cookie("refreshToken", refreshToken, refreshCookieOptions())
      .status(200)
      .json({ message: "Login Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Login failed" });
  }
};

export const logoutHandler = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const user = await User.findOne({ refreshToken });

      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }

    return res
      .clearCookie("accessToken", clearAuthCookieOptions())
      .clearCookie("refreshToken", clearAuthCookieOptions())
      .status(200)
      .json({ message: "Log out successful" });
  } catch (error) {
    return res.status(500).json({ message: "Logout failed" });
  }
};
