import React from 'react';
import { FaHotel, FaUtensils, FaShieldAlt, FaGlobeAmericas } from 'react-icons/fa';

const Services = () => {
  const services = [
    { icon: <FaHotel />, title: 'Luxury Hotels', desc: 'Handpicked stays for maximum comfort.' },
    { icon: <FaUtensils />, title: 'Premium Dining', desc: 'Experience world-class culinary delights.' },
    { icon: <FaShieldAlt />, title: 'Travel Insurance', desc: 'Complete safety and coverage included.' },
    { icon: <FaGlobeAmericas />, title: 'Global Access', desc: 'Destinations in over 50+ countries.' },
  ];

  return (
    <div className="section-padding container">
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <p className="text-accent">Our Services</p>
            <h2>Why Travel With Us?</h2>
        </div>
        <div className="grid-container">
            {services.map((s, index) => (
                <div key={index} className="service-item">
                    <div className="service-icon">{s.icon}</div>
                    <h3>{s.title}</h3>
                    <p style={{ color: '#666', marginTop: '10px' }}>{s.desc}</p>
                </div>
            ))}
        </div>
    </div>
  );
};

export default Services;