import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaMapMarkerAlt, FaCompass, FaSearch } from 'react-icons/fa';
import PackageDetailsModal from '../components/PackageDetailsModal'; 

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtering & Search State
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  // Modal State
  const [selectedPackageCity, setSelectedPackageCity] = useState(null);

  // 1. FETCH ALL PACKAGES FROM BACKEND
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/packages');
        setPackages(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch packages:", err);
        setError("Could not load packages. Please ensure your backend server is running.");
        setIsLoading(false);
      }
    };
    fetchPackages();
  }, []);

  // 2. FILTER LOGIC (Combines Category & Search Query)
  const categories = ['All', 'Luxury', 'Adventure', 'Honeymoon', 'Culture', 'Nature'];
  
  const filteredPackages = packages.filter(pkg => {
    const matchesCategory = activeCategory === 'All' || pkg.category === activeCategory;
    const matchesSearch = (pkg.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (pkg.destination || pkg.city || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // --- FRAMER MOTION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  const heroTextVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  if (isLoading) return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#f8fafc' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
        <FaCompass size={50} color="#d1a54a" />
      </motion.div>
      <p style={{ marginTop: '20px', color: '#0F2435', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase' }}>Curating Collections...</p>
    </div>
  );

  return (
    <div style={{ background: '#f4f7f6', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* --- INJECTED PREMIUM CSS --- */}
      <style>{`
        /* Card Hover Effects */
        .package-card {
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .package-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 20px 40px rgba(15, 36, 53, 0.15);
        }
        
        /* Image Zoom on Hover */
        .card-img-container { overflow: hidden; }
        .card-img {
          transition: transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .package-card:hover .card-img {
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
        backgroundImage: `linear-gradient(to bottom, rgba(15, 36, 53, 0.65), rgba(15, 36, 53, 0.95)), url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed' // Creates the parallax scroll effect
      }}>
        <motion.div initial="hidden" animate="visible" variants={heroTextVariants} style={{ position: 'relative', zIndex: 2 }}>
          <span style={{ color: '#d1a54a', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.9rem', fontWeight: '700' }}>
            Luxury Without Borders
          </span>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '4.5rem', margin: '15px 0', fontWeight: '800', textShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
            Signature Collections
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6' }}>
            Explore our handpicked travel packages designed to deliver unforgettable experiences across the globe.
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
              placeholder="Search destination, package name, or keyword..."
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

      {/* --- CONTENT SECTION --- */}
      <div style={{ maxWidth: '1300px', margin: '-50px auto 0', padding: '0 20px', position: 'relative', zIndex: 10 }}>
        
        {/* CATEGORY FILTERS */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '50px', flexWrap: 'wrap' }}
        >
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '12px 30px', 
                borderRadius: '50px', 
                border: 'none', 
                cursor: 'pointer', 
                fontWeight: '700', 
                fontSize: '0.95rem',
                letterSpacing: '0.5px',
                transition: 'all 0.3s ease',
                backgroundColor: activeCategory === cat ? '#0f172a' : 'white',
                color: activeCategory === cat ? 'white' : '#64748b',
                boxShadow: activeCategory === cat ? '0 10px 20px rgba(15, 23, 42, 0.2)' : '0 4px 15px rgba(0,0,0,0.05)'
              }}
              onMouseOver={(e) => { if(activeCategory !== cat) e.target.style.color = '#d1a54a'; }}
              onMouseOut={(e) => { if(activeCategory !== cat) e.target.style.color = '#64748b'; }}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {error && (
          <div style={{ textAlign: 'center', color: '#ef4444', padding: '40px', background: '#fef2f2', borderRadius: '16px', maxWidth: '600px', margin: '0 auto' }}>
            <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{error}</p>
          </div>
        )}

        {/* PACKAGE GRID */}
        {!error && filteredPackages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 0', background: 'white', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <h2 style={{ color: '#0F2435', fontFamily: 'Playfair Display, serif' }}>No packages found.</h2>
            <p style={{ color: '#64748b' }}>Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="visible"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '35px' }}
          >
            <AnimatePresence>
              {filteredPackages.map((pkg) => (
                <motion.div
                  key={pkg._id}
                  layout
                  variants={cardVariants}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  className="package-card"
                  style={{ 
                    background: 'white', borderRadius: '24px', overflow: 'hidden', 
                    boxShadow: '0 10px 30px rgba(0,0,0,0.06)', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', border: '1px solid #f1f5f9'
                  }}
                >
                  {/* Card Image Area */}
                  <div className="card-img-container" style={{ height: '260px', position: 'relative' }}>
                    <img src={pkg.img} alt={pkg.title} className="card-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    
                    {/* Dark gradient for text readability */}
                    <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '40%', background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }}></div>

                    {/* Frosted Duration Badge */}
                    <div style={{ position: 'absolute', top: 16, right: 16, background: '#d1a54a', padding: '6px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '800', fontSize: '0.85rem', color: '#0F2435', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
                      {pkg.duration || '5 Days, 4 Nights'}
                    </div>
                  </div>

                  {/* Card Content Area */}
                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FaMapMarkerAlt color="#d1a54a" size={14} /> {pkg.destination || pkg.city}
                      </span>
                      <span style={{ background: 'rgba(255, 255, 255, 0.9)', padding: '4px 10px', borderRadius: '20px', color: '#0F2435', fontWeight: '800', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <FaStar color="#d1a54a" size={14} /> {pkg.rating || '4.8'}
                      </span>
                    </div>
                    
                    <h3 style={{ margin: '0 0 15px', fontSize: '1.6rem', color: '#0F2435', fontFamily: 'Playfair Display, serif', fontWeight: '700', lineHeight: '1.3' }}>
                      {pkg.title}
                    </h3>
                    
                    {/* Footer / Price / Button */}
                    <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <div>
                        <small style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Starting From</small>
                        <div style={{ color: '#0F2435', fontWeight: '800', fontSize: '1.4rem', fontFamily: 'Playfair Display, serif' }}>
                          ₹{(pkg.basePrice || pkg.price || 0).toLocaleString()}
                        </div>
                      </div>
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedPackageCity(pkg.cityId || pkg._id); }}
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
                        View Details
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
        {selectedPackageCity && (
          <PackageDetailsModal 
             selectedCity={selectedPackageCity} 
             onClose={() => setSelectedPackageCity(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Packages;