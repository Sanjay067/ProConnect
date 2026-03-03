import User from "../models/users.model.js";

import Profile from "../models/profile.model.js";

export const updateAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) return res.status(400).json({ message: "User doesn't exist" });

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    user.profilePicture = req.file.filename;
    await user.save();

    return res.status(200).json({
      message: "Profile picture updated",
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.error("uploadProfilePicture error:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const newUserData = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(400).json({ message: "User doesn't exist" });

    const { email, username, name } = newUserData;
    console.log("email, username : ", email, username);
    console.log("newUserData : ", newUserData);

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    console.log("existingUser : ", existingUser);

    if (existingUser && String(existingUser._id) !== String(user._id)) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    if (name) user.name = name;

    if (email) user.email = email;

    if (username) user.username = username;

    await user.save();

    return res.status(200).json({ message: "Changes updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) return res.status(400).json({ message: "user doesn't exist" });

    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name email username profilePicture",
    );

    return res.json(userProfile);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllProfiles = async (req, res) => {
  try {
    const allUsers = await User.find({});
    if (allUsers.length === 0)
      return res.status(400).json({ message: "No users found" });

    const users = allUsers.map((user) => {
      return {
        username: user.username,
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture,
      };
    });

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(400).json({ message: "User doesn't exist" });

    const userProfile = await Profile.findOne({ userId: user._id });

    if (!userProfile)
      return res.status(400).json({ message: "Profile not found" });

    const allowedFields = ["bio", "pastWork", "education"];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        userProfile[field] = req.body[field];
      }
    });

    await userProfile.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      userProfile,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
