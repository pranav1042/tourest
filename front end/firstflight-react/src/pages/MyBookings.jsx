import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiMapPin, FiCalendar, FiUsers, FiBriefcase, FiCheckCircle, FiHome } from 'react-icons/fi';
import { FaSpinner, FaPlane, FaQrcode } from 'react-icons/fa';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyBookings = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (!token || !storedUser || storedUser === "undefined") {
        navigate('/login');
        return;
      }

      try {
        const userObj = JSON.parse(storedUser);

        // --- BULLETPROOF FIX: Safely grab data, fallback to empty strings instead of "undefined" ---
        const safeUserId = userObj._id || userObj.id || '';
        const safeEmail = userObj.email || '';
        const safeName = userObj.name || userObj.fullName || '';

        // Start building the URL with email and name
        let queryUrl = `https://tourest-cidj.vercel.app/api/bookings/my-bookings?email=${encodeURIComponent(safeEmail)}&name=${encodeURIComponent(safeName)}`;
        
        // ONLY append userId if it is NOT empty and NOT the word "undefined"
        if (safeUserId && safeUserId !== 'undefined') {
            queryUrl += `&userId=${safeUserId}`;
        }

        const response = await axios.get(queryUrl, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log("📥 Bookings Fetched:", response.data); 
        
        if (response.data && response.data.data) {
          setBookings(response.data.data);
        } else if (Array.isArray(response.data)) {
          setBookings(response.data);
        } else {
          setBookings([]);
        }

      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        
        if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
          setError("Cannot connect to server. Please make sure your backend is running on port 5000!");
        } else if (error.response && error.response.status === 401) {
          setError("Your session has expired. Please log out from the top menu and log back in.");
        } else if (error.response && error.response.status === 500) {
          setError("Server crashed while fetching data. Please check your backend terminal.");
        } else {
          setError("Failed to load itineraries. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, [navigate]);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };
  const cardVariants = { hidden: { opacity: 0, y: 40, scale: 0.98 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0.3, duration: 0.8 } } };

  const getBookingImage = (booking, index) => {
    if (booking.img) return booking.img;
    if (booking.image) return booking.image;
    if (booking.packageImg) return booking.packageImg;
    const fallbackImages = [
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80"
    ];
    return fallbackImages[index % fallbackImages.length];
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.headerBanner}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={styles.headerContent}>
          <h1 style={styles.pageTitle}>My Journeys</h1>
          <p style={styles.pageSubtitle}>Review and manage your upcoming luxury travel experiences.</p>
        </motion.div>
      </div>

      <div style={styles.container}>
        {loading ? (
          <div style={styles.loadingContainer}>
            <FaSpinner className="spin" size={50} color="#C5A059" />
            <p style={{ marginTop: '20px', color: '#0F2435', fontWeight: '600', fontSize: '1.2rem' }}>Retrieving your itineraries...</p>
            <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          </div>
        ) : error ? (
          <div style={styles.emptyState}>
            <h2 style={{...styles.emptyTitle, color: '#ef4444'}}>Oops!</h2>
            <p style={styles.emptyDesc}>{error}</p>
          </div>
        ) : bookings.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} style={styles.emptyState}>
            <div style={styles.emptyIconBox}>
              <FiBriefcase size={45} color="#C5A059" />
            </div>
            <h2 style={styles.emptyTitle}>No trips booked yet</h2>
            <p style={styles.emptyDesc}>The world is waiting for you. Start planning your next unforgettable luxury adventure today.</p>
            <Link to="/packages" style={{ textDecoration: 'none' }}>
              <button className="explore-btn" style={styles.exploreBtn}>Explore Destinations</button>
            </Link>
          </motion.div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" style={styles.bookingsList}>
            <AnimatePresence>
              {bookings.map((booking, index) => {
                const destination = booking.packageTitle || booking.city || "Luxury Destination";
                const isPackage = !!booking.packageTitle || !!booking.selections?.flight;

                return (
                  <motion.div key={booking._id} variants={cardVariants} whileHover={{ y: -5, boxShadow: '0 25px 50px rgba(15, 36, 53, 0.12)' }} style={styles.ticketCard}>
                    
                    <div style={styles.ticketImageWrapper}>
                      <img src={getBookingImage(booking, index)} alt={destination} style={styles.ticketImage} />
                      <div style={styles.imageOverlay}></div>
                      <div style={styles.statusBadge}><FiCheckCircle size={14} /> Confirmed</div>
                    </div>
                    
                    <div style={styles.ticketMain}>
                      <div style={styles.ticketHeader}>
                        <div style={styles.bookingId}>REF: #{booking._id.slice(-6).toUpperCase()}</div>
                        <p style={styles.bookedOn}>Booked {new Date(booking.createdAt).toLocaleDateString()}</p>
                      </div>

                      <h2 style={styles.destinationTitle}>
                        <FiMapPin color="#C5A059" size={22} style={{ marginRight: '10px' }} />
                        {destination}
                      </h2>

                      <div style={styles.detailGrid}>
                        <div style={styles.detailItem}>
                          <FiCalendar style={styles.detailIcon} />
                          <div>
                            <small style={styles.detailLabel}>Travel Date</small>
                            <p style={styles.detailValue}>{booking.date || "TBD"}</p>
                          </div>
                        </div>
                        
                        <div style={styles.detailItem}>
                          <FiUsers style={styles.detailIcon} />
                          <div>
                            <small style={styles.detailLabel}>Passengers</small>
                            <p style={styles.detailValue}>{booking.guests?.adults || 1} Adult, {booking.guests?.children || 0} Child</p>
                          </div>
                        </div>

                        {isPackage && (
                          <>
                            <div style={styles.detailItem}>
                              <FaPlane style={styles.detailIcon} />
                              <div>
                                <small style={styles.detailLabel}>Airline</small>
                                <p style={styles.detailValue}>{booking.selections?.flight?.airline || "Not Selected"}</p>
                              </div>
                            </div>
                            <div style={styles.detailItem}>
                              <FiHome style={styles.detailIcon} />
                              <div>
                                <small style={styles.detailLabel}>Accommodation</small>
                                <p style={{...styles.detailValue, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px'}}>
                                  {booking.selections?.hotel?.name || "Not Selected"}
                                </p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div style={styles.ticketSidebar}>
                      <div style={styles.cutoutTop}></div>
                      <div style={styles.cutoutBottom}></div>
                      <div style={styles.dashedLine}></div>

                      <div style={{ textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <div style={{ marginBottom: '25px', color: '#e2e8f0', opacity: 0.8 }}>
                          <FaQrcode size={70} />
                        </div>
                        <div style={styles.priceBlock}>
                          <small style={styles.priceLabel}>Total Paid</small>
                          <h3 style={styles.priceValue}>₹{(booking.totalPrice || 0).toLocaleString()}</h3>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
      <style>{`.explore-btn { transition: all 0.3s ease; } .explore-btn:hover { background: #0F2435 !important; transform: translateY(-3px); box-shadow: 0 15px 25px rgba(15, 36, 53, 0.2) !important; }`}</style>
    </div>
  );
};

const styles = {
  pageWrapper: { minHeight: '100vh', background: '#f8fafc', paddingBottom: '100px', fontFamily: 'Inter, sans-serif' },
  headerBanner: { background: '#0F2435', paddingTop: '150px', paddingBottom: '80px', position: 'relative', overflow: 'hidden' },
  headerContent: { maxWidth: '1100px', margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 2 },
  pageTitle: { color: 'white', fontSize: '3.5rem', fontFamily: 'Playfair Display, serif', margin: '0 0 10px 0', letterSpacing: '1px' },
  pageSubtitle: { color: '#cbd5e1', fontSize: '1.15rem', margin: 0, fontWeight: '400', letterSpacing: '0.5px' },
  container: { maxWidth: '1100px', margin: '-50px auto 0 auto', padding: '0 20px', position: 'relative', zIndex: 10 },
  loadingContainer: { background: 'white', padding: '100px', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.08)' },
  emptyState: { background: 'white', padding: '100px 40px', borderRadius: '24px', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' },
  emptyIconBox: { width: '90px', height: '90px', background: 'rgba(197, 160, 89, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px auto' },
  emptyTitle: { fontSize: '2.2rem', color: '#0F2435', fontFamily: 'Playfair Display, serif', margin: '0 0 15px 0' },
  emptyDesc: { color: '#64748b', fontSize: '1.1rem', maxWidth: '450px', margin: '0 auto 35px auto', lineHeight: '1.7' },
  exploreBtn: { background: '#C5A059', color: 'white', border: 'none', padding: '16px 36px', borderRadius: '50px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 25px rgba(197, 160, 89, 0.3)' },
  bookingsList: { display: 'flex', flexDirection: 'column', gap: '35px' },
  ticketCard: { display: 'flex', background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(15, 36, 53, 0.05)', position: 'relative', border: '1px solid #e2e8f0', flexDirection: window.innerWidth < 900 ? 'column' : 'row', cursor: 'default' },
  ticketImageWrapper: { width: window.innerWidth < 900 ? '100%' : '260px', position: 'relative' },
  ticketImage: { width: '100%', height: '100%', objectFit: 'cover', minHeight: window.innerWidth < 900 ? '220px' : '100%' },
  imageOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.4), transparent)' },
  statusBadge: { position: 'absolute', top: '20px', left: '20px', background: '#10b981', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)', textTransform: 'uppercase', letterSpacing: '1px' },
  ticketMain: { flex: 1, padding: '35px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  ticketHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  bookingId: { color: '#0F2435', fontSize: '0.9rem', fontWeight: '800', letterSpacing: '1.5px', background: '#f1f5f9', padding: '6px 12px', borderRadius: '8px' },
  bookedOn: { margin: 0, color: '#94a3b8', fontSize: '0.9rem', fontWeight: '500' },
  destinationTitle: { margin: '0 0 35px 0', fontSize: '2.4rem', color: '#0F2435', fontFamily: 'Playfair Display, serif', display: 'flex', alignItems: 'center', fontWeight: '700' },
  detailGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '25px 15px' },
  detailItem: { display: 'flex', alignItems: 'flex-start', gap: '15px' },
  detailIcon: { color: '#C5A059', fontSize: '22px', marginTop: '2px', background: 'rgba(197, 160, 89, 0.1)', padding: '10px', borderRadius: '10px' },
  detailLabel: { display: 'block', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700', marginBottom: '6px' },
  detailValue: { margin: 0, color: '#1e293b', fontSize: '1.1rem', fontWeight: '700' },
  ticketSidebar: { width: window.innerWidth < 900 ? '100%' : '280px', background: '#0F2435', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  dashedLine: { position: 'absolute', left: 0, top: '20px', bottom: '20px', width: '2px', borderLeft: window.innerWidth < 900 ? 'none' : '2px dashed rgba(255,255,255,0.2)' },
  cutoutTop: { position: 'absolute', top: '-20px', left: window.innerWidth < 900 ? '50%' : '-20px', transform: window.innerWidth < 900 ? 'translateX(-50%)' : 'none', width: '40px', height: '40px', background: '#f8fafc', borderRadius: '50%', zIndex: 5 },
  cutoutBottom: { position: 'absolute', bottom: '-20px', left: window.innerWidth < 900 ? '50%' : '-20px', transform: window.innerWidth < 900 ? 'translateX(-50%)' : 'none', width: '40px', height: '40px', background: '#f8fafc', borderRadius: '50%', zIndex: 5 },
  priceBlock: { margin: 0 },
  priceLabel: { display: 'block', color: '#cbd5e1', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '600', marginBottom: '8px' },
  priceValue: { margin: 0, fontSize: '2.8rem', color: '#C5A059', fontWeight: '800', fontFamily: 'Playfair Display, serif' }
};

export default MyBookings;