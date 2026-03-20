import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaStar, FaSearch, FaSpinner, FaCloudSun, FaPlaneDeparture } from 'react-icons/fa'; 
import axios from 'axios';
import TransportModal from '../components/TransportModal'; 

const Locations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('https://tourest-cidj.vercel.app/api/locations');
        setDestinations(res.data);
      } catch (err) {
        console.error("Error fetching locations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = destinations.filter(item => 
    item.city.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- Framer Motion Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 100, damping: 15 } 
    }
  };

  const heroTextVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#f8fafc' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
        <FaPlaneDeparture size={50} color="#d1a54a" />
      </motion.div>
      <p style={{ marginTop: '20px', color: '#0F2435', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase' }}>Curating Destinations...</p>
    </div>
  );

  return (
    <div style={{ background: '#f4f7f6', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* --- INJECTED PREMIUM CSS --- */}
      <style>{`
        /* Card Hover Effects */
        .destination-card {
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .destination-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 20px 40px rgba(15, 36, 53, 0.15);
        }
        
        /* Image Zoom on Hover */
        .card-img-container { overflow: hidden; }
        .card-img {
          transition: transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .destination-card:hover .card-img {
          transform: scale(1.08);
        }

        /* Search Input Placeholder Color */
        .glass-search::placeholder { color: rgba(255, 255, 255, 0.7); }
        .glass-search:focus { box-shadow: 0 0 0 2px #d1a54a; background: rgba(255,255,255,0.15); }

        /* Premium Scrollbar */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #d1a54a; border-radius: 10px; }
      `}</style>

      {/* --- HERO SECTION WITH PARALLAX & GLASSMORPHISM --- */}
      <div style={{ 
        position: 'relative',
        padding: '180px 20px 140px', 
        textAlign: 'center', 
        color: 'white',
        /* High-quality background image with a dark luxury gradient overlay */
        backgroundImage: `linear-gradient(to bottom, rgba(15, 36, 53, 0.75), rgba(15, 36, 53, 0.95)), url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed' // Creates the parallax scroll effect
      }}>
        <motion.div initial="hidden" animate="visible" variants={heroTextVariants} style={{ position: 'relative', zIndex: 2 }}>
          <span style={{ color: '#d1a54a', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.9rem', fontWeight: '700' }}>
            Discover The World
          </span>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '4.5rem', margin: '15px 0', fontWeight: '800', textShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
            Where Next?
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6' }}>
            Select your dream destination to explore curated flights, luxury trains, and premium buses tailored just for you.
          </p>
          
          {/* Glassmorphism Search Bar */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{ 
              position: 'relative', 
              maxWidth: '650px', 
              margin: '0 auto',
              transition: 'all 0.3s ease'
            }}
          >
            <FaSearch style={{ position: 'absolute', left: '25px', top: '50%', transform: 'translateY(-50%)', color: isFocused ? '#d1a54a' : 'white', fontSize: '1.2rem', transition: 'color 0.3s' }} />
            <input 
              type="text" 
              className="glass-search"
              placeholder="Search city, country, or keyword (e.g., Paris, Beach)..."
              value={searchQuery}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                width: '100%', padding: '20px 20px 20px 65px', borderRadius: '50px', 
                border: '1px solid rgba(255, 255, 255, 0.2)', 
                fontSize: '1.1rem', color: 'white', outline: 'none',
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease'
              }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* --- DESTINATION GRID SECTION --- */}
      <div style={{ maxWidth: '1300px', margin: '-70px auto 0', padding: '0 20px', position: 'relative', zIndex: 10 }}>
        
        {filteredData.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 0', background: 'white', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <h2 style={{ color: '#0F2435', fontFamily: 'Playfair Display, serif' }}>No destinations found.</h2>
            <p style={{ color: '#64748b' }}>Try adjusting your search criteria.</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="visible"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '35px' }}
          >
            <AnimatePresence>
              {filteredData.map((place) => (
                <motion.div
                  key={place._id}
                  layout
                  variants={cardVariants}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  onClick={() => setSelectedLocation(place)}
                  className="destination-card"
                  style={{ 
                    background: 'white', borderRadius: '24px', overflow: 'hidden', 
                    boxShadow: '0 10px 30px rgba(0,0,0,0.06)', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', border: '1px solid #f1f5f9'
                  }}
                >
                  {/* Card Image Area */}
                  <div className="card-img-container" style={{ height: '260px', position: 'relative' }}>
                    <img src={place.img} alt={place.city} className="card-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    
                    {/* Dark gradient at bottom of image for text blending if needed */}
                    <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '40%', background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }}></div>

                    {/* Frosted Weather Badge */}
                    <div style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(15, 36, 53, 0.6)', backdropFilter: 'blur(8px)', padding: '6px 14px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', fontSize: '0.85rem', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <FaCloudSun color="#d1a54a" size={16} /> {place.weather || '25°C Clear'}
                    </div>

                    {/* Frosted Rating Badge */}
                    <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', padding: '6px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '800', fontSize: '0.85rem', color: '#0F2435', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                      <FaStar color="#d1a54a" size={14} /> {place.rating}
                    </div>
                  </div>

                  {/* Card Content Area */}
                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h3 style={{ margin: 0, fontSize: '1.6rem', color: '#0F2435', fontFamily: 'Playfair Display, serif', fontWeight: '700' }}>{place.city}</h3>
                      <span style={{ background: 'rgba(209, 165, 74, 0.1)', color: '#b88d38', fontSize: '0.75rem', padding: '6px 12px', borderRadius: '20px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {place.category || 'Luxury'}
                      </span>
                    </div>
                    
                    <p style={{ color: '#64748b', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 16px 0', fontWeight: '500' }}>
                      <FaMapMarkerAlt color="#d1a54a" size={14} /> {place.country}
                    </p>

                    <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {place.description || `Experience the ultimate luxury getaway in ${place.city}. Book your exclusive travel package today.`}
                    </p>
                    
                    {/* Transport Badges */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                      {place.transportOptions?.map(t => t.type)
                        .filter((value, index, self) => self.indexOf(value) === index)
                        .slice(0, 3).map((type, i) => (
                          <span key={i} style={{ border: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', padding: '4px 10px', borderRadius: '6px', fontWeight: '600' }}>
                            {type}
                          </span>
                      ))}
                    </div>

                    {/* Footer / Price / Button */}
                    <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <div>
                        <small style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Starting From</small>
                        <div style={{ color: '#0F2435', fontWeight: '800', fontSize: '1.4rem', fontFamily: 'Playfair Display, serif' }}>
                          ₹{place.price?.toLocaleString() || '45,000'}
                        </div>
                      </div>
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedLocation(place); }}
                        style={{ 
                          background: 'linear-gradient(135deg, #dfb65f 0%, #b58735 100%)', 
                          color: 'white', 
                          border: 'none', 
                          padding: '10px 24px', 
                          borderRadius: '50px', 
                          fontWeight: '700', 
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          boxShadow: '0 4px 15px rgba(181, 135, 53, 0.3)',
                          transition: 'transform 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                      >
                        Explore
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Modal Integration */}
      <AnimatePresence>
        {selectedLocation && (
          <TransportModal place={selectedLocation} onClose={() => setSelectedLocation(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Locations;