import express from 'express';
import { 
  createBooking, 
  getAllBookings, 
  getBooking, 
  getUserBookings,
  initiatePayment,
  approvePayment,
  rejectPayment,
  checkPaymentStatus,
  sendConfirmationEmail 
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// =========================================
// DUMMY PAYMENT POLLING ROUTES
// =========================================
// NOTE: These must go BEFORE the /:id route so Express doesn't confuse them

// Frontend hits this to start the flow
router.post('/initiate', initiatePayment);

// Admin clicks these from their Gmail
router.get('/approve/:id', approvePayment);
router.get('/reject/:id', rejectPayment);

// Frontend polls this every 3 seconds
router.get('/status/:id', checkPaymentStatus);

// NEW: Frontend calls this to send the email to the user upon approval
router.post('/send-email', sendConfirmationEmail);


// =========================================
// EXISTING ROUTES
// =========================================

// POST: Create a new booking instantly (Legacy/Map logic)
router.post('/', createBooking);

// GET: Fetch all bookings (Admin)
router.get('/', getAllBookings);

// GET: Fetch bookings for the logged-in user (My Trips)
router.get('/my-bookings', protect, getUserBookings);

// GET: Fetch a single booking by its ID
router.get('/:id', getBooking);

export default router;