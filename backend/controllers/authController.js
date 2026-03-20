import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const register = async (req, res) => {
  const { fullName, email, password, phone } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ msg: "User exists" });

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ fullName, email, password: hashed, phone });
  res.status(201).json({ msg: "Registered successfully" });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Wrong password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  
  res.json({ 
    token, 
    user: { id: user._id, name: user.fullName, email: user.email, phone: user.phone, location: user.location } 
  });
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, location } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, { fullName: name, phone, location }, { new: true }
    ).select("-password");

    res.json({ id: updatedUser._id, name: updatedUser.fullName, email: updatedUser.email, phone: updatedUser.phone, location: updatedUser.location });
  } catch (error) {
    res.status(500).json({ msg: "Server error updating profile" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Incorrect current password" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ msg: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error changing password" });
  }
};

// ==========================================
// NEW: OTP FORGOT PASSWORD FLOW
// ==========================================

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User with this email does not exist." });

    // 1. Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Save OTP to database (Valid for 10 minutes)
    user.resetPasswordOtp = otp;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; 
    await user.save();

    // 3. Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    const mailOptions = {
      from: `"Tourest Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Your Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2 style="color: #0F2435;">Password Reset Request</h2>
          <p>You requested to reset your password. Here is your One-Time Password (OTP):</p>
          <div style="background: #f8fafc; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h1 style="color: #C5A059; margin: 0; letter-spacing: 5px; font-size: 32px;">${otp}</h1>
          </div>
          <p style="color: #64748b; font-size: 14px;">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ msg: "OTP sent to your email successfully!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to send email." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Find user with matching email, matching OTP, and check if OTP hasn't expired
    const user = await User.findOne({
      email,
      resetPasswordOtp: otp,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ msg: "Invalid or expired OTP." });

    // Hash the new password and clear the OTP fields
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ msg: "Password has been reset successfully. You can now log in." });
  } catch (error) {
    res.status(500).json({ msg: "Server error resetting password." });
  }
};