import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaPlay, FaArrowRight, FaFacebookF, FaInstagram, FaTwitter 
} from 'react-icons/fa';

// --- DATA: Background Slides ---
// REPLACE 'YOUR_IMAGE_URL_HERE' with your actual image links if needed
const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop",
    subtitle: "DISCOVER THE UNTOUCHED",
    title: "Switzerland"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
    subtitle: "PARADISE AWAITS",
    title: "Maldives"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1776&auto=format&fit=crop",
    subtitle: "ANCIENT WONDERS",
    title: "Kyoto"
  }
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  // Auto-slide logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000); // Change every 6 seconds
    return () => clearInterval(timer);
  }, []);

  // Text Animation Variants
  const textVariant = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="hero" style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
      
      {/* 1. CINEMATIC BACKGROUND SLIDER */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            backgroundImage: `url(${slides[current].image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0,
            backgroundColor: '#0F2435'
          }}
        />
      </AnimatePresence>

      {/* Dark Gradient Overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(15,36,53,0.7), rgba(15,36,53,0.3), rgba(15,36,53,0.8))', zIndex: 1 }}></div>

      {/* 2. MAIN CONTENT */}
      <div className="container" style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: '100px', paddingBottom: '100px' }}>
        <div style={{ maxWidth: '800px' }}>
          {/* Animated Subtitle */}
          <motion.div 
            key={`sub-${current}`}
            initial="hidden" animate="visible" variants={textVariant}
            style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}
          >
            <div style={{ width: '50px', height: '2px', background: '#C5A059' }}></div>
            <span style={{ color: '#C5A059', letterSpacing: '4px', fontWeight: 'bold', fontSize: '0.9rem' }}>
              {slides[current].subtitle}
            </span>
          </motion.div>

          {/* Animated Main Title */}
          <motion.h1 
            key={`title-${current}`}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ fontSize: 'clamp(3.5rem, 6vw, 6rem)', lineHeight: '1.1', color: 'white', marginBottom: '30px', fontFamily: 'Playfair Display, serif' }}
          >
            Experience <span style={{ color: 'transparent', WebkitTextStroke: '1px white' }}>Luxury</span> <br/>
            Beyond Borders.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            style={{ fontSize: '1.1rem', color: '#e2e8f0', maxWidth: '500px', lineHeight: '1.8', marginBottom: '40px' }}
          >
            We curate the world's most exclusive travel experiences. From private islands to mountain peaks, your journey begins here.
          </motion.p>

          {/* Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
            style={{ display: 'flex', gap: '20px', alignItems: 'center' }}
          >
            <Link to="/locations">
                <button className="btn-primary" style={{ padding: '15px 40px', borderRadius: '50px', border: 'none', fontSize: '1rem', cursor: 'pointer', background: '#C5A059', color: 'white', fontWeight: 'bold', boxShadow: '0 10px 25px rgba(197, 160, 89, 0.4)' }}>
                    Explore Now
                </button>
            </Link>
         
            
          </motion.div>
        </div>

      </div>

      {/* 3. SOCIAL SIDEBAR */}
      <div style={{ position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 10 }}>
          {[FaFacebookF, FaInstagram, FaTwitter].map((Icon, i) => (
              <a key={i} href="#" style={{ color: 'white', opacity: 0.7, transition: '0.3s', fontSize: '1.2rem' }}>
                  <Icon />
              </a>
          ))}
          <div style={{ width: '2px', height: '100px', background: 'rgba(255,255,255,0.3)', margin: '0 auto' }}></div>
      </div>

      {/* 4. SLIDER INDICATORS */}
      <div style={{ position: 'absolute', bottom: '50px', right: '100px', display: 'flex', gap: '10px', zIndex: 10 }}>
          {slides.map((_, index) => (
              <div 
                key={index} 
                onClick={() => setCurrent(index)}
                style={{ 
                    width: current === index ? '30px' : '10px', 
                    height: '10px', 
                    background: current === index ? '#C5A059' : 'rgba(255,255,255,0.3)', 
                    borderRadius: '50px', cursor: 'pointer', transition: '0.3s' 
                }}
              />
          ))}
      </div>

    </div>
  );
};

export default Hero;