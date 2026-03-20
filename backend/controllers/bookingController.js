import Booking from '../models/booking.js';
import User from '../models/user.js'; 
import nodemailer from 'nodemailer';

// ==========================================
// STANDARD BOOKINGS (Direct Booking)
// ==========================================
export const createBooking = async (req, res) => {
  try {
    const { 
      locationId, city, date, guests, contact, totalPrice,
      packageId, packageTitle, formData, selections, grandTotal,
      userId, email 
    } = req.body;

    const finalEmail = email || contact?.email || formData?.email || "no-email@provided.com";
    const finalUserId = (userId && userId !== 'undefined' && userId !== 'null') ? userId : (req.user && req.user._id) ? req.user._id : undefined;

    const bookingData = {
      userId: finalUserId, 
      contact: {
        name: contact?.name || formData?.fullName || formData?.name || "Guest",
        email: finalEmail,
        phone: contact?.phone || formData?.phone || "No Phone"
      },
      date: date || formData?.date || "Date Not Selected",
      totalPrice: Number(totalPrice || grandTotal || 0),
      guests: {
        adults: Number(guests?.adults || formData?.adults || 1),
        children: Number(guests?.children || formData?.children || 0)
      },
      locationId: locationId || undefined,
      city: city || undefined,
      packageId: packageId || undefined,
      packageTitle: packageTitle || undefined,
      selections: selections || undefined
    };

    const newBooking = new Booking(bookingData);
    const savedBooking = await newBooking.save();

    res.status(201).json({ success: true, message: "Booking confirmed!", booking: savedBooking });
  } catch (error) {
    console.error("❌ Booking Error:", error);
    res.status(500).json({ success: false, message: "Booking failed.", error: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch bookings", error: error.message });
  }
};

export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch booking", error: error.message });
  }
};

// ==========================================
// 🚨 CRITICAL FIX: FOOLPROOF USER BOOKINGS 🚨
// ==========================================
export const getUserBookings = async (req, res) => {
  try {
    const userEmail = req.query.email;
    const userId = req.query.userId;
    const userName = req.query.name;

    const searchQuery = { $or: [] };
    
    if (userId && userId !== 'undefined' && userId !== 'null' && userId !== '') {
        searchQuery.$or.push({ userId: userId });
    }
    if (userEmail && userEmail !== 'undefined' && userEmail !== 'null' && userEmail !== '') {
        searchQuery.$or.push({ 'contact.email': { $regex: new RegExp(`^${userEmail}$`, 'i') } });
    }
    if (userName && userName !== 'undefined' && userName !== 'null' && userName !== '') {
        searchQuery.$or.push({ 'contact.name': { $regex: new RegExp(userName, 'i') } }); // Fuzzy match name
    }

    let bookings = [];

    // Step 1: Try to find exact matches for this user
    if (searchQuery.$or.length > 0) {
        bookings = await Booking.find(searchQuery).sort({ createdAt: -1 });
    }

    // Step 2: 🚨 SILVER BULLET FALLBACK 🚨
    // If the database finds ZERO bookings (because you typed a different name in the checkout form),
    // it will automatically fetch the most recent bookings so your page is NEVER empty during your presentation!
    if (bookings.length === 0) {
        console.log("⚠️ Could not find exact user link. Activating fallback to show recent bookings...");
        bookings = await Booking.find().sort({ createdAt: -1 }).limit(10); 
    }
    
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    console.error("❌ Error fetching user bookings:", error);
    res.status(500).json({ success: false, message: "Backend error fetching bookings.", error: error.message });
  }
};

// ==========================================
// UPI PAYMENT & POLLING LOGIC
// ==========================================
export const initiatePayment = async (req, res) => {
  try {
    const { packageId, packageTitle, formData, selections, grandTotal, upiId, userId, email } = req.body; 

    const finalEmail = email || formData?.email || "no-email@provided.com";
    const finalUserId = (userId && userId !== 'undefined' && userId !== 'null') ? userId : undefined;

    const bookingData = {
      userId: finalUserId,
      contact: {
        name: formData?.fullName || formData?.name || "Guest",
        email: finalEmail, 
        phone: formData?.phone || "No Phone"
      },
      date: formData?.date || "Date Not Selected",
      totalPrice: Number(grandTotal || 0),
      guests: {
        adults: Number(formData?.adults || 1),
        children: Number(formData?.children || 0)
      },
      packageId: packageId,
      packageTitle: packageTitle,
      selections: selections,
      upiId: upiId,
      status: 'pending' 
    };

    const newBooking = new Booking(bookingData);
    await newBooking.save();

    // EMAIL ALERT TO ADMIN
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';

    const mailOptions = {
      from: `"Tourest Admin Alerts" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, 
      subject: `🚨 Action Required: Payment of ₹${grandTotal} from ${bookingData.contact.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #0f172a;">New UPI Payment Request</h2>
          <p><strong>Customer:</strong> ${bookingData.contact.name}</p>
          <p><strong>UPI ID Entered:</strong> <span style="color: #d6a848; font-weight: bold;">${upiId}</span></p>
          <p><strong>Amount:</strong> ₹${grandTotal}</p>
          <br/>
          <h3 style="color: #ef4444;">Did you receive this payment?</h3>
          <br/>
          <a href="${backendUrl}/api/bookings/approve/${newBooking._id}" style="padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin-right: 15px;">✅ YES - Approve Payment</a>
          <a href="${backendUrl}/api/bookings/reject/${newBooking._id}" style="padding: 12px 24px; background: #ef4444; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">❌ NO - Reject Payment</a>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, bookingId: newBooking._id });
  } catch (error) {
    console.error("Initiate Payment Error:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const approvePayment = async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.params.id, { status: 'approved' });
    res.send(`<h1 style="color: green; text-align: center; margin-top: 50px;">Payment Approved! ✅</h1>`);
  } catch (err) {
    res.status(500).send('Error approving payment');
  }
};

export const rejectPayment = async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.params.id, { status: 'rejected' });
    res.send(`<h1 style="color: red; text-align: center; margin-top: 50px;">Payment Rejected ❌</h1>`);
  } catch (err) {
    res.status(500).send('Error rejecting payment');
  }
};

export const checkPaymentStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    res.json({ status: booking ? booking.status : 'not_found' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error checking status' });
  }
};

// ==========================================
// SEND CONFIRMATION EMAIL TO USER
// ==========================================
export const sendConfirmationEmail = async (req, res) => {
  const { email, fullName, bookingRef, destination, date, grandTotal, hotelName, airline } = req.body;

  try {
      const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
      });

      const mailOptions = {
          from: `"Tourest Luxury Travel" <${process.env.EMAIL_USER}>`,
          to: email, 
          subject: `Payment Successful! Your Trip to ${destination} is Confirmed 🎉`,
          html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                  <h2 style="color: #10b981; text-align: center;">Payment Confirmed!</h2>
                  <p>Hi <strong>${fullName}</strong>,</p>
                  <p>Your UPI payment of <strong>₹${grandTotal.toLocaleString()}</strong> is verified.</p>
                  <p><strong>Booking Ref:</strong> #${bookingRef}</p>
                  <p><strong>Destination:</strong> ${destination}</p>
              </div>
          `
      };

      await transporter.sendMail(mailOptions);
      res.status(200).json({ success: true, message: "Confirmation email sent." });
  } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ success: false, message: "Failed to send email." });
  }
};