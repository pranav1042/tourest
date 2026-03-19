import express from "express";
import { login, register, updateProfile, changePassword, forgotPassword, resetPassword } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword); // Sends OTP
router.post("/reset-password", resetPassword);   // Verifies OTP & Saves Password

// Protected Routes
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

export default router;