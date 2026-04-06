import crypto from "crypto";
import User from "../models/users.model.js";
import { accessCookieOptions, refreshCookieOptions } from "../utils/cookieOptions.js";
import { sendMail } from "../utils/mailer.js";

import bcrypt from "bcrypt";
import Profile from "../models/profile.model.js";
import jwt from "jsonwebtoken";

function clientBaseUrl() {
  return (
    process.env.CLIENT_ORIGIN?.split(",")[0]?.trim() ||
    "http://localhost:3000"
  );
}

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

    const verifyToken = crypto.randomBytes(32).toString("hex");
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      emailVerified: false,
      emailVerificationToken: verifyToken,
      emailVerificationExpires: new Date(Date.now() + 2 * 86400000),
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

    const vUrl = `${clientBaseUrl()}/verify-email?token=${verifyToken}`;
    await sendMail({
      to: newUser.email,
      subject: "Verify your email",
      text: `Verify: ${vUrl}`,
      html: `<p>Please <a href="${vUrl}">verify your email</a>.</p>`,
    });

    return res
      .cookie("accessToken", accessToken, accessCookieOptions())
      .cookie("refreshToken", refreshToken, refreshCookieOptions())
      .status(201)
      .json({
        message: "User Created Successfully",
        userName: newUser.username,
        emailVerified: false,
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
      .json({
        message: "Login Successfully",
        accessToken,
        emailVerified: user.emailVerified !== false,
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const forgotPasswordHandler = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });
    const user = await User.findOne({ email: email.trim() });
    const msg = "If an account exists, a reset link was sent.";
    if (!user) return res.json({ message: msg });

    const token = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = token;
    user.passwordResetExpires = new Date(Date.now() + 3600000);
    await user.save();

    const url = `${clientBaseUrl()}/reset-password?token=${token}`;
    await sendMail({
      to: user.email,
      subject: "Password reset",
      text: `Reset your password: ${url}`,
      html: `<p><a href="${url}">Reset your password</a> (expires in 1 hour).</p>`,
    });
    return res.json({ message: msg });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const resetPasswordHandler = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;
    if (!token || !password)
      return res.status(400).json({ message: "Missing fields" });
    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    });
    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(password, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshToken = "";
    await user.save();
    return res.json({ message: "Password updated. You can sign in." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const verifyEmailHandler = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token)
      return res.status(400).json({ message: "Token required" });
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    });
    if (!user)
      return res.status(400).json({ message: "Invalid or expired link" });

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();
    return res.json({ message: "Email verified successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .status(200)
      .json({ message: "Log out successful" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
