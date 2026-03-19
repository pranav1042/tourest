import mongoose from "mongoose";

const cacheSchema = new mongoose.Schema({
  cacheKey: { type: String, required: true, unique: true }, // e.g., "Goa-2026-03-01"
  data: { type: Array, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 } // Auto-deletes after 1 hour (3600 seconds)
});

export default mongoose.models.Cache || mongoose.model("Cache", cacheSchema);