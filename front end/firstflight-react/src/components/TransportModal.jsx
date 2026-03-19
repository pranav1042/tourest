import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlane, FaTrain, FaBus, FaTaxi, FaTimes, FaCheckCircle, 
  FaMapMarkerAlt, FaSpinner, FaArrowLeft, FaCloudSun, FaTicketAlt, FaExclamationCircle,
  FaQrcode, FaTimesCircle, FaSearchLocation
} from 'react-icons/fa';
import axios from 'axios';

const TransportModal = ({ place, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingRef, setBookingRef] = useState(null);
  const pollingInterval = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', date: '', passengers: 1, upiId: '', originCity: ''
  });

  const [errors, setErrors] = useState({});
  const [liveTransports, setLiveTransports] = useState([]);
  const [isFetchingLive, setIsFetchingLive] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // --- BACKEND AUTOCOMPLETE STATES ---
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]);

  // --- LOCK BACKGROUND SCROLLING ---
  useEffect(() => {
    document.body.style.overflow = 'hidden'; 
    return () => {
      document.body.style.overflow = 'unset'; 
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, []);

  // --- LIVE INTERNET CITY FETCHING (VIA BACKEND) ---
  useEffect(() => {
    const fetchCitySuggestions = async () => {
      if (formData.originCity.length >= 2) {
        try {
          // Call your backend API, which securely fetches from the internet
          const res = await axios.get(`http://localhost:5000/api/cities/suggest?q=${formData.originCity}`);
          if (res.data.success) {
            setFilteredCities(res.data.cities);
            setShowSuggestions(true);
          }
        } catch (error) {
          console.error("Failed to fetch cities from backend", error);
        }
      } else {
        setShowSuggestions(false);
      }
    };

    // Debounce: Wait 400ms after user stops typing before hitting the backend
    const timeoutId = setTimeout(() => {
      fetchCitySuggestions();
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [formData.originCity]);

  const handleOriginChange = (e) => {
    setFormData({ ...formData, originCity: e.target.value });
  };

  const selectCity = (city) => {
    setFormData({ ...formData, originCity: city });
    setShowSuggestions(false);
  };

  // --- FETCH TRANSPORT ROUTES ---
  const handleSearchTransport = async () => {
    if (!formData.originCity.trim() || !formData.date) {
      setSearchError("Please enter your departing city and date.");
      return;
    }

    setIsFetchingLive(true);
    setSearchError(null);
    setSelectedTransport(null);
    setHasSearched(true);

    try {
      const res = await axios.get(`http://localhost:5000/api/transport/search`, {
        params: {
          origin: formData.originCity,
          destination: place?.city,
          date: formData.date
        }
      });

      if (res.data.success) {
        const { flights, trains, buses } = res.data.data;
        const combined = [...(flights || []), ...(trains || []), ...(buses || [])];
        setLiveTransports(combined);

        if (combined.length === 0) {
          setSearchError(`Direct transport from ${formData.originCity} to ${place?.city} is currently not available. Please try a major nearby city.`);
        }
      }
    } catch (err) {
      console.error("Search failed:", err);
      setSearchError(err.response?.data?.message || `Cannot find a route from ${formData.originCity} to ${place?.city}.`);
      setLiveTransports([]);
    } finally {
      setIsFetchingLive(false);
    }
  };

  const getIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'flight': return <FaPlane size={24} />;
      case 'train': return <FaTrain size={24} />;
      case 'bus': return <FaBus size={24} />;
      case 'taxi': return <FaTaxi size={24} />;
      case 'cab': return <FaTaxi size={24} />;
      default: return <FaBus size={24} />;
    }
  };

  // --- Calculations ---
  const pax = formData.passengers || 1;
  const pricePerPerson = selectedTransport ? selectedTransport.price : 0;
  const subTotal = pricePerPerson * pax;
  const taxes = selectedTransport ? subTotal * 0.18 : 0; 
  const grandTotal = subTotal + taxes;

  // --- STRICT VALIDATION LOGIC ---
  const validateForm = () => {
    let newErrors = {};

    if (step === 2) {
      if (!formData.name.trim()) newErrors.name = "Full name is required.";

      const phoneRegex = /^[0-9]{10}$/;
      if (!formData.phone) newErrors.phone = "Phone number is required.";
      else if (!phoneRegex.test(formData.phone)) newErrors.phone = "Enter a valid 10-digit Indian number.";

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email) newErrors.email = "Email address is required.";
      else if (!emailRegex.test(formData.email)) newErrors.email = "Enter a valid email.";
    }

    if (step === 3) {
      const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
      if (!formData.upiId) newErrors.upiId = "UPI ID is required to verify payment.";
      else if (!upiRegex.test(formData.upiId)) newErrors.upiId = "Enter a valid UPI ID (e.g. user@okbank).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData({ ...formData, phone: val });
    if (errors.phone) setErrors({ ...errors, phone: null });
  };

  const handleNextStep = async () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (validateForm()) setStep(3); 
    } else if (step === 3) {
      if (validateForm()) await initiatePayment(); 
    }
  };

  // --- 1. Trigger Backend & Start Polling ---
  const initiatePayment = async () => {
    setLoading(true);
    try {
      // FIX: Securely fetch User ID to attach to the booking payload
      const storedUser = localStorage.getItem('user');
      const userObj = storedUser && storedUser !== 'undefined' ? JSON.parse(storedUser) : null;

      const response = await axios.post('http://localhost:5000/api/bookings/initiate', { 
        packageId: place?._id || "TRN-" + Math.floor(Math.random() * 10000),
        packageTitle: `Transport from ${formData.originCity} to ${place?.city}`,
        formData: { 
          fullName: formData.name, 
          email: formData.email, 
          phone: `+91${formData.phone}`, 
          date: formData.date,
          adults: pax,
          children: 0
        },
        selections: {
          flight: { airline: `${selectedTransport.provider} (${selectedTransport.type})`, price: pricePerPerson },
          hotel: null
        },
        grandTotal,
        upiId: formData.upiId,
        // FIX: Sending the correct user ID!
        userId: userObj?._id,
        email: userObj?.email
      });

      // Safely capture the booking ID
      const finalId = response.data.bookingId || `TRN-${Math.floor(Math.random()*90000)+10000}`;

      if (response.data.success || response.data.bookingId) {
        setBookingRef(finalId);
        setStep(4); 
        startPolling(finalId); 
      }
    } catch (err) {
      console.error(err);
      alert("Failed to initiate payment. Check server.");
      setLoading(false);
    }
  };

  // --- 2. Poll Backend every 3 seconds ---
  const startPolling = (id) => {
    pollingInterval.current = setInterval(async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/bookings/status/${id}`);
        
        if (res.data.status === 'approved') {
          // STOP POLLING FIRST
          clearInterval(pollingInterval.current);
          
          // Wait for the email to send BEFORE changing the step
          try {
            console.log("Payment approved. Sending email...");
            await axios.post('http://localhost:5000/api/bookings/send-email', {
              email: formData.email,
              fullName: formData.name, // Mapped to the correct state variable
              bookingRef: id,
              destination: place?.city || 'Destination',
              date: formData.date,
              grandTotal: grandTotal,
              hotelName: 'N/A (Transport Only)',
              airline: selectedTransport ? `${selectedTransport.provider} (${selectedTransport.type})` : 'TBD'
            });
            console.log("Email dispatched successfully.");
          } catch (emailError) {
            console.error("Warning: Email failed to send.", emailError);
          }

          // NOW move to the success screen
          setLoading(false);
          setStep(5); 

        } else if (res.data.status === 'rejected') {
          clearInterval(pollingInterval.current);
          setLoading(false);
          setStep(6); 
        }
      } catch (error) {
        console.error("Polling error", error);
      }
    }, 3000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.overlay} onClick={onClose}>
      <motion.div 
        initial={{ scale: 0.95, y: 30, opacity: 0 }} 
        animate={{ scale: 1, y: 0, opacity: 1 }} 
        exit={{ scale: 0.95, y: 30, opacity: 0 }} 
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={e => e.stopPropagation()} 
        style={styles.modal}
      >
        
        {/* --- LEFT PANEL: RECEIPT & SUMMARY --- */}
        <div style={styles.leftPanel}>
          <div style={styles.imageWrapper}>
            <img src={place?.img} alt={place?.city} style={styles.img} />
            <div style={styles.imgOverlay}>
              <span style={styles.badge}>{place?.category || 'Destination'}</span>
              <h3 style={{ fontFamily: 'Playfair Display, serif', margin: '15px 0 0', fontSize:'2.4rem', fontWeight: '700' }}>{place?.city}</h3>
              <small style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', marginTop: '8px', fontSize: '1rem' }}>
                <FaMapMarkerAlt color="#d6a848"/> {place?.country}
              </small>
            </div>
          </div>

          <div style={styles.receiptBox}>
            <h5 style={styles.receiptHeading}>Trip Estimate</h5>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', fontSize: '1rem', color: '#cbd5e1' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaCloudSun color="#d6a848" size={20}/> {place?.weather || '22°C Clear'}
                </span>
                <span style={{ fontWeight: '600', color: '#fff' }}>{formData.date || 'Select Date'}</span>
            </div>

            {formData.originCity && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8', marginBottom: '20px', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase' }}>
                {formData.originCity} <FaArrowLeft style={{transform: 'rotate(180deg)'}} color="#d6a848"/> {place?.city}
              </div>
            )}

            <div style={styles.receiptRow}>
                <span>Tickets ({pax} Pax)</span>
                <span>₹{subTotal.toLocaleString()}</span>
            </div>
            
            {selectedTransport && (
                <div style={{...styles.receiptRow, fontSize: '0.9rem', color: '#94a3b8', marginTop: '-15px'}}>
                  <span>{selectedTransport.provider} ({selectedTransport.type})</span>
                </div>
            )}

            <div style={{...styles.receiptRow, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '25px'}}>
              <span>Taxes & Fees (18%)</span>
              <span>₹{taxes.toLocaleString()}</span>
            </div>
            <div style={styles.totalRow}>
                <span>Grand Total</span>
                <span style={{color: '#d6a848'}}>₹{grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* --- RIGHT PANEL: INTERACTIVE FLOW --- */}
        <div style={styles.rightPanel}>
          <div style={styles.header}>
            <div style={{width:'33%'}}>
              {step > 1 && step < 4 && <button onClick={() => setStep(step - 1)} style={styles.backBtn}><FaArrowLeft/> Back</button>}
            </div>
            <div style={{width:'33%', textAlign:'center', fontWeight:'800', color:'#64748b', fontSize: '1rem', letterSpacing: '2px'}}>
              {step < 4 ? `STEP ${step} OF 3` : step === 4 ? 'PROCESSING' : step === 5 ? 'COMPLETED' : 'FAILED'}
            </div>
            <div style={{width:'33%', display:'flex', justifyContent:'flex-end'}}>
              <button onClick={onClose} style={styles.closeBtn}>
                <FaTimes size={18}/>
              </button>
            </div>
          </div>

          <div style={styles.scrollContent}>
            <AnimatePresence mode='wait'>
              
              {/* STEP 1: TRANSPORT OPTIONS (WITH ORIGIN SEARCH & AUTOCOMPLETE) */}
              {step === 1 && (
                <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                  <h2 style={styles.stepTitle}>Plan your journey</h2>
                  
                  <div style={styles.grid2}>
                    <div style={{ position: 'relative' }}>
                        <label style={styles.label}>Departing From (India)</label>
                        <input 
                          type="text" 
                          placeholder="Search Indian city..." 
                          value={formData.originCity} 
                          onChange={handleOriginChange} 
                          onFocus={() => { if (formData.originCity) setShowSuggestions(true) }}
                          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} 
                          style={styles.input} 
                        />
                        
                        {/* LIVE BACKEND AUTOCOMPLETE DROPDOWN */}
                        <AnimatePresence>
                          {showSuggestions && filteredCities.length > 0 && (
                            <motion.ul 
                              initial={{ opacity: 0, y: -10 }} 
                              animate={{ opacity: 1, y: 0 }} 
                              exit={{ opacity: 0, y: -10 }} 
                              style={styles.suggestionsContainer}
                            >
                              {filteredCities.map((city, index) => (
                                <li key={index} onClick={() => selectCity(city)} style={styles.suggestionItem}>
                                  <FaMapMarkerAlt color="#d6a848" /> {city}
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Passengers</label>
                        <input 
                          type="number" min="1" 
                          value={formData.passengers} 
                          onChange={e => setFormData({...formData, passengers: parseInt(e.target.value) || 1})} 
                          style={styles.input} 
                        />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-end', marginBottom: '30px' }}>
                    <div style={{...styles.inputGroup, flex: 1}}>
                        <label style={styles.label}>Travel Date</label>
                        <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} style={styles.input} />
                    </div>
                    <button 
                      onClick={handleSearchTransport} 
                      style={{ padding: '17px 30px', background: '#0f172a', color: 'white', borderRadius: '14px', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', height: 'max-content', boxShadow: '0 4px 15px rgba(15,36,53,0.1)' }}
                    >
                      <FaSearchLocation /> Find Routes
                    </button>
                  </div>

                  {/* LINE SEPARATOR */}
                  <div style={{ height: '1px', background: '#e2e8f0', margin: '30px 0' }}></div>

                  <h4 style={styles.sectionHeader}>
                    {isFetchingLive ? "📡 Analyzing routes..." : hasSearched && !searchError ? "Available Live Prices" : "Enter details to see routes"}
                  </h4>
                  
                  {isFetchingLive ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
                      <FaSpinner className="fa-spin" size={50} color="#d6a848" style={{ marginBottom: '20px' }}/>
                      <p style={{ fontWeight: '600', letterSpacing: '1px', fontSize: '1.2rem' }}>Checking availability from {formData.originCity}...</p>
                    </div>
                  ) : searchError ? (
                    <div style={{ textAlign: 'center', padding: '40px 30px', background: '#fff1f2', borderRadius: '20px', color: '#be123c', border: '1px solid #fecdd3' }}>
                      <FaExclamationCircle size={40} style={{ marginBottom: '15px' }} />
                      <p style={{ fontWeight: '700', fontSize: '1.1rem', margin: 0, lineHeight: '1.6' }}>{searchError}</p>
                    </div>
                  ) : hasSearched && liveTransports.length > 0 ? (
                    <div style={styles.cardContainer}>
                      {liveTransports.map((opt, i) => {
                        const isSelected = selectedTransport?.provider === opt.provider && selectedTransport?.price === opt.price && selectedTransport?.time === opt.time;

                        return (
                          <div key={i} onClick={() => setSelectedTransport(opt)} 
                            style={{
                              ...styles.selectCard, 
                              borderColor: isSelected ? '#d6a848' : '#e2e8f0',
                              background: isSelected ? '#fffcf4' : '#fff', 
                              boxShadow: isSelected ? '0 12px 30px rgba(214, 168, 72, 0.18)' : '0 2px 10px rgba(0,0,0,0.02)',
                              transform: isSelected ? 'scale(1.01)' : 'scale(1)',
                              position: 'relative'
                            }}>
                            
                            {isSelected && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ position: 'absolute', top: '15px', right: '15px', color: '#10b981' }}>
                                <FaCheckCircle size={22} />
                              </motion.div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                <div style={{ 
                                  width: '65px', height: '65px', 
                                  background: isSelected ? '#d6a848' : '#f1f5f9', 
                                  color: isSelected ? '#fff' : '#0f172a',
                                  borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', 
                                  transition: 'all 0.3s ease' 
                                }}>
                                  {getIcon(opt.type)}
                                </div>
                                
                                <div>
                                  <strong style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: '800' }}>
                                    {opt.provider || opt.name} <span style={{ fontSize: '0.95rem', color: '#94a3b8', fontWeight: '600' }}>({opt.type})</span>
                                  </strong>
                                  <div style={{ fontSize: '0.95rem', color: '#64748b', marginTop: '6px' }}>
                                    Departs at: <span style={{ color: '#0f172a', fontWeight: '700' }}>{opt.departureTime || opt.time}</span>
                                  </div>
                                  <div style={{ fontSize: '0.95rem', color: '#64748b', marginTop: '2px' }}>
                                    Duration: {opt.duration}
                                  </div>
                                </div>
                              </div>

                              <div style={{ textAlign: 'right', paddingRight: isSelected ? '35px' : '0', transition: 'padding 0.3s ease' }}>
                                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>₹{(opt.price || 0).toLocaleString()}</div>
                                <small style={{ color: '#94a3b8', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase' }}>per person</small>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </motion.div>
              )}

              {/* STEP 2: DETAILS WITH VALIDATION */}
              {step === 2 && (
                <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                  <h2 style={styles.stepTitle}>Passenger Details</h2>
                  <div style={{display:'grid', gap:'30px'}}>
                    
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Full Name</label>
                        <input 
                          placeholder="E.g. John Doe" 
                          value={formData.name} 
                          onChange={e => { setFormData({...formData, name:e.target.value}); if(errors.name) setErrors({...errors, name:null}); }} 
                          style={{...styles.input, borderColor: errors.name ? '#ef4444' : '#e2e8f0'}} 
                        />
                        {errors.name && <span style={styles.errorText}><FaExclamationCircle/> {errors.name}</span>}
                    </div>

                    <div style={styles.grid2}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Phone Number</label>
                            <div style={{...styles.phoneWrapper, borderColor: errors.phone ? '#ef4444' : '#e2e8f0'}}>
                               <span style={styles.phonePrefix}>+91</span>
                               <input 
                                 placeholder="9876543210" 
                                 type="tel"
                                 value={formData.phone} 
                                 onChange={handlePhoneChange} 
                                 style={styles.phoneInput} 
                               />
                            </div>
                            {errors.phone && <span style={styles.errorText}><FaExclamationCircle/> {errors.phone}</span>}
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email Address</label>
                            <input 
                              placeholder="name@gmail.com" 
                              type="email" 
                              value={formData.email} 
                              onChange={e => { setFormData({...formData, email:e.target.value}); if(errors.email) setErrors({...errors, email:null}); }} 
                              style={{...styles.input, borderColor: errors.email ? '#ef4444' : '#e2e8f0'}} 
                            />
                            {errors.email && <span style={styles.errorText}><FaExclamationCircle/> {errors.email}</span>}
                        </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: REAL QR CODE PAYMENT */}
              {step === 3 && (
                <motion.div key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                  <h2 style={styles.stepTitle}>Secure Payment</h2>
                  
                  <div style={{ display: 'flex', gap: '30px', background: '#f8fafc', padding: '30px', borderRadius: '24px', border: '1px solid #e2e8f0', marginBottom: '30px', alignItems: 'center', flexDirection: window.innerWidth < 768 ? 'column' : 'row' }}>
                    
                    <div style={{ flex: 1, textAlign: 'center', padding: '25px', background: '#fff', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
                      <img 
                        src="/qrcode.jpg" 
                        alt="UPI QR Code" 
                        style={{ width: '220px', height: '220px', objectFit: 'contain', borderRadius: '12px', marginBottom: '20px', border: '1px solid #e2e8f0', padding: '10px' }} 
                      />
                      <h4 style={{ color: '#0f172a', margin: '0 0 5px 0', fontSize: '1.2rem', fontWeight: '800' }}>Prajapati Pranav</h4>
                      <p style={{ color: '#d6a848', fontWeight: '700', margin: 0, fontSize: '1rem', letterSpacing: '1px' }}>9316859186@fam</p>
                      <div style={{ marginTop: '20px', padding: '12px', background: '#f1f5f9', borderRadius: '10px', fontSize: '0.9rem', color: '#64748b' }}>
                        Scan using any UPI app to pay <strong style={{color: '#0f172a', fontSize: '1rem'}}>₹{grandTotal.toLocaleString()}</strong>
                      </div>
                    </div>

                    <div style={{ flex: 1 }}>
                      <h4 style={{ color: '#0f172a', margin: '0 0 15px 0', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '800' }}>
                        <FaQrcode color="#d6a848"/> Verify Payment
                      </h4>
                      <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '30px', lineHeight: '1.6' }}>
                        After completing the payment using the QR code, please enter your UPI ID below so we can verify the transaction.
                      </p>
                      
                      <div style={styles.inputGroup}>
                          <label style={styles.label}>Your UPI ID</label>
                          <input 
                            placeholder="e.g., yourname@okbank" 
                            value={formData.upiId} 
                            onChange={e => { setFormData({...formData, upiId:e.target.value}); if(errors.upiId) setErrors({...errors, upiId:null}); }} 
                            style={{...styles.input, borderColor: errors.upiId ? '#ef4444' : '#d6a848', background: '#fff', borderWidth: '2px'}} 
                          />
                          {errors.upiId && <span style={styles.errorText}><FaExclamationCircle/> {errors.upiId}</span>}
                      </div>
                    </div>
                  </div>

                  <p style={{textAlign: 'center', color: '#94a3b8', fontSize: '0.95rem'}}>*Payment verification may take a few moments. Please do not refresh the page.</p>
                </motion.div>
              )}

              {/* STEP 4: PROCESSING (POLLING) */}
              {step === 4 && (
                <motion.div key="step4" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{textAlign:'center', padding: '60px 0'}}>
                  <FaSpinner className="fa-spin" size={80} color="#d6a848" style={{marginBottom:'30px'}} />
                  <h2 style={{color: '#0f172a', margin:'0 0 15px', fontFamily: 'Playfair Display, serif', fontSize: '2.5rem'}}>Awaiting Verification...</h2>
                  <p style={{color: '#64748b', fontSize: '1.2rem', lineHeight: '1.6'}}>We are verifying your transaction from <strong>{formData.upiId}</strong>.<br/>Do not close this window.</p>
                </motion.div>
              )}

              {/* STEP 5: SUCCESS (E-TICKET) */}
              {step === 5 && (
                <motion.div key="step5" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{textAlign:'center', padding: '30px 0'}}>
                  <FaCheckCircle size={80} color="#10b981" style={{marginBottom:'25px'}} />
                  <h2 style={{color: '#0f172a', margin:'0 0 10px', fontFamily: 'Playfair Display, serif', fontSize: '2.8rem'}}>Booking Confirmed</h2>
                  <p style={{color: '#64748b', marginBottom:'20px', fontSize: '1.2rem'}}>Reference Number: <strong style={{color: '#0f172a'}}>#{bookingRef}</strong></p>
                  
                  <div style={{ background: '#d1fae5', color: '#065f46', padding: '10px 20px', borderRadius: '50px', display: 'inline-block', marginBottom: '30px', fontWeight: '600', fontSize: '0.9rem' }}>
                    A confirmation email has been successfully sent to {formData.email}
                  </div>

                  <div style={{background:'#fff', borderRadius:'24px', border:'1px solid #e2e8f0', textAlign:'left', overflow:'hidden', boxShadow:'0 20px 40px rgba(0,0,0,0.1)'}}>
                    <div style={{background:'#0f172a', color:'white', padding:'30px', display:'flex', justifyContent:'space-between', alignItems: 'center'}}>
                      <div><h4 style={{margin:0, display: 'flex', alignItems:'center', gap: '12px', fontSize: '1.2rem', letterSpacing: '2px'}}><FaTicketAlt color="#d6a848" size={24}/> E-TICKET</h4></div>
                      <div style={{fontWeight: '800', letterSpacing: '1px', fontSize: '1.1rem'}}>{formData.name.toUpperCase()}</div>
                    </div>
                    
                    <div style={{padding:'40px'}}>
                      <small style={{color:'#94a3b8', display:'block', marginBottom: '8px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase'}}>Route</small>
                      <strong style={{color:'#0f172a', fontSize:'1.4rem', display: 'block', marginBottom: '30px'}}>{formData.originCity} ➔ {place?.city}</strong>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                        <div>
                          <div style={styles.ticketLabel}>Operator</div>
                          <div style={styles.ticketValue}>{selectedTransport?.provider || selectedTransport?.name} ({selectedTransport?.type})</div>
                        </div>
                        <div>
                          <div style={styles.ticketLabel}>Travel Date</div>
                          <div style={styles.ticketValue}>{formData.date} at {selectedTransport?.departureTime || selectedTransport?.time}</div>
                        </div>
                        <div>
                          <div style={styles.ticketLabel}>Duration</div>
                          <div style={styles.ticketValue}>{selectedTransport?.duration}</div>
                        </div>
                        <div>
                          <div style={styles.ticketLabel}>Passengers</div>
                          <div style={styles.ticketValue}>{pax} Adult(s)</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button onClick={onClose} style={{...styles.primaryBtn, marginTop:'50px'}}>Download Ticket & Close</button>
                </motion.div>
              )}

              {/* STEP 6: FAILED */}
              {step === 6 && (
                <motion.div key="step6" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{textAlign:'center', padding: '60px 0'}}>
                  <FaTimesCircle size={80} color="#ef4444" style={{marginBottom:'25px'}} />
                  <h2 style={{color: '#0f172a', margin:'0 0 10px', fontFamily: 'Playfair Display, serif', fontSize: '2.8rem'}}>Payment Failed</h2>
                  <p style={{color: '#64748b', marginBottom:'40px', fontSize: '1.2rem'}}>The payment was declined or timed out. Please try again.</p>
                  <button onClick={() => setStep(3)} style={styles.primaryBtn}>Retry Payment</button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Footer Action Button */}
          {step < 4 && (
            <div style={{padding: '30px 60px', borderTop: '1px solid #f1f5f9'}}>
              <button 
                disabled={(!selectedTransport || !formData.date) && step === 1}
                onClick={handleNextStep} 
                style={{
                  ...styles.primaryBtn, 
                  opacity: ((!selectedTransport || !formData.date) && step === 1) ? 0.5 : 1,
                  cursor: ((!selectedTransport || !formData.date) && step === 1) ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? <FaSpinner className="fa-spin"/> : step === 3 ? `I Have Paid ₹${grandTotal.toLocaleString()}` : step === 2 ? 'Proceed to Payment' : 'Continue to Passenger Details'}
              </button>
            </div>
          )}
        </div>
      </motion.div>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } } 
        .fa-spin { animation: spin 1s linear infinite; }
      `}</style>
    </motion.div>
  );
};

// --- SPACIOUS / PALACE STYLES ---
const styles = {
  overlay: { 
    position: 'fixed', inset: 0, 
    background: 'rgba(15, 23, 42, 0.85)', 
    backdropFilter: 'blur(12px)', 
    zIndex: 99999, 
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '20px'
  },
  modal: { 
    background: '#ffffff', 
    width: '98%', maxWidth: '1280px', 
    height: '90vh', maxHeight: '900px', 
    borderRadius: '32px', overflow: 'hidden', 
    display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row',
    boxShadow: '0 40px 80px rgba(0, 0, 0, 0.4)'
  },
  leftPanel: { 
    width: window.innerWidth < 768 ? '100%' : '35%', 
    background: '#0f172a', padding: '50px 40px', 
    color: 'white', display: 'flex', flexDirection: 'column' 
  },
  rightPanel: { 
    width: window.innerWidth < 768 ? '100%' : '65%', 
    display: 'flex', flexDirection: 'column',
    position: 'relative', background: '#ffffff'
  },
  imageWrapper: { position: 'relative', borderRadius: '20px', overflow: 'hidden', height: '280px', marginBottom: '50px' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  imgOverlay: { position: 'absolute', bottom: 0, width: '100%', background: 'linear-gradient(to top, rgba(15,23,42,1), transparent)', padding: '30px 20px' },
  badge: { background: '#d6a848', color: '#0f172a', padding: '8px 16px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' },
  receiptBox: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '24px', padding: '35px', marginTop: 'auto' },
  receiptHeading: { margin: '0 0 30px', color: '#fff', fontSize: '1.4rem', fontWeight: '700', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' },
  receiptRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: '#cbd5e1', fontWeight: '500', fontSize: '1.05rem' },
  totalRow: { display: 'flex', justifyContent: 'space-between', marginTop: '25px', fontSize: '1.8rem', fontWeight: '800' },
  
  header: { padding: '35px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' },
  backBtn: { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', fontWeight: '800', fontSize: '1.05rem', transition: 'color 0.2s' },
  closeBtn: { background: '#f8fafc', border: 'none', borderRadius: '50%', width:'45px', height:'45px', display:'flex', alignItems:'center', justifyContent:'center', cursor: 'pointer', color: '#64748b', transition: 'all 0.2s' },
  scrollContent: { flex: 1, overflowY: 'auto', padding: '50px 60px' },
  stepTitle: { color: '#0f172a', marginTop: 0, marginBottom: '35px', fontSize: '2.8rem', fontFamily: 'Playfair Display, serif', fontWeight: '800' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '35px', marginBottom: '30px' },
  
  /* Input Form Styles */
  inputGroup: { display: 'flex', flexDirection: 'column' },
  label: { marginBottom: '12px', fontSize: '0.85rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { padding: '16px 20px', width: '100%', borderRadius: '14px', border: '2px solid #e2e8f0', outline: 'none', fontSize: '1.1rem', color: '#0f172a', background: '#f8fafc', transition: 'all 0.3s', fontWeight: '600' },
  
  /* Autocomplete Styles */
  suggestionsContainer: { position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', marginTop: '5px', maxHeight: '200px', overflowY: 'auto', zIndex: 100, listStyle: 'none', padding: '10px 0', margin: 0 },
  suggestionItem: { padding: '12px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.05rem', color: '#0f172a', fontWeight: '600', transition: 'background 0.2s' },
  
  /* Phone Input Wrapper */
  phoneWrapper: { display: 'flex', alignItems: 'center', background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', transition: 'all 0.3s' },
  phonePrefix: { padding: '18px 20px', background: '#f1f5f9', color: '#64748b', fontWeight: '800', fontSize: '1.15rem', borderRight: '2px solid #e2e8f0' },
  phoneInput: { padding: '18px 20px', border: 'none', outline: 'none', fontSize: '1.15rem', color: '#0f172a', background: 'transparent', width: '100%', fontWeight: '500', letterSpacing: '1px' },
  
  errorText: { color: '#ef4444', fontSize: '0.85rem', fontWeight: '700', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '5px' },

  sectionHeader: { color: '#0f172a', fontSize: '1.3rem', marginBottom: '25px', fontWeight: '800' },
  cardContainer: { display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px', paddingRight: '5px' },
  selectCard: { borderRadius: '20px', border: '2px solid', cursor: 'pointer', padding: '25px', transition: 'all 0.3s ease' },
  primaryBtn: { padding: '22px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '16px', fontWeight: '800', fontSize: '1.2rem', cursor: 'pointer', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'all 0.3s', letterSpacing: '1px' },
  ticketLabel: { fontSize: '0.85rem', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' },
  ticketValue: { fontSize: '1.15rem', color: '#0f172a', fontWeight: '800' }
};

export default TransportModal;