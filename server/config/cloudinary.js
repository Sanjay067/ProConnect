import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Custom Multer storage engine for Cloudinary.
 * Replaces multer-storage-cloudinary which is incompatible with
 * cloudinary@2.x + multer@2.x on Node v24.
 */
class CloudinaryStorage {
  constructor({ cloudinary: cld, params = {} }) {
    this._cloudinary = cld;
    this._params = typeof params === "function" ? params : () => params;
  }

  async _handleFile(req, file, cb) {
    try {
      const params = await this._params(req, file);
      const uploadStream = this._cloudinary.uploader.upload_stream(
        params,
        (error, result) => {
          if (error) return cb(error);
          cb(null, {
            path: result.secure_url,
            filename: result.public_id,
            mimetype: file.mimetype,
            size: result.bytes,
          });
        }
      );
      file.stream.pipe(uploadStream);
    } catch (error) {
      cb(error);
    }
  }

  _removeFile(req, file, cb) {
    if (!file.filename) return cb(null);
    this._cloudinary.uploader.destroy(file.filename, (err) => cb(err || null));
  }
}

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
