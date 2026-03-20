import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap, ZoomControl } from "react-leaflet";
import { motion, AnimatePresence } from 'framer-motion';
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { 
  FaMapMarkerAlt, FaCloudSun, FaSearch, FaStar, FaPlaneDeparture, 
  FaTimes, FaCheckCircle, FaCalendarAlt, FaUsers, FaMinus, FaPlus, FaCreditCard, FaArrowLeft, FaSpinner 
} from 'react-icons/fa';

// Update this to match your actual backend URL/Port
const API_BASE_URL = "https://tourest-cidj.vercel.app/api"; 

// =========================================================
// 1. THE BOOKING MODAL COMPONENT
// =========================================================
const BookingModal = ({ selectedItem, onClose }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState({ adults: 2, children: 0 });
  const [contact, setContact] = useState({ name: '', email: '', phone: '' });

  // Price Calculation
  const basePrice = parseInt(selectedItem.price.replace(/[^0-9]/g, '')) * 1000 || 50000;
  const totalPrice = (basePrice * guests.adults) + (basePrice * 0.5 * guests.children);

  const handleBook = async () => {
    setLoading(true);
    try {
      // Send booking data to the backend
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locationId: selectedItem._id,
          city: selectedItem.city,
          date,
          guests,
          contact,
          totalPrice
        })
      });

      if (!response.ok) throw new Error("Booking failed");
      
      setStep(3); // Go to success step on successful save
    } catch (error) {
      console.error("Error saving booking:", error);
      alert("Failed to confirm booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={modalStyles.overlay} onClick={onClose}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.9, opacity: 0, y: 20 }} 
        onClick={(e) => e.stopPropagation()} 
        style={modalStyles.modal}
      >
        {/* LEFT SIDE (Summary) */}
        <div style={modalStyles.leftPanel}>
           <div style={modalStyles.leftContent}>
              <h3 style={modalStyles.heading}>Trip Summary</h3>
              <div style={modalStyles.imageCard}>
                 <img src={selectedItem.img} alt="" style={modalStyles.img} />
                 <div style={modalStyles.imgOverlay}>
                    <h4 style={{margin:0}}>{selectedItem.city}</h4>
                    <small>{selectedItem.country}</small>
                 </div>
              </div>
              
              <div style={{marginTop: '20px', flex: 1}}>
                 <div style={modalStyles.row}><FaCalendarAlt color="#C5A059"/> <span>{date || 'Select Date'}</span></div>
                 <div style={modalStyles.row}><FaUsers color="#C5A059"/> <span>{guests.adults} Adults, {guests.children} Kids</span></div>
              </div>

              <div style={modalStyles.totalBox}>
                 <small>Total Price</small>
                 <div style={modalStyles.totalPrice}>₹{totalPrice.toLocaleString()}</div>
              </div>
           </div>
        </div>

        {/* RIGHT SIDE (Form) */}
        <div style={modalStyles.rightPanel}>
           <button onClick={onClose} style={modalStyles.closeBtn}><FaTimes/></button>
           
           <AnimatePresence mode="wait">
             {/* STEP 1: DATES & GUESTS */}
             {step === 1 && (
               <motion.div key="s1" initial={{x:20,opacity:0}} animate={{x:0,opacity:1}} exit={{x:-20,opacity:0}} style={{flex:1}}>
                  <h2 style={modalStyles.stepTitle}>Configure Trip</h2>
                  <div style={modalStyles.inputGroup}>
                     <label style={modalStyles.label}>Travel Date</label>
                     <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={modalStyles.input} />
                  </div>
                  <div style={modalStyles.counterItem}>
                     <span>Adults</span>
                     <div style={modalStyles.counterControls}>
                        <button onClick={()=>setGuests({...guests, adults:Math.max(1, guests.adults-1)})} style={modalStyles.roundBtn}><FaMinus/></button>
                        <span>{guests.adults}</span>
                        <button onClick={()=>setGuests({...guests, adults:guests.adults+1})} style={modalStyles.roundBtn}><FaPlus/></button>
                     </div>
                  </div>
                  <div style={modalStyles.counterItem}>
                     <span>Children</span>
                     <div style={modalStyles.counterControls}>
                        <button onClick={()=>setGuests({...guests, children:Math.max(0, guests.children-1)})} style={modalStyles.roundBtn}><FaMinus/></button>
                        <span>{guests.children}</span>
                        <button onClick={()=>setGuests({...guests, children:guests.children+1})} style={modalStyles.roundBtn}><FaPlus/></button>
                     </div>
                  </div>
               </motion.div>
             )}

             {/* STEP 2: DETAILS */}
             {step === 2 && (
               <motion.div key="s2" initial={{x:20,opacity:0}} animate={{x:0,opacity:1}} exit={{x:-20,opacity:0}} style={{flex:1}}>
                  <button onClick={()=>setStep(1)} style={modalStyles.backBtn}><FaArrowLeft/> Back</button>
                  <h2 style={modalStyles.stepTitle}>Your Details</h2>
                  <input placeholder="Full Name" value={contact.name} onChange={e=>setContact({...contact,name:e.target.value})} style={modalStyles.input} />
                  <input placeholder="Email" value={contact.email} onChange={e=>setContact({...contact,email:e.target.value})} style={{...modalStyles.input, marginTop:15}} />
                  <input placeholder="Phone" value={contact.phone} onChange={e=>setContact({...contact,phone:e.target.value})} style={{...modalStyles.input, marginTop:15}} />
                  <div style={modalStyles.infoBox}><FaCreditCard/> No payment needed today.</div>
               </motion.div>
             )}

             {/* STEP 3: SUCCESS */}
             {step === 3 && (
               <motion.div key="s3" initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} style={modalStyles.successBox}>
                  <FaCheckCircle size={60} color="#10b981" />
                  <h2>Booking Confirmed!</h2>
                  <p>See you in {selectedItem.city}.</p>
                  <button onClick={onClose} style={modalStyles.mainBtn}>Done</button>
               </motion.div>
             )}
           </AnimatePresence>

           {step < 3 && (
             <button 
                onClick={() => step === 1 ? setStep(2) : handleBook()} 
                disabled={step === 1 && !date}
                style={{...modalStyles.mainBtn, marginTop: 20, opacity: (step === 1 && !date) ? 0.5 : 1}}
             >
               {loading ? <FaSpinner className="spin"/> : (step === 1 ? 'Next Step' : 'Confirm Booking')}
             </button>
           )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// =========================================================
// 2. MAP & MARKER COMPONENTS
// =========================================================
const MAP_ZOOM = 4;
const MAP_CENTER = [20, 0]; 

const createCustomIcon = (price) => {
  return L.divIcon({
    className: "custom-marker-container",
    html: `
      <div style="position:relative; display:flex; justify-content:center; align-items:center;">
        <div style="border: 3px solid #C5A059; border-radius: 50%; height: 40px; width: 40px; position: absolute; animation: pulsate 2s infinite; opacity: 0;"></div>
        <div style="background: #0F172A; color: white; padding: 6px 12px; border-radius: 12px; font-weight: bold; font-size: 12px; position: relative; z-index: 2; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
          ${price}
        </div>
        <div style="position: absolute; bottom: -6px; width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid #0F172A; z-index: 2;"></div>
      </div>
    `,
    iconSize: [50, 50],
    iconAnchor: [25, 50]
  });
};

function FlyTo({ location }) {
  const map = useMap();
  useEffect(() => {
    if (location && location.lat && location.lng) {
        map.flyTo([location.lat, location.lng], 10, { animate: true, duration: 2.0 });
    }
  }, [location, map]);
  return null;
}

// =========================================================
// 3. MAIN COMPONENT (LIVE DESTINATION MAP)
// =========================================================
const LiveDestinationMap = () => {
  const [locations, setLocations] = useState([]);
  const [active, setActive] = useState(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // FETCH DATA FROM DATABASE INSTEAD OF MOCK DATA
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/locations`);
        if (!response.ok) throw new Error("Failed to fetch locations");
        const data = await response.json();
        
        setLocations(data);
        if (data.length > 0) setActive(data[0]); 
      } catch (error) {
        console.error("Error loading map data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    const found = locations.find(l => l.city.toLowerCase().includes(e.target.value.toLowerCase()));
    if (found) setActive(found);
  };

  if (isLoading) return <div style={{height: '100vh', display:'flex', justifyContent:'center', alignItems:'center'}}>Loading Map Data...</div>;

  return (
    <section style={styles.section}>
      <style>{`@keyframes pulsate { 0% { transform: scale(0.1, 0.1); opacity: 0; } 50% { opacity: 1; } 100% { transform: scale(1.2, 1.2); opacity: 0; } } .spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>

      <div style={styles.container}>
        {/* SEARCH BAR */}
        <div style={styles.searchBar}>
          <div style={styles.searchIconBox}><FaSearch color="white" /></div>
          <input type="text" placeholder="Search city..." value={search} onChange={handleSearch} style={styles.searchInput} />
        </div>

        {/* MAP */}
        <MapContainer center={MAP_CENTER} zoom={MAP_ZOOM} zoomControl={false} style={{ height: "100%", width: "100%" }}>
            <TileLayer attribution='&copy; CartoDB' url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
            <FlyTo location={active} />
            {locations.map((loc) => (
                <Marker key={loc._id} position={[loc.lat, loc.lng]} icon={createCustomIcon(loc.price)} eventHandlers={{ click: () => setActive(loc) }} />
            ))}
            <ZoomControl position="bottomright" />
        </MapContainer>

        {/* DETAILS CARD (FLOATING LEFT) */}
        <div style={styles.cardContainer}>
          <AnimatePresence mode="wait">
            {active && (
              <motion.div 
                key={active._id}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                style={styles.glassCard}
              >
                <div style={styles.cardHeader}>
                  <img src={active.img} alt={active.city} style={styles.cardImg} />
                  <div style={styles.weatherTag}><FaCloudSun /> {active.weather}</div>
                </div>

                <div style={styles.cardContent}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                    <div>
                        <h2 style={styles.title}>{active.city}</h2>
                        <div style={styles.locationRow}><FaMapMarkerAlt color="#C5A059" size={12}/><span>{active.country}</span></div>
                    </div>
                    <div style={styles.ratingBadge}><FaStar color="#FFD700" size={10}/> {active.rating}</div>
                  </div>
                  
                  <p style={styles.desc}>{active.desc}</p>
                  <div style={styles.divider}></div>

                  <div style={styles.footer}>
                    <div>
                        <small style={{color:'#64748b', fontSize:'0.75rem', textTransform:'uppercase', letterSpacing:'1px'}}>Total Price</small>
                        <div style={styles.price}>{active.price}</div>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} style={styles.bookBtn}>
                        Book Trip <FaPlaneDeparture />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* RENDER MODAL IF OPEN */}
      <AnimatePresence>
        {isModalOpen && active && (
          <BookingModal selectedItem={active} onClose={() => setIsModalOpen(false)} />
        )}
      </AnimatePresence>
    </section>
  );
};

// =========================================================
// 4. STYLES (MAP & MODAL)
// =========================================================
// (Your existing styles remain exactly the same)
const styles = {
  section: { height: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#e2e8f0', padding: '20px' },
  container: { position: 'relative', width: '100%', maxWidth: '1400px', height: '85vh', background: '#fff', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' },
  searchBar: { position: 'absolute', top: '30px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', padding: '8px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '10px', width: '90%', maxWidth: '450px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid rgba(255,255,255,0.5)' },
  searchIconBox: { width: '40px', height: '40px', background: '#0F172A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  searchInput: { border: 'none', background: 'transparent', outline: 'none', fontSize: '1rem', color: '#334155', width: '100%', fontWeight: '500' },
  cardContainer: { position: 'absolute', left: '40px', bottom: '40px', zIndex: 999, maxWidth: '360px', width: '100%', pointerEvents: 'none' },
  glassCard: { pointerEvents: 'auto', background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(20px) saturate(180%)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.6)' },
  cardHeader: { height: '180px', position: 'relative' },
  cardImg: { width: '100%', height: '100%', objectFit: 'cover' },
  weatherTag: { position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', backdropFilter: 'blur(4px)' },
  cardContent: { padding: '25px' },
  title: { margin: 0, fontSize: '2rem', fontFamily: 'serif', color: '#1e293b', lineHeight: 1 },
  locationRow: { display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.9rem', marginTop: '5px', fontWeight: '500' },
  ratingBadge: { background: '#fff', padding: '5px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', color: '#1e293b' },
  desc: { color: '#475569', fontSize: '0.95rem', lineHeight: '1.6', marginTop: '15px', marginBottom: '0' },
  divider: { height: '1px', background: 'linear-gradient(to right, transparent, #cbd5e1, transparent)', margin: '20px 0' },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' },
  bookBtn: { background: '#0F172A', color: 'white', border: 'none', padding: '14px 24px', borderRadius: '14px', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 20px rgba(15, 23, 42, 0.25)', transition: 'transform 0.2s' }
};

const modalStyles = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(5, 10, 20, 0.6)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  modal: { background: 'white', width: '100%', maxWidth: '900px', height: '600px', borderRadius: '24px', display: 'flex', overflow: 'hidden', boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5)' },
  leftPanel: { width: '40%', background: '#0F172A', color: 'white', padding: '30px', display: 'flex', flexDirection: 'column' },
  leftContent: { height: '100%', display: 'flex', flexDirection: 'column' },
  heading: { fontFamily: 'serif', fontSize: '1.8rem', marginTop: 0 },
  imageCard: { height: '150px', borderRadius: '16px', overflow: 'hidden', position: 'relative', marginTop: '20px' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  imgOverlay: { position: 'absolute', bottom: 0, width: '100%', background: 'linear-gradient(transparent, black)', padding: '10px' },
  row: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px', color: '#cbd5e1' },
  totalBox: { marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '20px' },
  totalPrice: { fontSize: '2rem', fontWeight: 'bold', color: '#C5A059' },
  rightPanel: { width: '60%', padding: '40px', position: 'relative', display: 'flex', flexDirection: 'column' },
  closeBtn: { position: 'absolute', top: '20px', right: '20px', background: '#f1f5f9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer' },
  stepTitle: { fontSize: '1.8rem', fontFamily: 'serif', color: '#0F172A', marginBottom: '30px' },
  inputGroup: { marginBottom: '20px' },
  label: { display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' },
  input: { width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none' },
  counterItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '15px', background: '#f8fafc', borderRadius: '12px' },
  counterControls: { display: 'flex', gap: '15px', alignItems: 'center', fontSize: '1.2rem', fontWeight: 'bold' },
  roundBtn: { width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  mainBtn: { width: '100%', padding: '16px', background: '#0F172A', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center' },
  backBtn: { background: 'none', border: 'none', color: '#64748b', fontWeight: 'bold', cursor: 'pointer', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '5px' },
  infoBox: { marginTop: '20px', padding: '15px', background: '#ecfeff', color: '#0e7490', borderRadius: '10px', display: 'flex', gap: '10px', alignItems: 'center', fontSize: '0.9rem' },
  successBox: { height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }
};

export default LiveDestinationMap;