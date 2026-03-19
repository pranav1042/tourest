import mongoose from "mongoose";

// Sub-schema for transport options (Flights, Trains, Cabs)
const transportSchema = new mongoose.Schema({
  type: { type: String, required: true },
  provider: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  departureTime: { type: String, required: true },
  rating: { type: Number }
});

// Main schema for Locations/Destinations
const locationSchema = new mongoose.Schema(
  {
    city: { type: String, required: true },
    country: { type: String, required: true },
    description: { type: String, required: true },
    img: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    weather: { type: String },
    price: { type: Number, required: true },
    category: { type: String },
    rating: { type: Number, default: 0 },
    transportOptions: [transportSchema]
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Location = mongoose.models.Location || mongoose.model("Location", locationSchema);

export default Location;