import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaPlane } from 'react-icons/fa';
import { FiLogOut, FiBriefcase, FiSettings, FiChevronDown, FiChevronRight } from 'react-icons/fi'; 
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [click, setClick] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => {
    setClick(false);
    setDropdownOpen(false);
  };

  // --- AUTH & SCROLL LOGIC ---
  useEffect(() => {
    const handleScroll = () => {
      // Trigger the morph to Solid White after scrolling down 50px
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check immediately on mount

    // FIX: Removed the hardcoded 'prajapati' mock data. 
    // Now it strictly relies on real authentication data.
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (storedUser && token && storedUser !== "undefined") {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    
    checkAuth();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]); // Re-run this check whenever the route changes

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setDropdownOpen(false);
    navigate('/login'); 
  };

  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : 'U';
  const getFirstName = (name) => name ? name.split(' ')[0].toLowerCase() : 'user';

  // --- FRAMER MOTION ANIMATION VARIANTS ---
  const dropdownVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 400, damping: 25 } },
    exit: { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.2 } }
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, clipPath: 'circle(0% at 100% 0)' },
    visible: { opacity: 1, clipPath: 'circle(150% at 100% 0)', transition: { type: "spring", bounce: 0, duration: 0.7, staggerChildren: 0.1 } },
    exit: { opacity: 0, clipPath: 'circle(0% at 100% 0)', transition: { type: "spring", bounce: 0, duration: 0.5 } }
  };

  const mobileLinkVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  // Dynamic class based on scroll state
  const navClass = scrolled ? 'nav-solid' : 'nav-transparent';

  return (
    <>
      {/* --- PREMIUM CSS ARCHITECTURE --- */}
      <style>{`
        :root {
          --gold-primary: #d6a848; 
          --gold-hover: #c2953a;
          --text-light: #ffffff;
          --text-dark: #0f172a;
          --nav-height: 90px;
        }

        /* Master Navbar Wrapper */
        .master-navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: var(--nav-height);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          transition: background-color 0.5s cubic-bezier(0.25, 0.8, 0.25, 1), 
                      box-shadow 0.5s cubic-bezier(0.25, 0.8, 0.25, 1),
                      height 0.5s ease;
        }

        .navbar-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          max-width: 1400px;
          padding: 0 40px;
        }

        /* =========================================
           STATE 1: TRANSPARENT (Top of Page)
           ========================================= */
        .nav-transparent {
          background-color: transparent;
          box-shadow: none;
        }
        .nav-transparent .logo-text, .nav-transparent .nav-links, .nav-transparent .menu-icon svg { 
          color: var(--text-light); 
        }
        .nav-transparent .user-pill {
          background-color: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: var(--text-light);
          backdrop-filter: blur(8px);
        }
        .nav-transparent .user-pill:hover { background-color: rgba(255, 255, 255, 0.25); }


        /* =========================================
           STATE 2: SOLID WHITE (Scrolled)
           ========================================= */
        .nav-solid {
          background-color: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.08);
          height: 80px; 
        }
        .nav-solid .logo-text, .nav-solid .menu-icon svg { color: var(--text-dark); }
        .nav-solid .nav-links { color: var(--text-dark); font-weight: 700; }
        .nav-solid .user-pill {
          background-color: #f1f5f9;
          border: 1px solid #e2e8f0;
          color: var(--text-dark);
        }
        .nav-solid .user-pill:hover { background-color: #e2e8f0; }


        /* =========================================
           CORE TYPOGRAPHY & COMPONENTS
           ========================================= */
        
        .navbar-logo {
          display: flex; align-items: center; gap: 12px;
          text-decoration: none; cursor: pointer;
        }
        .logo-icon { color: var(--gold-primary); font-size: 1.5rem; transform: rotate(-15deg); }
        .logo-text { font-family: 'Playfair Display', serif; font-weight: 800; letter-spacing: 3px; font-size: 1.5rem; transition: color 0.5s ease; }

        .nav-menu { display: flex; align-items: center; list-style: none; gap: 40px; margin: 0; }

        .nav-links {
          text-decoration: none; font-family: 'Inter', sans-serif; font-size: 0.85rem;
          font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;
          position: relative; padding: 8px 0; transition: color 0.3s ease;
        }
        .nav-links:hover { color: var(--gold-primary); }
        .nav-links::after {
          content: ''; position: absolute; bottom: 0; left: 0; width: 0%; height: 2px;
          background-color: var(--gold-primary); transition: width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .nav-links:hover::after, .nav-links.active::after { width: 100%; }

        /* User Profile Pill */
        .user-pill {
          display: flex; align-items: center; gap: 12px;
          padding: 6px 16px 6px 6px; border-radius: 50px;
          cursor: pointer; transition: all 0.4s ease;
        }
        .user-pill:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        
        .avatar-circle {
          width: 36px; height: 36px; min-width: 36px; border-radius: 50%; flex-shrink: 0; /* Fixes oval issue */
          background-color: var(--gold-primary); color: #fff;
          display: flex; justify-content: center; align-items: center;
          font-weight: 800; font-size: 1rem; box-shadow: 0 4px 10px rgba(214, 168, 72, 0.4);
        }
        .pill-name { font-weight: 600; font-size: 0.95rem; letter-spacing: 0.5px; transition: color 0.5s ease; }

        /* The Gold 'Book Now' Button */
        .btn-book {
          background-color: var(--gold-primary); color: #fff;
          padding: 12px 30px; border-radius: 50px; text-decoration: none;
          font-weight: 800; font-size: 0.85rem; letter-spacing: 1px; text-transform: uppercase;
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); border: none;
          box-shadow: 0 4px 15px rgba(214, 168, 72, 0.3);
        }
        .btn-book:hover { 
          background-color: var(--gold-hover); transform: translateY(-3px) scale(1.02); 
          box-shadow: 0 8px 25px rgba(214, 168, 72, 0.5); 
        }

        /* =========================================
           UPGRADED LUXURY DROPDOWN
           ========================================= */
        .premium-dropdown {
          position: absolute; top: 85px; right: 0; width: 320px;
          background: #ffffff; border-radius: 20px;
          box-shadow: 0 20px 50px rgba(15, 36, 53, 0.15); 
          border: 1px solid rgba(15,36,53, 0.06);
          display: flex; flex-direction: column; overflow: hidden; z-index: 1000;
        }
        .drop-header { 
          padding: 25px; background: linear-gradient(to bottom, #f8fafc, #ffffff); 
          border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 18px; 
        }
        .drop-avatar { 
          width: 55px; height: 55px; min-width: 55px; border-radius: 50%; flex-shrink: 0; /* Prevents Oval */
          background: linear-gradient(135deg, #d6a848, #fde08b); color: #0f172a; 
          display: flex; justify-content: center; align-items: center; 
          font-weight: 800; font-size: 1.6rem; box-shadow: 0 5px 15px rgba(214, 168, 72, 0.4); 
          font-family: 'Playfair Display', serif;
        }
        .drop-name { margin: 0 0 4px 0; font-weight: 800; color: #0f172a; text-transform: capitalize; font-size: 1.2rem; font-family: 'Playfair Display', serif;}
        .drop-email { margin: 0; font-size: 0.85rem; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 190px; }
        
        .drop-items-container { padding: 12px; }
        .drop-item { 
          display: flex; align-items: center; justify-content: space-between; 
          padding: 14px 16px; margin-bottom: 4px; border-radius: 12px;
          color: #334155; text-decoration: none; font-weight: 600; font-size: 0.95rem; 
          transition: all 0.3s ease; background: transparent; border: none; width: 100%; cursor: pointer; 
        }
        .drop-item:hover { background: #f8fafc; color: #0f172a; transform: translateX(4px); }
        .drop-item .drop-icon { color: #d6a848; transition: all 0.3s; }
        .drop-item:hover .drop-icon { transform: scale(1.15); }
        .drop-item .arrow { opacity: 0; transform: translateX(-10px); transition: all 0.3s; color: #d6a848; }
        .drop-item:hover .arrow { opacity: 1; transform: translateX(0); }

        .logout-btn:hover { background: #fef2f2; color: #ef4444; }
        .logout-btn .drop-icon { color: #ef4444; }
        .logout-btn:hover .arrow { color: #ef4444; }

        /* Mobile Adjustments */
        .menu-icon { display: none; font-size: 1.8rem; cursor: pointer; z-index: 10001; transition: color 0.5s ease; }
        @media screen and (max-width: 960px) {
          .nav-menu { display: none; }
          .menu-icon { display: block; }
          .navbar-container { padding: 0 20px; }
        }
      `}</style>

      <nav className={`master-navbar ${navClass}`}>
        <div className="navbar-container">
          
          {/* LOGO */}
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
              <FaPlane className="logo-icon" />
            </motion.div>
            <span className="logo-text">TOUREST</span>
          </Link>

          {/* MOBILE TOGGLE ICON */}
          <div className="menu-icon" onClick={handleClick}>
            {click ? <FaTimes /> : <FaBars />}
          </div>

          {/* DESKTOP NAVIGATION */}
          <ul className="nav-menu">
            <li>
              <Link to="/" className={`nav-links ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
            </li>
            <li>
              <Link to="/about" className={`nav-links ${location.pathname === '/about' ? 'active' : ''}`}>About</Link>
            </li>
            <li>
              <Link to="/locations" className={`nav-links ${location.pathname.includes('/locations') ? 'active' : ''}`}>Destinations</Link>
            </li>
            <li>
              <Link to="/packages" className={`nav-links ${location.pathname === '/packages' ? 'active' : ''}`}>Packages</Link>
            </li>
            
            {/* DYNAMIC USER PILL OR LOGIN */}
            {user ? (
              <li style={{ position: 'relative', marginLeft: '10px' }}>
                <div className="user-pill" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <div className="avatar-circle">{getInitial(user.name || user.fullName)}</div>
                  <span className="pill-name">{getFirstName(user.name || user.fullName)}</span>
                  <motion.div animate={{ rotate: dropdownOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <FiChevronDown size={18} style={{ marginTop: '2px' }} />
                  </motion.div>
                </div>

                {/* PREMIUM DROPDOWN ANIMATION */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <>
                      {/* Invisible backdrop to close dropdown when clicking outside */}
                      <div style={{ position: 'fixed', inset: 0, zIndex: 999 }} onClick={() => setDropdownOpen(false)} />
                      
                      <motion.div variants={dropdownVariants} initial="hidden" animate="visible" exit="exit" className="premium-dropdown">
                        
                        <div className="drop-header">
                          <div className="drop-avatar">{getInitial(user.name || user.fullName)}</div>
                          <div style={{ overflow: 'hidden' }}>
                            <p className="drop-name">{user.name || user.fullName}</p>
                            <p className="drop-email">{user.email}</p>
                          </div>
                        </div>
                        
                        <div className="drop-items-container">
                          <Link to="/profile" className="drop-item" onClick={closeMobileMenu}>
                            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                              <FiSettings className="drop-icon" size={20} /> My Profile
                            </div>
                            <FiChevronRight className="arrow" size={18} />
                          </Link>
                          
                          <Link to="/my-bookings" className="drop-item" onClick={closeMobileMenu}>
                            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                              <FiBriefcase className="drop-icon" size={20} /> My Trips
                            </div>
                            <FiChevronRight className="arrow" size={18} />
                          </Link>
                          
                          <div style={{ height: '1px', background: '#f1f5f9', margin: '8px 10px' }}></div>
                          
                          <button onClick={handleLogout} className="drop-item logout-btn">
                            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                              <FiLogOut className="drop-icon" size={20} /> Logout
                            </div>
                            <FiChevronRight className="arrow" size={18} />
                          </button>
                        </div>

                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </li>
            ) : (
              <li>
                <Link to="/login" className={`nav-links ${location.pathname === '/login' ? 'active' : ''}`}>Login</Link>
              </li>
            )}

            {/* GOLD BOOK NOW BUTTON */}
            <li style={{ marginLeft: '15px' }}>
              <Link to="/packages" className="btn-book">Book Now</Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* STUNNING FULLSCREEN MOBILE MENU */}
      <AnimatePresence>
        {click && (
          <motion.div 
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', background: 'rgba(15, 23, 42, 0.98)', backdropFilter: 'blur(20px)', zIndex: 10000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              
              {user && (
                <motion.div variants={mobileLinkVariants} style={{ textAlign: 'center', marginBottom: '40px', paddingBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', width: '80%' }}>
                  <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'linear-gradient(135deg, #d6a848, #fde08b)', color: '#0f172a', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: '800', fontSize: '2.8rem', fontFamily: 'Playfair Display, serif', margin: '0 auto', boxShadow: '0 10px 30px rgba(214, 168, 72, 0.4)' }}>
                    {getInitial(user.name || user.fullName)}
                  </div>
                  <h3 style={{ color: 'white', marginTop: '20px', fontSize: '1.8rem', fontFamily: 'Playfair Display, serif', letterSpacing: '1px' }}>{user.name || user.fullName}</h3>
                </motion.div>
              )}

              <motion.div variants={mobileLinkVariants}><Link to="/" onClick={closeMobileMenu} style={mobileLinkStyle}>Home</Link></motion.div>
              <motion.div variants={mobileLinkVariants}><Link to="/about" onClick={closeMobileMenu} style={mobileLinkStyle}>About</Link></motion.div>
              <motion.div variants={mobileLinkVariants}><Link to="/locations" onClick={closeMobileMenu} style={mobileLinkStyle}>Destinations</Link></motion.div>
              <motion.div variants={mobileLinkVariants}><Link to="/packages" onClick={closeMobileMenu} style={mobileLinkStyle}>Packages</Link></motion.div>
              
              {user ? (
                <>
                  <motion.div variants={mobileLinkVariants}><Link to="/profile" onClick={closeMobileMenu} style={mobileLinkStyle}>Profile</Link></motion.div>
                  <motion.div variants={mobileLinkVariants}><Link to="/my-bookings" onClick={closeMobileMenu} style={mobileLinkStyle}>My Trips</Link></motion.div>
                  <motion.div variants={mobileLinkVariants}><button onClick={handleLogout} style={{ ...mobileLinkStyle, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>Logout</button></motion.div>
                </>
              ) : (
                <motion.div variants={mobileLinkVariants}><Link to="/login" onClick={closeMobileMenu} style={mobileLinkStyle}>Login</Link></motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Inline styling strictly for mobile links
const mobileLinkStyle = { 
  color: 'white', 
  textDecoration: 'none', 
  fontSize: '1.6rem', 
  margin: '15px 0', 
  textTransform: 'uppercase', 
  letterSpacing: '3px', 
  fontWeight: '800',
  display: 'block'
};

export default Navbar;