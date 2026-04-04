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

app.use(cors({
  origin: ["https://tourest-rho.vercel.app"], 
  credentials: true
}));

// ===== DATABASE CONNECTION (FORCED SYNC FOR VERCEL) =====
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return; 
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    throw err; 
  }
};

// GLOBAL MIDDLEWARE: Connects to DB before processing any API request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: "Database connection failed", error: err.message });
  }
});

// ================= ROUTES =================

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/transport", transportRoutes);
app.use('/api/cities', cityRoutes);

// Location Route
app.get("/api/locations", async (req, res) => {
  try {
    const data = await Location.find({});
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ 
      message: "Server Error while fetching locations",
      error: error.message 
    });
  }
});

// Basic route to check if server is running
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ================= START SERVER / EXPORT =================

// Export for Vercel
export default app;

// Keep app.listen for local development only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally on port ${PORT}`);
  });
}