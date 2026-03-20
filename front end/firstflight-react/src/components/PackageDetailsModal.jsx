import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTimes, FaMapMarkerAlt, FaCheck, FaArrowLeft, FaCheckCircle, 
  FaSpinner, FaPlaneDeparture, FaHotel, FaMapSigns, FaSuitcase, 
  FaHome, FaPlaneArrival, FaStar, FaGlobe, FaTicketAlt, FaExclamationCircle,
  FaQrcode, FaTimesCircle
} from 'react-icons/fa';
import axios from 'axios';

const PackageDetailsModal = ({ onClose, selectedCity }) => {
  const [step, setStep] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  
  // Data States
  const [cityData, setCityData] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState(null);

  // Form & Selection States
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', date: '', homeCity: 'Mumbai', adults: 2, children: 0, upiId: ''
  });
  const [selections, setSelections] = useState({ flight: null, hotel: null });
  const [errors, setErrors] = useState({});
  
  // Polling State
  const [bookingRef, setBookingRef] = useState(null);
  const pollingInterval = useRef(null);

  // --- LOCK BACKGROUND SCROLLING ---
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, []);

  // --- FETCH CITY DATA ---
  useEffect(() => {
    const fetchCityData = async () => {
      setIsLoadingData(true);
      setError(null);
      try {
        const response = await axios.get(`https://tourest-cidj.vercel.app/api/packages/${selectedCity}`);
        const data = response.data;
        
        setCityData(data);
        if (data.flights?.length > 0 && data.hotels?.length > 0) {
          setSelections({ flight: data.flights[0], hotel: data.hotels[0] });
        }
      } catch (err) {
        console.error("Error fetching city data:", err);
        setError("Failed to load destination data. Please check your server.");
      } finally {
        setIsLoadingData(false);
      }
    };
    if (selectedCity) fetchCityData();
  }, [selectedCity]);

  // --- STRICT VALIDATION LOGIC ---
  const validateForm = () => {
    let newErrors = {};

    if (step === 4) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";
      
      const phoneRegex = /^[0-9]{10}$/;
      if (!formData.phone) newErrors.phone = "Phone number is required.";
      else if (!phoneRegex.test(formData.phone)) newErrors.phone = "Enter a valid 10-digit number.";
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email) newErrors.email = "Email address is required.";
      else if (!emailRegex.test(formData.email)) newErrors.email = "Enter a valid email.";
    }

    if (step === 5) {
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

  // --- CALCULATIONS ---
  const pax = (parseInt(formData.adults) || 0) + (parseInt(formData.children) || 0);
  const baseCost = cityData?.basePrice || cityData?.price || 0; 
  const packageCost = (baseCost * (parseInt(formData.adults) || 0)) + (baseCost * 0.7 * (parseInt(formData.children) || 0));
  const flightCost = (selections.flight?.price || 0) * pax;
  const hotelNights = cityData?.nights || 1; 
  const hotelCost = (selections.hotel?.pricePerNight || 0) * hotelNights;
  const subTotal = packageCost + flightCost + hotelCost;
  const taxes = subTotal * 0.18; 
  const grandTotal = subTotal + taxes;

  // --- NAVIGATION & BOOKING INIT ---
  const handleNextStep = async () => {
    if (step < 4) setStep(step + 1);
    else if (step === 4) { if (validateForm()) setStep(5); } 
    else if (step === 5) { if (validateForm()) await initiatePayment(); } 
  };

  // --- 1. Trigger Backend & Start Polling ---
  const initiatePayment = async () => {
    setIsBooking(true);
    try {
      // FIX: Securely fetch User ID to attach to the booking payload
      const storedUser = localStorage.getItem('user');
      const userObj = storedUser && storedUser !== 'undefined' ? JSON.parse(storedUser) : null;

      const response = await axios.post('https://tourest-cidj.vercel.app/api/bookings/initiate', { 
        packageId: cityData.cityId, 
        packageTitle: cityData.title,
        formData: { ...formData, phone: `+91${formData.phone}` },
        selections, 
        grandTotal,
        upiId: formData.upiId,
        // FIX: Sending the correct user ID!
        userId: userObj?._id,
        email: userObj?.email
      });

      if (response.data.success) {
        setBookingRef(response.data.bookingId);
        setStep(6); 
        startPolling(response.data.bookingId); 
      }
    } catch (err) {
      console.error(err);
      alert("Failed to initiate payment. Check server.");
      setIsBooking(false);
    }
  };

  // --- 2. Poll Backend every 3 seconds ---
  const startPolling = (id) => {
    pollingInterval.current = setInterval(async () => {
      try {
        const res = await axios.get(`https://tourest-cidj.vercel.app/api/bookings/status/${id}`);
        
        if (res.data.status === 'approved') {
          clearInterval(pollingInterval.current); // Stop polling
          setIsBooking(false);
          setStep(7); // Move to Success Screen

          // --- TRIGGER EMAIL SENDING API ---
          await axios.post('https://tourest-cidj.vercel.app/api/bookings/send-email', {
            email: formData.email,
            fullName: formData.fullName,
            bookingRef: id,
            destination: cityData.title,
            date: formData.date,
            grandTotal: grandTotal,
            hotelName: selections.hotel?.name || 'TBD',
            airline: selections.flight?.airline || 'TBD'
          });

        } else if (res.data.status === 'rejected') {
          clearInterval(pollingInterval.current);
          setIsBooking(false);
          setStep(8); // Move to Failed Screen
        }
      } catch (error) {
        console.error("Polling error", error);
      }
    }, 3000);
  };

  const generateRoadmap = () => {
    if (!cityData) return [];
    const map = [
      { icon: <FaHome/>, title: `Leave ${formData.homeCity || 'Home'}`, desc: `Head to the airport for your outbound journey.` },
      { icon: <FaPlaneDeparture/>, title: `Outbound: ${selections.flight?.airline || 'Flight'}`, desc: `Depart ${formData.homeCity} at ${selections.flight?.outTime || 'TBD'}. Arrive in ${cityData.destination || cityData.title} at ${selections.flight?.outArrive || 'TBD'}.` },
      { icon: <FaHotel/>, title: `Check-in: ${selections.hotel?.name || 'Hotel'}`, desc: `Arrive at your hotel in ${selections.hotel?.area || selections.hotel?.city || 'your destination'}.` }
    ];
    
    cityData.itinerary?.forEach(day => {
      const description = day.desc || (day.activities ? day.activities.join(' • ') : 'Day at leisure.');
      map.push({ icon: <FaMapSigns color="#d6a848"/>, title: `Day ${day.day}: ${day.title}`, desc: description });
    });

    map.push(
      { icon: <FaSuitcase/>, title: `Check-out`, desc: `Time to say goodbye to ${cityData.destination || 'your destination'}.` },
      { icon: <FaPlaneArrival/>, title: `Return: ${selections.flight?.airline || 'Flight'}`, desc: `Depart at ${selections.flight?.retTime || 'TBD'}. Land back in ${formData.homeCity} at ${selections.flight?.retArrive || 'TBD'}.` },
      { icon: <FaCheckCircle/>, title: `Arrive in ${formData.homeCity || 'Home'}`, desc: `Welcome back!` }
    );
    return map;
  };

  if (isLoadingData) return (
    <div style={styles.overlay}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{...styles.modal, alignItems:'center', justifyContent:'center', flexDirection:'column', width: 'auto', padding: '60px'}}>
        <FaSpinner className="fa-spin" size={50} color="#d6a848" />
        <h3 style={{marginTop:'20px', color:'#0f172a', fontFamily: 'Playfair Display, serif'}}>Connecting to Server...</h3>
      </motion.div>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } } .fa-spin { animation: spin 1s linear infinite; }`}</style>
    </div>
  );

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
            <img src={cityData?.img} alt={cityData?.title} style={styles.img} />
            <div style={styles.imgOverlay}>
              <span style={styles.badge}>{cityData?.duration}</span>
              <h3 style={{margin: '15px 0 0', fontSize:'2.4rem', fontFamily: 'Playfair Display, serif', fontWeight: '700'}}>{cityData?.title}</h3>
              <small style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', marginTop: '8px', fontSize: '1rem' }}>
                <FaMapMarkerAlt color="#d6a848"/> {cityData?.destination || cityData?.category}
              </small>
            </div>
          </div>

          <div style={styles.receiptBox}>
            <h5 style={styles.receiptHeading}>Trip Estimate</h5>
            <div style={styles.receiptRow}><span>Base Package</span><span>₹{packageCost.toLocaleString()}</span></div>
            <div style={styles.receiptRow}><span>Flights (Out & Rtn)</span><span>₹{flightCost.toLocaleString()}</span></div>
            <div style={styles.receiptRow}><span>Hotel ({hotelNights}N)</span><span>₹{hotelCost.toLocaleString()}</span></div>
            <div style={{...styles.receiptRow, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px'}}>
              <span>Taxes (18%)</span><span>₹{taxes.toLocaleString()}</span>
            </div>
            <div style={styles.totalRow}><span>Grand Total</span><span style={{color: '#d6a848'}}>₹{grandTotal.toLocaleString()}</span></div>
          </div>
        </div>

        {/* --- RIGHT PANEL: INTERACTIVE FLOW --- */}
        <div style={styles.rightPanel}>
          <div style={styles.header}>
            <div style={{width:'33%'}}>
              {step > 1 && step < 6 && <button onClick={() => setStep(step - 1)} style={styles.backBtn}><FaArrowLeft/> Back</button>}
            </div>
            <div style={{width:'33%', textAlign:'center', fontWeight:'800', color:'#64748b', fontSize: '1rem', letterSpacing: '2px'}}>
              {step < 5 ? `STEP ${step} OF 4` : step === 5 ? 'PAYMENT' : step === 6 ? 'PROCESSING' : step === 7 ? 'COMPLETED' : 'FAILED'}
            </div>
            <div style={{width:'33%', display:'flex', justifyContent:'flex-end'}}>
              <button onClick={onClose} style={styles.closeBtn} onMouseOver={(e) => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }} onMouseOut={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#64748b'; }}>
                <FaTimes size={18}/>
              </button>
            </div>
          </div>

          <div style={styles.scrollContent}>
            <AnimatePresence mode='wait'>
              
              {/* STEP 1: DESTINATION & DATES */}
              {step === 1 && (
                <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                  <h2 style={styles.stepTitle}>When are you going?</h2>
                  
                  <div style={{...styles.inputGroup, marginBottom: '35px', background: '#fcfaf5', padding: '20px', borderRadius: '16px', border: '2px solid #d6a848'}}>
                    <label style={{...styles.label, color: '#d6a848', display: 'flex', alignItems: 'center', gap: '8px'}}><FaGlobe size={16}/> Selected Destination</label>
                    <div style={{fontWeight: '800', fontSize: '1.4rem', color: '#0f172a', fontFamily: 'Playfair Display, serif'}}>
                      {cityData.title} <span style={{color: '#64748b', fontWeight: '600', fontSize: '1.1rem', fontFamily: 'Inter, sans-serif'}}>({cityData.destination})</span>
                    </div>
                  </div>

                  <div style={styles.grid2}>
                    <div style={styles.inputGroup}><label style={styles.label}>Departing City</label><input type="text" value={formData.homeCity} onChange={e => setFormData({...formData, homeCity: e.target.value})} style={styles.input} /></div>
                    <div style={styles.inputGroup}><label style={styles.label}>Start Date</label><input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} style={styles.input} /></div>
                  </div>
                  <div style={styles.grid2}>
                    <div style={styles.inputGroup}><label style={styles.label}>Adults</label><input type="number" min="1" value={formData.adults} onChange={e => setFormData({...formData, adults: parseInt(e.target.value) || 1})} style={styles.input} /></div>
                    <div style={styles.inputGroup}><label style={styles.label}>Children</label><input type="number" min="0" value={formData.children} onChange={e => setFormData({...formData, children: parseInt(e.target.value) || 0})} style={styles.input} /></div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: CITY-WISE FLIGHTS & HOTELS */}
              {step === 2 && (
                <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                  <h2 style={styles.stepTitle}>Tailor your luxury</h2>
                  <h4 style={styles.sectionHeader}><FaPlaneDeparture color="#d6a848"/> Round-Trip Flights</h4>
                  <div style={styles.cardContainer}>
                    {cityData.flights?.map(flight => (
                      <div key={flight._id || flight.airline} onClick={() => setSelections({...selections, flight})} style={{...styles.selectCard, borderColor: selections.flight?._id === flight._id || selections.flight?.airline === flight.airline ? '#d6a848' : '#e2e8f0', background: selections.flight?._id === flight._id || selections.flight?.airline === flight.airline ? '#fcfaf5' : '#fff', boxShadow: selections.flight?._id === flight._id || selections.flight?.airline === flight.airline ? '0 8px 25px rgba(214, 168, 72, 0.15)' : 'none'}}>
                        <div style={{display:'flex', justifyContent:'space-between'}}>
                          <div>
                            <strong style={{fontSize:'1.2rem', color:'#0f172a', fontWeight: '800'}}>{flight.logo} {flight.airline} <span style={{fontSize:'0.9rem', color:'#64748b', fontWeight: '600'}}>({flight.type})</span></strong>
                            <div style={{fontSize:'0.95rem', color:'#64748b', marginTop:'8px'}}><strong>OUT:</strong> {flight.outTime || 'TBD'} ➔ {flight.outArrive || 'TBD'}</div>
                            <div style={{fontSize:'0.95rem', color:'#64748b', marginTop:'4px'}}><strong>RTN:</strong> {flight.retTime || 'TBD'} ➔ {flight.retArrive || 'TBD'}</div>
                          </div>
                          <div style={{textAlign:'right'}}>
                            <div style={{fontSize:'1.4rem', fontWeight:'800', color:'#0f172a'}}>₹{(flight.price || 0).toLocaleString()}</div>
                            <small style={{color: '#64748b', fontWeight: '600'}}>per person</small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h4 style={styles.sectionHeader}><FaHotel color="#d6a848"/> Premium Accommodations</h4>
                  <div style={styles.cardContainer}>
                    {cityData.hotels?.map(hotel => (
                      <div key={hotel._id || hotel.name} onClick={() => setSelections({...selections, hotel})} style={{...styles.selectCard, padding: 0, borderColor: selections.hotel?._id === hotel._id || selections.hotel?.name === hotel.name ? '#d6a848' : '#e2e8f0', background: selections.hotel?._id === hotel._id || selections.hotel?.name === hotel.name ? '#fcfaf5' : '#fff', boxShadow: selections.hotel?._id === hotel._id || selections.hotel?.name === hotel.name ? '0 8px 25px rgba(214, 168, 72, 0.15)' : 'none', display:'flex', overflow:'hidden'}}>
                        <img src={hotel.img || 'https://images.unsplash.com/photo-1566073171639-4d9db53d6040?auto=format&fit=crop&w=300'} alt={hotel.name} style={{width:'150px', objectFit:'cover'}} />
                        <div style={{padding:'20px', flex:1}}>
                          <strong style={{color:'#0f172a', display:'block', fontSize: '1.2rem', fontWeight: '800'}}>{hotel.name}</strong>
                          <div style={{color:'#d6a848', fontSize:'0.9rem', marginTop: '5px'}}>{[...Array(hotel.stars || hotel.rating || 1)].map((_, i) => <FaStar key={i} />)}</div>
                          <div style={{fontSize:'1.3rem', fontWeight:'800', color:'#0f172a', marginTop:'15px'}}>₹{(hotel.pricePerNight || 0).toLocaleString()} <span style={{fontSize:'0.85rem', fontWeight:'600', color: '#64748b'}}>per night</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 3: ITINERARY */}
              {step === 3 && (
                <motion.div key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                  <h2 style={styles.stepTitle}>Your {cityData.destination || cityData.title} Itinerary</h2>
                  <div style={{padding: '10px 0 20px 20px'}}>
                    {generateRoadmap().map((item, index, arr) => (
                      <div key={index} style={{position: 'relative', paddingLeft: '50px', paddingBottom: '35px', display: 'flex'}}>
                        {index !== arr.length - 1 && <div style={{position: 'absolute', left: '22px', top: '45px', bottom: 0, width: '2px', background: '#e2e8f0'}}></div>}
                        <div style={{position: 'absolute', left: '0', top: '0', width: '46px', height: '46px', borderRadius: '50%', border: '2px solid #0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', color: '#0f172a', zIndex: 2, fontSize: '1.2rem'}}>
                          {item.icon}
                        </div>
                        <div style={{background: '#fff', padding: '25px', borderRadius: '20px', border: '1px solid #e2e8f0', width: '100%', boxShadow: '0 4px 15px rgba(0,0,0,0.03)'}}>
                          <h4 style={{margin:0, color:'#0f172a', fontSize: '1.2rem', fontWeight: '800'}}>{item.title}</h4>
                          <p style={{margin:'8px 0 0', color:'#64748b', fontSize:'1rem', lineHeight: '1.6'}}>{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 4: PASSENGER DETAILS WITH VALIDATION */}
              {step === 4 && (
                <motion.div key="step4" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                  <h2 style={styles.stepTitle}>Passenger Details</h2>
                  <div style={{display:'grid', gap:'30px'}}>
                    
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Full Name (Primary Traveler)</label>
                        <input 
                          placeholder="E.g. John Doe" 
                          value={formData.fullName} 
                          onChange={e => { setFormData({...formData, fullName:e.target.value}); if(errors.fullName) setErrors({...errors, fullName:null}); }} 
                          style={{...styles.input, borderColor: errors.fullName ? '#ef4444' : '#e2e8f0'}} 
                        />
                        {errors.fullName && <span style={styles.errorText}><FaExclamationCircle/> {errors.fullName}</span>}
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

              {/* STEP 5: REAL QR CODE PAYMENT */}
              {step === 5 && (
                <motion.div key="step5" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                  <h2 style={styles.stepTitle}>Secure Payment</h2>
                  
                  <div style={{ display: 'flex', gap: '30px', background: '#f8fafc', padding: '30px', borderRadius: '24px', border: '1px solid #e2e8f0', marginBottom: '30px', alignItems: 'center', flexDirection: window.innerWidth < 768 ? 'column' : 'row' }}>
                    
                    {/* QR Code Section */}
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

                    {/* Input Verification Section */}
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

              {/* STEP 6: PROCESSING (POLLING) */}
              {step === 6 && (
                <motion.div key="step6" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{textAlign:'center', padding: '60px 0'}}>
                  <FaSpinner className="fa-spin" size={80} color="#d6a848" style={{marginBottom:'30px'}} />
                  <h2 style={{color: '#0f172a', margin:'0 0 15px', fontFamily: 'Playfair Display, serif', fontSize: '2.5rem'}}>Awaiting Verification...</h2>
                  <p style={{color: '#64748b', fontSize: '1.2rem', lineHeight: '1.6'}}>We are verifying your transaction from <strong>{formData.upiId}</strong>.<br/>Do not close this window.</p>
                </motion.div>
              )}

              {/* STEP 7: SUCCESS (E-TICKET) */}
              {step === 7 && (
                <motion.div key="step7" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{textAlign:'center', padding: '30px 0'}}>
                  <FaCheckCircle size={80} color="#10b981" style={{marginBottom:'25px'}} />
                  <h2 style={{color: '#0f172a', margin:'0 0 10px', fontFamily: 'Playfair Display, serif', fontSize: '2.8rem'}}>Booking Confirmed</h2>
                  <p style={{color: '#64748b', marginBottom:'20px', fontSize: '1.2rem'}}>Reference Number: <strong style={{color: '#0f172a'}}>#{bookingRef}</strong></p>
                  
                  {/* Visual indication that email was sent */}
                  <div style={{ background: '#d1fae5', color: '#065f46', padding: '10px 20px', borderRadius: '50px', display: 'inline-block', marginBottom: '30px', fontWeight: '600', fontSize: '0.9rem' }}>
                    A confirmation email has been sent to {formData.email}
                  </div>

                  <div style={{background:'#fff', borderRadius:'24px', border:'1px solid #e2e8f0', textAlign:'left', overflow:'hidden', boxShadow:'0 20px 40px rgba(0,0,0,0.1)'}}>
                    <div style={{background:'#0f172a', color:'white', padding:'30px', display:'flex', justifyContent:'space-between', alignItems: 'center'}}>
                      <div><h4 style={{margin:0, display: 'flex', alignItems:'center', gap: '12px', fontSize: '1.2rem', letterSpacing: '2px'}}><FaTicketAlt color="#d6a848" size={24}/> PACKAGE E-TICKET</h4></div>
                      <div style={{fontWeight: '800', letterSpacing: '1px', fontSize: '1.1rem'}}>{formData.fullName.toUpperCase()}</div>
                    </div>
                    
                    <div style={{padding:'40px'}}>
                      <div style={{display:'flex', gap:'30px', borderBottom:'1px solid #e2e8f0', paddingBottom:'30px', marginBottom:'30px'}}>
                        <div style={{flex:1}}>
                          <small style={{color:'#94a3b8', display:'block', marginBottom: '8px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase'}}>OUTBOUND FLIGHT</small>
                          <strong style={{color:'#0f172a', fontSize:'1.4rem', display: 'block', marginBottom: '10px'}}>{selections.flight?.airline || 'TBD'}</strong>
                          <div style={{fontSize:'1.05rem', color:'#64748b', fontWeight: '600'}}>{formData.homeCity} ➔ {cityData.destination || cityData.title}</div>
                          <div style={{fontSize:'1rem', color:'#64748b', marginTop: '5px'}}>Departs: {formData.date} at {selections.flight?.outTime || 'TBD'}</div>
                        </div>
                        <div style={{flex:1, borderLeft:'1px solid #e2e8f0', paddingLeft:'30px'}}>
                          <small style={{color:'#94a3b8', display:'block', marginBottom: '8px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase'}}>RETURN FLIGHT</small>
                          <strong style={{color:'#0f172a', fontSize:'1.4rem', display: 'block', marginBottom: '10px'}}>{selections.flight?.airline || 'TBD'}</strong>
                          <div style={{fontSize:'1.05rem', color:'#64748b', fontWeight: '600'}}>{cityData.destination || cityData.title} ➔ {formData.homeCity}</div>
                          <div style={{fontSize:'1rem', color:'#64748b', marginTop: '5px'}}>Departs: {selections.flight?.retTime || 'TBD'}</div>
                        </div>
                      </div>
                      
                      <div>
                        <small style={{color:'#94a3b8', display:'block', marginBottom: '8px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase'}}>ACCOMMODATION</small>
                        <strong style={{color:'#0f172a', fontSize:'1.5rem', display: 'block', marginBottom: '5px'}}>{selections.hotel?.name || 'TBD'}</strong>
                        <div style={{fontSize:'1.1rem', color:'#64748b', fontWeight: '500'}}>{hotelNights} Nights in {selections.hotel?.area || selections.hotel?.city || 'Destination'}</div>
                      </div>
                    </div>
                  </div>
                  <button onClick={onClose} style={{...styles.primaryBtn, marginTop:'50px'}}>Close</button>
                </motion.div>
              )}

              {/* STEP 8: FAILED */}
              {step === 8 && (
                <motion.div key="step8" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{textAlign:'center', padding: '60px 0'}}>
                  <FaTimesCircle size={80} color="#ef4444" style={{marginBottom:'25px'}} />
                  <h2 style={{color: '#0f172a', margin:'0 0 10px', fontFamily: 'Playfair Display, serif', fontSize: '2.8rem'}}>Payment Failed</h2>
                  <p style={{color: '#64748b', marginBottom:'40px', fontSize: '1.2rem'}}>The payment was declined or timed out. Please try again.</p>
                  <button onClick={() => setStep(5)} style={styles.primaryBtn}>Retry Payment</button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Footer Action Button */}
          {step < 6 && (
            <div style={{padding: '35px 60px', borderTop: '1px solid #f1f5f9'}}>
              <button 
                disabled={(!formData.date && step === 1)} 
                onClick={handleNextStep} 
                style={{
                  ...styles.primaryBtn, 
                  opacity: (!formData.date && step === 1) ? 0.5 : 1,
                  cursor: (!formData.date && step === 1) ? 'not-allowed' : 'pointer'
                }}
              >
                {isBooking ? <FaSpinner className="fa-spin"/> : step === 5 ? `I Have Paid ₹${grandTotal.toLocaleString()}` : 'Continue'}
              </button>
            </div>
          )}
        </div>
      </motion.div>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } } .fa-spin { animation: spin 1s linear infinite; }`}</style>
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
  imageWrapper: { position: 'relative', borderRadius: '20px', overflow: 'hidden', height: '280px', marginBottom: '40px' }, 
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
  stepTitle: { color: '#0f172a', marginTop: 0, marginBottom: '45px', fontSize: '2.8rem', fontFamily: 'Playfair Display, serif', fontWeight: '800' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '35px', marginBottom: '40px' },
  
  inputGroup: { display: 'flex', flexDirection: 'column' },
  label: { marginBottom: '12px', fontSize: '0.95rem', fontWeight: '800', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { padding: '18px 24px', borderRadius: '16px', border: '2px solid #e2e8f0', outline: 'none', fontSize: '1.15rem', color: '#0f172a', background: '#f8fafc', transition: 'all 0.3s', fontWeight: '500' },
  
  phoneWrapper: { display: 'flex', alignItems: 'center', background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', transition: 'all 0.3s' },
  phonePrefix: { padding: '18px 20px', background: '#f1f5f9', color: '#64748b', fontWeight: '800', fontSize: '1.15rem', borderRight: '2px solid #e2e8f0' },
  phoneInput: { padding: '18px 20px', border: 'none', outline: 'none', fontSize: '1.15rem', color: '#0f172a', background: 'transparent', width: '100%', fontWeight: '500', letterSpacing: '1px' },
  
  errorText: { color: '#ef4444', fontSize: '0.85rem', fontWeight: '700', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '5px' },

  sectionHeader: { color: '#0f172a', fontSize: '1.3rem', marginBottom: '25px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' },
  cardContainer: { display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px', paddingRight: '5px' },
  selectCard: { borderRadius: '20px', border: '2px solid', cursor: 'pointer', padding: '25px', transition: 'all 0.2s ease' },
  primaryBtn: { padding: '22px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '16px', fontWeight: '800', fontSize: '1.2rem', cursor: 'pointer', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'all 0.3s', letterSpacing: '1px' }
};

export default PackageDetailsModal;