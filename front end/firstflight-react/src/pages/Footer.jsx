import React, { useState, useEffect } from 'react';
import { 
  FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, 
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPaperPlane 
} from 'react-icons/fa';
import { SiVisa, SiMastercard, SiPaypal, SiAmericanexpress } from 'react-icons/si';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location]);

  // Handle Logout from footer
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/'; 
  };

  return (
    <footer className="footer" style={{ 
        background: '#0F2435', // Deep Navy
        color: '#e2e8f0', 
        paddingTop: '80px',
        position: 'relative',
        overflow: 'hidden'
    }}>
      
      {/* Decorative Top Border */}
      <div style={{ height: '4px', width: '100%', background: 'linear-gradient(to right, #0F2435, #C5A059, #0F2435)', position: 'absolute', top: 0, left: 0 }}></div>

      <div className="container">
      <div className="footer-grid" style={{ 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
    gap: '50px',
    marginBottom: '60px' 
}}>
          
          {/* 1. Brand Section */}
          <div>
            <h2 style={{ color: 'white', fontFamily: 'Playfair Display, serif', fontSize: '2rem', marginBottom: '20px' }}>
              TOUREST<span style={{ color: '#C5A059' }}>.</span>
            </h2>
            <p style={{ lineHeight: '1.8', fontSize: '0.95rem', color: '#94a3b8', marginBottom: '25px' }}>
              Discover the world with premium comfort. We curate exclusive travel experiences tailored to your dreams, ensuring every journey is unforgettable.
            </p>
            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '15px' }}>
                {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, index) => (
                    <a key={index} href="#" style={{ 
                        width: '40px', height: '40px', borderRadius: '50%', 
                        background: 'rgba(255,255,255,0.1)', display: 'flex', 
                        alignItems: 'center', justifyContent: 'center', color: 'white',
                        transition: '0.3s'
                    }} 
                    onMouseOver={(e) => { e.currentTarget.style.background = '#C5A059'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)' }}
                    >
                        <Icon size={14} />
                    </a>
                ))}
            </div>
          </div>

          {/* 2. Quick Links (FIXED TO MATCH APP.JS ROUTES) */}
          <div>
            <h3 style={{ color: 'white', marginBottom: '25px', fontSize: '1.2rem' }}>Quick Links</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>
                  <Link to="/" style={{ textDecoration: 'none', color: '#cbd5e1', transition: '0.3s', display: 'flex', alignItems: 'center', gap: '8px' }}
                  onMouseOver={(e) => { e.currentTarget.style.color = '#C5A059'; e.currentTarget.style.paddingLeft = '5px' }}
                  onMouseOut={(e) => { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.paddingLeft = '0' }}>
                      <span style={{ fontSize: '10px', color: '#C5A059' }}>›</span> Home
                  </Link>
              </li>
              <li>
                  <Link to="/locations" style={{ textDecoration: 'none', color: '#cbd5e1', transition: '0.3s', display: 'flex', alignItems: 'center', gap: '8px' }}
                  onMouseOver={(e) => { e.currentTarget.style.color = '#C5A059'; e.currentTarget.style.paddingLeft = '5px' }}
                  onMouseOut={(e) => { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.paddingLeft = '0' }}>
                      <span style={{ fontSize: '10px', color: '#C5A059' }}>›</span> Destinations
                  </Link>
              </li>
              <li>
                  <Link to="/packages" style={{ textDecoration: 'none', color: '#cbd5e1', transition: '0.3s', display: 'flex', alignItems: 'center', gap: '8px' }}
                  onMouseOver={(e) => { e.currentTarget.style.color = '#C5A059'; e.currentTarget.style.paddingLeft = '5px' }}
                  onMouseOut={(e) => { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.paddingLeft = '0' }}>
                      <span style={{ fontSize: '10px', color: '#C5A059' }}>›</span> Packages
                  </Link>
              </li>
              <li>
                  <Link to="/about" style={{ textDecoration: 'none', color: '#cbd5e1', transition: '0.3s', display: 'flex', alignItems: 'center', gap: '8px' }}
                  onMouseOver={(e) => { e.currentTarget.style.color = '#C5A059'; e.currentTarget.style.paddingLeft = '5px' }}
                  onMouseOut={(e) => { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.paddingLeft = '0' }}>
                      <span style={{ fontSize: '10px', color: '#C5A059' }}>›</span> About Us
                  </Link>
              </li>
            </ul>
          </div>

          {/* 3. Login Section (DYNAMIC BASED ON LOGIN STATUS) */}
          <div>
            <h3 style={{ color: 'white', marginBottom: '25px', fontSize: '1.2rem' }}>Account</h3>
            
            {user ? (
              // IF LOGGED IN
              <>
                <p style={{ lineHeight: '1.8', fontSize: '0.95rem', color: '#94a3b8', marginBottom: '20px' }}>
                    Welcome back, {user.name?.split(' ')[0] || 'Traveler'}! Manage your profile and view your upcoming trips.
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link to="/profile">
                      <button style={{ 
                          padding: '12px 20px', background: '#C5A059', color: 'white', border: 'none', 
                          borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem',
                          transition: '0.3s', boxShadow: '0 4px 15px rgba(197, 160, 89, 0.3)'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                          My Profile
                      </button>
                  </Link>
                  <button 
                      onClick={handleLogout}
                      style={{ 
                          padding: '12px 20px', background: 'transparent', color: '#e11d48', border: '1px solid #e11d48', 
                          borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem',
                          transition: '0.3s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'rgba(225, 29, 72, 0.1)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                      Logout
                  </button>
                </div>
              </>
            ) : (
              // IF LOGGED OUT
              <>
                <p style={{ lineHeight: '1.8', fontSize: '0.95rem', color: '#94a3b8', marginBottom: '20px' }}>
                    Sign in to manage your bookings, view your itinerary, and access exclusive member deals.
                </p>
                <Link to="/login">
                    <button style={{ 
                        padding: '12px 30px', background: '#C5A059', color: 'white', border: 'none', 
                        borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem',
                        transition: '0.3s', boxShadow: '0 4px 15px rgba(197, 160, 89, 0.3)'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        Login / Sign Up
                    </button>
                </Link>
              </>
            )}
          </div>

          {/* 4. Newsletter */}
          <div>
            <h3 style={{ color: 'white', marginBottom: '25px', fontSize: '1.2rem' }}>Newsletter</h3>
            <p style={{ marginBottom: '20px', color: '#94a3b8', fontSize: '0.9rem' }}>Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            <div style={{ position: 'relative' }}>
                <input type="email" placeholder="Your email address" style={{ 
                    width: '100%', padding: '15px', borderRadius: '5px', 
                    border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', 
                    color: 'white', outline: 'none'
                }} />
                <button style={{ 
                    position: 'absolute', right: '5px', top: '5px', bottom: '5px', 
                    background: '#C5A059', color: 'white', border: 'none', 
                    padding: '0 20px', borderRadius: '4px', cursor: 'pointer',
                    fontWeight: 'bold', transition: '0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#d4af37'}
                onMouseOut={(e) => e.currentTarget.style.background = '#C5A059'}
                >
                    <FaPaperPlane />
                </button>
            </div>
          </div>

        </div>
        
        {/* Bottom Bar */}
        <div style={{ 
            borderTop: '1px solid rgba(255,255,255,0.1)', 
            padding: '30px 0', 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            gap: '20px'
        }}>
            <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
                &copy; {new Date().getFullYear()} Tourest. All Rights Reserved.
            </p>
            
            {/* Payment Icons */}
            <div style={{ display: 'flex', gap: '15px', fontSize: '2rem', color: '#cbd5e1', opacity: 0.6 }}>
                <SiVisa /> <SiMastercard /> <SiPaypal /> <SiAmericanexpress />
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;