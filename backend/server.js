import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

// ===== IMPORT ROUTES =====
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import packageRoutes from "./routes/packageRoutes.js";
import transportRoutes from "./routes/transportroutes.js"; 
import cityRoutes from './routes/cityRoutes.js';

// ===== IMPORT MODELS =====
import Location from "./models/Location.js";

// Load environment variables
dotenv.config();

const app = express();

// ===== MIDDLEWARE =====
app.use(express.json()); 

// FIX: Removed the trailing slash (/) from the vercel.app URL
app.use(cors({
  origin: ["https://tourest-rho.vercel.app"], 
  credentials: true
}));

// ===== DATABASE CONNECTION =====
// FIX: Optimized for Serverless to prevent connection pooling errors
const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return; // Use existing connection
  }
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
  }
};

// Initialize connection
connectDB();

// ================= ROUTES =================

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/transport", transportRoutes);

// FIX: Moved cityRoutes OUT of the locations GET request
app.use('/api/cities', cityRoutes);

// 5. Location Routes
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

// ================= START SERVER / EXPORT =================

// FIX: Export the app for Vercel Serverless Functions
export default app;

// Keep app.listen for local development only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally on port ${PORT}`);
  });
}