import User from "../models/users.model.js";
import crypto from "crypto";
import Profile from "../models/profile.model.js";
import PDFDocument from "pdfkit";
import fs from "fs";

const convertToPdf = (userData) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();

    const fileName = crypto.randomBytes(32).toString("hex") + ".pdf";
    const filePath = `uploads/${fileName}`;

    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    if (userData.userId.profilePicture) {
      doc.image(`uploads/${userData.userId.profilePicture}`, {
        align: "center",
        width: 100,
      });
    }

    doc.fontSize(14).text(`Name: ${userData.userId.name}`);
    doc.fontSize(14).text(`Email: ${userData.userId.email}`);
    doc.fontSize(14).text(`Username: ${userData.userId.username}`);
    doc.fontSize(14).text(`Bio: ${userData.bio}`);
    doc.fontSize(14).text(`Current Position: ${userData.currentPosition}`);

    doc.moveDown().fontSize(16).text("Past Work:");

    userData.pastWork.forEach((work) => {
      doc.fontSize(14).text(`Company: ${work.companyName}`);
      doc.text(`Position: ${work.position}`);
      doc.text(`Years: ${work.years}`);
      doc.moveDown();
    });

    doc.end();

    stream.on("finish", () => resolve(fileName));
    stream.on("error", reject);
  });
};

export const updateAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

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
    const user = await User.findById(req.user._id);
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
    const user = await User.findById(req.user._id);
    1;
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
    const user = await User.findById(req.user_id);
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

export const userProfileDownload = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId)
      return res.status(400).json({ message: "User ID is required" });

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: "User doesn't exist" });

    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name email username profilePicture",
    );

    if (!userProfile)
      return res.status(400).json({ message: "Profile not found" });

    const pdfPath = convertToPdf(userProfile);

    return res.json({ message: "PDF generated successfully", pdfPath });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
