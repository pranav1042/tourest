import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, animate } from 'framer-motion';
import { FaAward, FaUsers, FaGlobeAmericas, FaSmile, FaLinkedin, FaTwitter } from 'react-icons/fa';

// --- SUB-COMPONENT: Animated Counter ---
const Counter = ({ from, to, duration = 2 }) => {
  const nodeRef = useRef();
  const isInView = useInView(nodeRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const node = nodeRef.current;
      const controls = animate(from, to, {
        duration: duration,
        onUpdate(value) {
          node.textContent = Math.round(value);
        },
        ease: "easeOut"
      });
      return () => controls.stop();
    }
  }, [from, to, duration, isInView]);

  return <span ref={nodeRef}>{from}</span>;
};

// --- SUB-COMPONENT: Timeline Item ---
const TimelineItem = ({ year, title, desc, index }) => (
  <motion.div 
    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, delay: index * 0.2 }}
    viewport={{ once: true }}
    style={{ 
      display: 'flex', 
      flexDirection: index % 2 === 0 ? 'row' : 'row-reverse', 
      alignItems: 'center', 
      marginBottom: '60px',
      position: 'relative'
    }}
  >
    {/* Text Side */}
    <div style={{ width: '45%', textAlign: index % 2 === 0 ? 'right' : 'left', padding: '0 30px' }}>
      <span style={{ fontSize: '3rem', fontWeight: 'bold', color: 'rgba(15, 36, 53, 0.1)', display: 'block', lineHeight: 0.8 }}>{year}</span>
      <h3 style={{ color: '#0F2435', margin: '5px 0' }}>{title}</h3>
      <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{desc}</p>
    </div>
    
    {/* Center Dot */}
    <div style={{ 
      width: '20px', height: '20px', background: '#C5A059', borderRadius: '50%', 
      border: '4px solid white', boxShadow: '0 0 0 4px rgba(197, 160, 89, 0.2)', zIndex: 2 
    }}></div>
    
    {/* Empty Side for balance */}
    <div style={{ width: '45%' }}></div>
  </motion.div>
);

const AboutUs = () => {
  // Parallax Logic
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const team = [
    { name: "Sarah Johnson", role: "CEO & Founder", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80" },
    { name: "David Chen", role: "Head of Tours", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80" },
    { name: "Maria Rodriguez", role: "Travel Specialist", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80" }
  ];

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', overflowX: 'hidden' }}>
      
      {/* 1. ADVANCED PARALLAX HERO */}
      <div ref={ref} style={{ height: '80vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div style={{ 
          position: 'absolute', top: 0, left: 0, width: '100%', height: '120%', 
          backgroundImage: 'url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop")',
          backgroundSize: 'cover', backgroundPosition: 'center', y: yBg, zIndex: -1 
        }} />
        <div style={{ position: 'absolute', top:0, left:0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(15,36,53,0.3), #f4f4f4)' }}></div>
        
        <motion.div style={{ textAlign: 'center', color: '#0F2435', opacity: opacityHero, zIndex: 1, padding: '0 20px' }}>
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} style={{ letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 'bold', color: '#C5A059' }}>Est. 2010</motion.p>
          <motion.h1 initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1, ease: "easeOut" }} style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', fontFamily: 'Playfair Display, serif', margin: '10px 0' }}>
            We Curate <br/> <span style={{ fontStyle: 'italic' }}>Memories.</span>
          </motion.h1>
        </motion.div>
      </div>

      <div className="container" style={{ position: 'relative', marginTop: '-100px', zIndex: 2 }}>
        
        {/* 2. OVERLAPPING "OUR STORY" CARD */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ background: 'white', padding: '60px', borderRadius: '30px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '60px' }}
        >
          <div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#0F2435' }}>More Than Just a <br/><span style={{ color: '#C5A059', borderBottom: '3px solid #C5A059' }}>Travel Agency</span></h2>
            <p style={{ lineHeight: '1.8', color: '#64748b', marginBottom: '20px', fontSize: '1.05rem' }}>
              We started with a simple map and a desire to see the unknown. Today, Tourest isn't just about booking flights; it's about crafting the narrative of your life.
            </p>
            <div style={{ display: 'flex', gap: '15px' }}>
               <div style={{ width: '5px', background: '#C5A059' }}></div>
               <p style={{ fontStyle: 'italic', color: '#475569' }}>"Travel is the only thing you buy that makes you richer."</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
             <motion.img whileHover={{ scale: 1.05 }} src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '15px', marginTop: '40px' }} />
             <motion.img whileHover={{ scale: 1.05 }} src="https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=400&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '15px' }} />
          </div>
        </motion.div>

        {/* 3. DYNAMIC COUNTERS */}
        <div style={{ padding: '100px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
            {[
              { label: "Travelers", end: 50000, icon: <FaUsers /> },
              { label: "Destinations", end: 120, icon: <FaGlobeAmericas /> },
              { label: "Awards Won", end: 25, icon: <FaAward /> },
              { label: "5 Star Reviews", end: 1500, icon: <FaSmile /> }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "spring" }}
                style={{ textAlign: 'center', padding: '30px', background: 'white', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
              >
                <div style={{ color: '#C5A059', fontSize: '2.5rem', marginBottom: '10px' }}>{item.icon}</div>
                <div style={{ fontSize: '3rem', fontWeight: '800', color: '#0F2435', lineHeight: '1' }}>
                  <Counter from={0} to={item.end} />+
                </div>
                <p style={{ color: '#94a3b8', fontWeight: '600', marginTop: '5px' }}>{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 4. VERTICAL TIMELINE */}
        <div style={{ marginBottom: '100px', position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
             <p className="text-accent">HISTORY</p>
             <h2>Our Milestones</h2>
          </div>
          
          {/* Vertical Line */}
          <div style={{ position: 'absolute', left: '50%', top: '100px', bottom: '0', width: '2px', background: '#e2e8f0', transform: 'translateX(-50%)' }}></div>

          <TimelineItem index={0} year="2010" title="The Beginning" desc="Started in a small garage in New York with a team of two." />
          <TimelineItem index={1} year="2015" title="First International Office" desc="Expanded operations to London, offering European tours." />
          <TimelineItem index={2} year="2020" title="Digital Revolution" desc="Launched our AI-powered booking platform." />
          <TimelineItem index={3} year="2024" title="Sustainable Travel" desc="Partnered with global NGOs for eco-friendly tourism." />
        </div>

        {/* 5. 3D TEAM CARDS */}
        <div style={{ marginBottom: '100px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
             <h2>Meet The Visionaries</h2>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -15 }}
                viewport={{ once: true }}
                style={{ width: '300px', height: '400px', position: 'relative', borderRadius: '20px', overflow: 'hidden', cursor: 'pointer', boxShadow: '0 15px 35px rgba(0,0,0,0.2)' }}
              >
                <img src={member.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={member.name} />
                
                {/* Gradient Overlay */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, #0F2435 0%, transparent 60%)' }}></div>
                
                {/* Text */}
                <div style={{ position: 'absolute', bottom: '20px', left: '20px', color: 'white' }}>
                  <h3 style={{ color: 'white', margin: 0, fontSize: '1.5rem' }}>{member.name}</h3>
                  <p style={{ color: '#C5A059', margin: 0, fontWeight: '500' }}>{member.role}</p>
                  
                  {/* Social Icons (Appear on Hover) */}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <FaLinkedin style={{ cursor: 'pointer', opacity: 0.8 }} /> <FaTwitter style={{ cursor: 'pointer', opacity: 0.8 }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;