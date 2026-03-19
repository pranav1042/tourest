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

dotenv.config();

const app = express();

// ===== MONGODB CONNECTION (Serverless Optimized) =====
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    // In serverless, we don't process.exit(1) as it kills the function instance
  }
};

// ===== MIDDLEWARE =====
app.use(express.json()); 
app.use(cors({
  origin: ["https://tourest-rho.vercel.app"], 
  credentials: true
}));

// Middleware to ensure DB is connected before handling requests
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// ================= ROUTES =================

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/transport", transportRoutes);
app.use("/api/cities", cityRoutes);

app.get("/api/locations", async (req, res) => {
  try {
    const data = await Location.find();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ message: "Server Error while fetching locations" });
  }
});

app.get("/", (req, res) => {
  res.send("API is running...");
});

// ================= START SERVER =================
// Vercel doesn't use app.listen(), it uses the exported app.
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

export default app;