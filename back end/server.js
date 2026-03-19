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
app.use(express.json()); // Allows the server to accept JSON data in the body (req.body)
app.use(cors({
  origin: ["https://tourest-rho.vercel.app/"], // Allow your React/Vite frontend
  credentials: true
}));

// ================= ROUTES =================

// 1. Auth Routes (Login/Register)
app.use("/api/auth", authRoutes);

// 2. Booking Routes (Creates and fetches bookings + sends emails)
app.use("/api/bookings", bookingRoutes);

// 3. Package Routes (Fetches tour packages)
app.use("/api/packages", packageRoutes);

// 4. Transport Routes (Live APIs) - ✅ Moved to the correct spot!
app.use("/api/transport", transportRoutes);

// 5. Location Routes (Fetches seeded locations for the Map/Destinations)
app.get("/api/locations", async (req, res) => {
  app.use('/api/cities', cityRoutes);
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

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});