import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://res.cloudinary.com/dzxegwov1/image/upload/v1774022392/094779dd-b28a-4648-a099-05983749fbc4.png",
    },
    refreshToken: {
      type: String,
      default: "",
    },
    emailVerified: {
      type: Boolean,
      default: true,
    },
    emailVerificationToken: { type: String },
    emailVerificationExpires: { type: Date },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
