import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    // --- OPTIONAL: Link to a logged-in User ---
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // ==========================================
    // 1. COMMON / CONTACT FIELDS
    // ==========================================
    contact: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String }
    },
    
    date: { type: String, required: true },
    
    // UPDATED: Now supports the new manual payment approval flow
    status: { 
      type: String, 
      default: 'pending' // Options: 'pending', 'approved', 'rejected', 'Confirmed', 'Cancelled'
    },
    
    totalPrice: { type: Number, required: true },

    // NEW: UPI ID for the dummy payment flow
    upiId: { type: String },

    // ==========================================
    // 2. GUESTS / PASSENGERS
    // ==========================================
    guests: {
      adults: { type: Number, default: 1, required: true },
      children: { type: Number, default: 0 }
    },

    // ==========================================
    // 3. LOCATION / TOUR BOOKING FIELDS
    // ==========================================
    locationId: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
    city: { type: String },
    transportType: { type: String },

    // ==========================================
    // 4. PACKAGE BOOKING FIELDS
    // ==========================================
    packageId: { type: String },
    packageTitle: { type: String },
    
    // FIXED: Changed to 'Object' so it correctly saves the nested flight and hotel data from the controller
    selections: { type: Object }
  },
  { timestamps: true } 
);

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default Booking;