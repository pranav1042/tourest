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

// ===== DATABASE CONNECTION (CRITICAL VERCEL FIX) =====
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return; 
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    throw err; // Throw error so the route can catch it
  }
};

// ================= ROUTES =================

app.use("/api/auth", async (req, res, next) => { await connectDB(); next(); }, authRoutes);
app.use("/api/bookings", async (req, res, next) => { await connectDB(); next(); }, bookingRoutes);
app.use("/api/packages", async (req, res, next) => { await connectDB(); next(); }, packageRoutes);
app.use("/api/transport", async (req, res, next) => { await connectDB(); next(); }, transportRoutes);
app.use('/api/cities', async (req, res, next) => { await connectDB(); next(); }, cityRoutes);

// 5. Location Routes
app.get("/api/locations", async (req, res) => {
  try {
    await connectDB(); // Ensure DB is connected before querying
    const data = await Location.find();
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

// Local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally on port ${PORT}`);
  });
}