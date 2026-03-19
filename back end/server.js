import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

// ===== IMPORT ROUTES =====
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import packageRoutes from "./routes/packageRoutes.js";
import transportRoutes from "./routes/transport.routes.js"; 
import cityRoutes from './routes/cityRoutes.js';

// ===== IMPORT MODELS =====
import Location from "./models/Location.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1); // Exit process with failure
  }
};

// Initialize connection
connectDB();

// Initialize Express app
const app = express();

// ===== MIDDLEWARE =====
app.use(express.json()); 
app.use(cors({
  // FIXED: Removed the trailing slash from the URL
  origin: ["https://tourest-rho.vercel.app"], 
  credentials: true
}));

// ================= ROUTES =================

// 1. Auth Routes (Login/Register)
app.use("/api/auth", authRoutes);

// 2. Booking Routes
app.use("/api/bookings", bookingRoutes);

// 3. Package Routes
app.use("/api/packages", packageRoutes);

// 4. Transport Routes 
app.use("/api/transport", transportRoutes);

// 5. City Routes - FIXED: Moved this OUTSIDE of the location GET request
app.use("/api/cities", cityRoutes);

// 6. Location Routes 
app.get("/api/locations", async (req, res) => {
  try {
    const data = await Location.find();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ message: "Server Error while fetching locations" });
  }
});

// Basic route to check if server is running
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

export default app;