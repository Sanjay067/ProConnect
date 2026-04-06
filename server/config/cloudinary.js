import { v2 as cloudinary } from "cloudinary";
import CloudinaryStorage from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for profile pictures
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "linkedin/avatars",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 400, height: 400, crop: "fill" }],
  },
});

// Storage for post media
const postMediaStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "linkedin/posts",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "mp4"],
    resource_type: "auto",
  },
});

// Storage for banners
const bannerStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "linkedin/banners",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1200, height: 300, crop: "fill" }],
  },
});

export const uploadAvatar = multer({ storage: avatarStorage });
export const uploadBanner = multer({ storage: bannerStorage });
export const uploadPostMedia = multer({ storage: postMediaStorage });
export { cloudinary };
