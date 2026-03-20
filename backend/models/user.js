import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: "Not Provided" },
  location: { type: String, default: "Not Provided" },
  
  // NEW: Fields for OTP
  resetPasswordOtp: { type: String },
  resetPasswordExpire: { type: Date }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);