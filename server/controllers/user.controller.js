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

    user.profilePicture = req.file.path;
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

export const updateBanner = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(400).json({ message: "User doesn't exist" });
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const userProfile = await Profile.findOne({ userId: user._id });
    if (!userProfile) return res.status(400).json({ message: "Profile not found" });

    userProfile.bannerPicture = req.file.path;
    await userProfile.save();

    return res.status(200).json({
      message: "Banner picture updated",
      bannerPicture: userProfile.bannerPicture,
    });
  } catch (error) {
    console.error("uploadBanner error:", error.message);
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

/** Public-ish profile for another user (authenticated viewers only). Omits email. */
export const getPublicUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId)
      return res.status(400).json({ message: "User ID is required" });

    const user = await User.findById(userId).select(
      "name username profilePicture",
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name username profilePicture",
    );

    if (!userProfile) {
      return res.status(200).json({
        profile: null,
        user: {
          _id: user._id,
          name: user.name,
          username: user.username,
          profilePicture: user.profilePicture,
        },
      });
    }

    await userProfile.populate("userId", "name username profilePicture");
    return res.status(200).json({ profile: userProfile });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllProfiles = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(50, Math.max(1, Number(req.query.limit || 24)));
    const skip = (page - 1) * limit;

    const filter = { _id: { $ne: req.user._id } };
    const total = await User.countDocuments(filter);

    const rows = await User.find(filter)
      .select("name username profilePicture")
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const profiles = rows.map((u) => ({
      _id: u._id,
      username: u.username,
      name: u.name,
      profilePicture: u.profilePicture,
    }));

    return res.status(200).json({
      profiles,
      page,
      limit,
      total,
      hasMore: skip + profiles.length < total,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(400).json({ message: "User doesn't exist" });

    const userProfile = await Profile.findOne({ userId: user._id });

    if (!userProfile)
      return res.status(400).json({ message: "Profile not found" });

    const allowedFields = [
      "bio",
      "pastWork",
      "education",
      "currentPosition",
      "currentPost",
      "headline"
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        userProfile[field] = req.body[field];
      }
    });

    await userProfile.save();
    await userProfile.populate("userId", "name email username profilePicture");

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

export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(200).json([]);
    
    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { username: { $regex: q, $options: "i" } }
      ]
    }).select("_id name username profilePicture");

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
