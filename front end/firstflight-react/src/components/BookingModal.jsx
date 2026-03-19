import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios'; 
import { 
  FaTimes, FaCheckCircle, FaMapMarkerAlt, FaMinus, FaPlus, 
  FaSpinner, FaArrowLeft, FaCreditCard, FaCalendarAlt, FaUsers 
} from 'react-icons/fa';

const BookingModal = ({ selectedItem, onClose }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [guests, setGuests] = useState({ adults: 2, children: 0 });
  const [date, setDate] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const totalPrice = (selectedItem.price || 10000) * guests.adults;

  const handleBook = async () => {
    setLoading(true);
    try {
      // Simulate API delay for UX feel
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStep(3);
    } catch (err) {
      alert("Issue processing booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      style={styles.overlay} 
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.9, opacity: 0, y: 20 }} 
        onClick={(e) => e.stopPropagation()} 
        style={styles.modal}
      >
        
        {/* --- LEFT PANEL: BRANDING & PREVIEW --- */}
        <div style={styles.leftPanel}>
          <div style={styles.leftPanelContent}>
            <div style={styles.badge}>Luxury Selection</div>
            <h3 style={styles.heading}>Booking <br/>Summary</h3>
            
            <div style={styles.imageCard}>
              <img src={selectedItem.img} alt="" style={styles.img} />
              <div style={styles.imgOverlay}>
                <span style={styles.locationTag}><FaMapMarkerAlt /> {selectedItem.country}</span>
                <h4 style={styles.hotelTitle}>{selectedItem.title}</h4>
              </div>
            </div>

            <div style={styles.summaryDetails}>
              <div style={styles.summaryRow}>
                <div style={styles.iconCircle}><FaCalendarAlt size={12}/></div>
                <div>
                  <small style={styles.summaryLabel}>CHECK-IN</small>
                  <p style={styles.summaryValue}>{date || 'Select Date'}</p>
                </div>
              </div>
              <div style={styles.summaryRow}>
                <div style={styles.iconCircle}><FaUsers size={12}/></div>
                <div>
                  <small style={styles.summaryLabel}>GUESTS</small>
                  <p style={styles.summaryValue}>{guests.adults} Adults, {guests.children} Children</p>
                </div>
              </div>
            </div>

            <div style={styles.totalSection}>
              <span style={styles.totalLabel}>Grand Total</span>
              <span style={styles.totalAmount}>₹{totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* --- RIGHT PANEL: INTERACTIVE FLOW --- */}
        <div style={styles.rightPanel}>
          <div style={styles.header}>
            <div style={styles.progressContainer}>
                {[1, 2, 3].map(i => (
                    <div key={i} style={{
                        ...styles.progressDot, 
                        background: step >= i ? '#C5A059' : '#e2e8f0',
                        width: step === i ? '24px' : '8px'
                    }} />
                ))}
            </div>
            <button onClick={onClose} style={styles.closeBtn}><FaTimes /></button>
          </div>

          <div style={styles.scrollContent}>
            <AnimatePresence mode='wait'>
              {step === 1 && (
                <motion.div key="step1" {...animationProps}>
                  <h2 style={styles.stepTitle}>Configure Your Stay</h2>
                  <p style={styles.stepSub}>Select your preferred dates and guest count.</p>
                  
                  <div style={styles.inputWrapper}>
                    <label style={styles.floatingLabel}>Travel Date</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={styles.premiumInput} />
                  </div>

                  <div style={styles.counterGroup}>
                    <div style={styles.counterItem}>
                        <span style={styles.label}>Adults</span>
                        <div style={styles.counterControls}>
                            <button onClick={() => setGuests({...guests, adults: Math.max(1, guests.adults-1)})} style={styles.circleBtn}><FaMinus/></button>
                            <span style={styles.counterVal}>{guests.adults}</span>
                            <button onClick={() => setGuests({...guests, adults: guests.adults+1})} style={styles.circleBtn}><FaPlus/></button>
                        </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" {...animationProps}>
                  <button onClick={() => setStep(1)} style={styles.backLink}><FaArrowLeft /> Edit Details</button>
                  <h2 style={styles.stepTitle}>Guest Information</h2>
                  
                  <div style={styles.inputWrapper}>
                    <label style={styles.floatingLabel}>Full Name</label>
                    <input placeholder="John Doe" style={styles.premiumInput} value={userName} onChange={(e) => setUserName(e.target.value)} />
                  </div>

                  <div style={styles.inputWrapper}>
                    <label style={styles.floatingLabel}>Email Address</label>
                    <input placeholder="john@example.com" style={styles.premiumInput} value={userEmail} onChange={(e) => setUserEmail(e.target.value)} type="email" />
                  </div>

                  <div style={styles.paymentInfo}>
                    <FaCreditCard color="#C5A059"/>
                    <span>Secure Booking: Pay upon arrival at the concierge.</span>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" {...successAnimation} style={styles.successWrapper}>
                  <div style={styles.successIconBox}>
                    <FaCheckCircle size={50} color="#C5A059" />
                  </div>
                  <h2 style={styles.successTitle}>Reservation Confirmed</h2>
                  <p style={styles.successText}>We've sent a luxury itinerary to <strong>{userEmail}</strong>.</p>
                  <button onClick={onClose} style={styles.luxuryBtn}>Return to Explore</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {step < 3 && (
            <div style={styles.footer}>
                <button 
                onClick={step === 2 ? handleBook : () => setStep(2)} 
                disabled={(step === 1 && !date)} 
                style={{...styles.luxuryBtn, opacity: (step === 1 && !date) ? 0.5 : 1}}
                >
                {loading ? <FaSpinner className="spin" /> : (step === 2 ? `Confirm Reservation` : 'Continue to Details')}
                </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const animationProps = {
    initial: { x: 30, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -30, opacity: 0 },
    transition: { duration: 0.4, ease: "circOut" }
};

const successAnimation = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { delay: 0.2 }
};

const styles = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(5, 10, 20, 0.92)', backdropFilter: 'blur(12px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  modal: { background: '#FFFFFF', width: '100%', maxWidth: '1000px', height: '650px', borderRadius: '32px', overflow: 'hidden', display: 'flex', boxShadow: '0 40px 100px rgba(0,0,0,0.4)' },
  
  // Left Panel
  leftPanel: { width: '40%', background: '#0F172A', color: 'white', position: 'relative', overflow: 'hidden' },
  leftPanelContent: { padding: '50px 40px', position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column' },
  badge: { fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#C5A059', marginBottom: '10px', fontWeight: 'bold' },
  heading: { fontSize: '2.4rem', fontFamily: 'serif', lineHeight: 1.1, marginBottom: '30px' },
  imageCard: { position: 'relative', borderRadius: '20px', overflow: 'hidden', height: '200px', marginBottom: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  imgOverlay: { position: 'absolute', bottom: 0, padding: '20px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', width: '100%' },
  locationTag: { fontSize: '0.75rem', color: '#C5A059', display: 'flex', alignItems: 'center', gap: '5px' },
  hotelTitle: { margin: '5px 0 0 0', fontWeight: '500' },
  
  summaryDetails: { flex: 1 },
  summaryRow: { display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' },
  iconCircle: { width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(197, 160, 89, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C5A059' },
  summaryLabel: { fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '1px' },
  summaryValue: { margin: 0, fontSize: '0.95rem', fontWeight: '500' },
  
  totalSection: { paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' },
  totalLabel: { display: 'block', color: '#94a3b8', fontSize: '0.9rem' },
  totalAmount: { fontSize: '2rem', color: '#C5A059', fontWeight: '600' },

  // Right Panel
  rightPanel: { width: '60%', padding: '40px 50px', display: 'flex', flexDirection: 'column', background: '#fff' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  progressContainer: { display: 'flex', gap: '8px', alignItems: 'center' },
  progressDot: { height: '8px', borderRadius: '4px', transition: 'all 0.3s ease' },
  closeBtn: { border: 'none', background: '#f8fafc', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', color: '#64748b' },
  
  scrollContent: { flex: 1 },
  stepTitle: { fontSize: '1.8rem', color: '#1e293b', marginBottom: '8px', fontWeight: '600' },
  stepSub: { color: '#64748b', marginBottom: '30px', fontSize: '1rem' },
  
  inputWrapper: { marginBottom: '25px', position: 'relative' },
  floatingLabel: { fontSize: '0.8rem', fontWeight: '600', color: '#1e293b', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' },
  premiumInput: { width: '100%', padding: '16px 20px', borderRadius: '14px', border: '1.5px solid #e2e8f0', fontSize: '1rem', transition: 'border 0.2s', outline: 'none' },
  
  counterItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '20px', borderRadius: '18px' },
  counterControls: { display: 'flex', alignItems: 'center', gap: '20px' },
  circleBtn: { width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  counterVal: { fontSize: '1.2rem', fontWeight: '600', width: '20px', textAlign: 'center' },
  
  backLink: { background: 'none', border: 'none', color: '#C5A059', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', padding: 0 },
  paymentInfo: { display: 'flex', alignItems: 'center', gap: '12px', padding: '20px', background: '#f0f9ff', borderRadius: '14px', color: '#0c4a6e', fontSize: '0.9rem' },
  
  footer: { marginTop: '30px' },
  luxuryBtn: { width: '100%', padding: '20px', background: '#0F172A', color: 'white', border: 'none', borderRadius: '16px', fontWeight: '600', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 10px 20px rgba(15, 23, 42, 0.2)', transition: 'transform 0.2s' },
  
  successWrapper: { textAlign: 'center', padding: '20px 0' },
  successIconBox: { width: '100px', height: '100px', background: '#f8fafc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px' },
  successTitle: { fontSize: '2rem', marginBottom: '10px' },
  successText: { color: '#64748b', marginBottom: '40px' }
};

export default BookingModal;