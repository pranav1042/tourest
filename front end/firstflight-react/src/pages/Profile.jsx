import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, 
  FiBriefcase, FiLock, FiX, FiCheckCircle, FiShield,
  FiGlobe, FiCompass
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form States
  const [editForm, setEditForm] = useState({ name: '', phone: '', location: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setEditForm({ 
        name: parsedUser.name || '', 
        phone: parsedUser.phone || '', 
        location: parsedUser.location || '' 
      });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  if (!user) return null;

  // ==========================================
  // HANDLERS
  // ==========================================

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('https://tourest-cidj.vercel.app/api/auth/profile', editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const updatedUser = response.data;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setIsEditModalOpen(false);
      setLoading(false);
      
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your information has been successfully saved.',
        confirmButtonColor: '#C5A059'
      });
    } catch (error) {
      setLoading(false);
      Swal.fire({ 
        icon: 'error', 
        title: 'Update Failed', 
        text: error.response?.data?.msg || 'Could not update profile.' 
      });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return Swal.fire({ icon: 'error', title: 'Error', text: 'New passwords do not match!', confirmButtonColor: '#0F2435' });
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('https://tourest-cidj.vercel.app/api/auth/change-password', passwordForm, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsPasswordModalOpen(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setLoading(false);
      
      Swal.fire({
        icon: 'success',
        title: 'Security Updated',
        text: response.data.msg || 'Your password has been successfully changed.',
        confirmButtonColor: '#C5A059'
      });
    } catch (error) {
      setLoading(false);
      Swal.fire({ 
        icon: 'error', 
        title: 'Error', 
        text: error.response?.data?.msg || 'Failed to change password.',
        confirmButtonColor: '#0F2435'
      });
    }
  };

  // ==========================================
  // ANIMATION VARIANTS
  // ==========================================
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const modalOverlayVariants = {
    hidden: { opacity: 0, backdropFilter: "blur(0px)" },
    visible: { opacity: 1, backdropFilter: "blur(8px)", transition: { duration: 0.3 } }
  };

  const modalContentVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 300 } }
  };

  return (
    <div style={styles.pageWrapper}>
      
      {/* LUXURY HERO BANNER */}
      <div style={styles.heroBanner}>
        {/* Beautiful premium luxury destination image */}
        <img 
          src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070&auto=format&fit=crop" 
          alt="Luxury Travel" 
          style={styles.heroImage} 
        />
        <div style={styles.heroOverlay}></div>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" style={styles.container}>
        
        {/* MAIN GRID */}
        <div style={styles.grid}>
          
          {/* LEFT COLUMN: IDENTITY CARD */}
          <motion.div variants={itemVariants} style={styles.identityCard}>
            <div style={styles.avatarContainer}>
              <div style={styles.avatarRing}>
                <div style={styles.avatar}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              </div>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <h1 style={styles.userName}>{user.name || 'Premium Guest'}</h1>
              <p style={styles.userEmail}>{user.email}</p>
            </div>

            <div style={styles.divider}></div>

            {/* Travel Stats */}
            <div style={styles.statsGrid}>
              <div style={styles.statBox}>
                <FiGlobe size={20} color="#C5A059" style={{ marginBottom: '8px' }}/>
                <h4 style={styles.statValue}>12</h4>
                <small style={styles.statLabel}>Destinations</small>
              </div>
              <div style={styles.statBox}>
                <FiCompass size={20} color="#C5A059" style={{ marginBottom: '8px' }}/>
                <h4 style={styles.statValue}>8,450</h4>
                <small style={styles.statLabel}>Miles</small>
              </div>
            </div>

            <Link to="/my-bookings" style={{ textDecoration: 'none' }}>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={styles.goldBtn}>
                <FiBriefcase size={18} /> View My Itineraries
              </motion.button>
            </Link>
          </motion.div>

          {/* RIGHT COLUMN: DETAILS & SECURITY */}
          <div style={styles.rightColumn}>
            
            {/* Personal Information */}
            <motion.div variants={itemVariants} style={styles.infoCard}>
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.cardTitle}>Personal Profile</h2>
                  <p style={styles.cardSubtitle}>Manage your contact details and home base.</p>
                </div>
                <motion.button 
                  whileHover={{ backgroundColor: '#f1f5f9' }}
                  onClick={() => setIsEditModalOpen(true)} 
                  style={styles.editBtn}
                >
                  <FiEdit2 size={16} /> Edit
                </motion.button>
              </div>
              
              <div style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <div style={styles.iconBox}><FiUser color="#C5A059" size={20} /></div>
                  <div>
                    <small style={styles.label}>Full Name</small>
                    <p style={styles.value}>{user.name || 'Not Provided'}</p>
                  </div>
                </div>

                <div style={styles.infoItem}>
                  <div style={styles.iconBox}><FiPhone color="#C5A059" size={20} /></div>
                  <div>
                    <small style={styles.label}>Phone Number</small>
                    <p style={styles.value}>{user.phone || 'Not Provided'}</p>
                  </div>
                </div>

                <div style={styles.infoItem}>
                  <div style={styles.iconBox}><FiMail color="#C5A059" size={20} /></div>
                  <div>
                    <small style={styles.label}>Email Address</small>
                    <p style={styles.value}>{user.email}</p>
                  </div>
                </div>

                <div style={styles.infoItem}>
                  <div style={styles.iconBox}><FiMapPin color="#C5A059" size={20} /></div>
                  <div>
                    <small style={styles.label}>Home Location</small>
                    <p style={styles.value}>{user.location || 'Not Provided'}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Account Security */}
            <motion.div variants={itemVariants} style={styles.infoCard}>
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.cardTitle}>Account Security</h2>
                  <p style={styles.cardSubtitle}>Keep your luxury account safe and sound.</p>
                </div>
                <div style={styles.secureBadge}><FiShield /> Protected</div>
              </div>
              
              <div style={styles.securityRow}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{...styles.iconBox, background: 'rgba(15, 36, 53, 0.05)'}}>
                    <FiLock color="#0F2435" size={20}/>
                  </div>
                  <div>
                    <h4 style={styles.securityLabel}>Password</h4>
                    <p style={styles.securityDesc}>Last changed recently</p>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setIsPasswordModalOpen(true)} 
                  style={styles.outlineBtn}
                >
                  Update
                </motion.button>
              </div>

              <div style={styles.settingsDivider}></div>

              <div style={styles.securityRow}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{...styles.iconBox, background: 'rgba(16, 185, 129, 0.1)'}}>
                    <FiCheckCircle color="#10b981" size={20}/>
                  </div>
                  <div>
                    <h4 style={styles.securityLabel}>Account Status</h4>
                    <p style={styles.securityDesc}>Active & Verified</p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </motion.div>

      {/* ========================================== */}
      {/* LUXURY MODALS */}
      {/* ========================================== */}
      <AnimatePresence>
        
        {/* EDIT PROFILE MODAL */}
        {isEditModalOpen && (
          <motion.div variants={modalOverlayVariants} initial="hidden" animate="visible" exit="hidden" style={styles.modalOverlay}>
            <motion.div variants={modalContentVariants} style={styles.modalContent}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>Update Profile</h3>
                <button onClick={() => setIsEditModalOpen(false)} style={styles.closeBtn}><FiX size={24} /></button>
              </div>
              <p style={styles.modalSubtitle}>Ensure your details match your travel documents.</p>
              
              <form onSubmit={handleEditSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Full Name</label>
                  <input type="text" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} style={styles.input} required />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Phone Number</label>
                  <input type="text" value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} style={styles.input} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Location (City, Country)</label>
                  <input type="text" value={editForm.location} onChange={(e) => setEditForm({...editForm, location: e.target.value})} style={styles.input} />
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} style={styles.submitBtn}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* CHANGE PASSWORD MODAL */}
        {isPasswordModalOpen && (
          <motion.div variants={modalOverlayVariants} initial="hidden" animate="visible" exit="hidden" style={styles.modalOverlay}>
            <motion.div variants={modalContentVariants} style={styles.modalContent}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>Change Password</h3>
                <button onClick={() => setIsPasswordModalOpen(false)} style={styles.closeBtn}><FiX size={24} /></button>
              </div>
              <p style={styles.modalSubtitle}>Create a strong password to protect your bookings.</p>

              <form onSubmit={handlePasswordSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Current Password</label>
                  <input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})} style={styles.input} required />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>New Password</label>
                  <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})} style={styles.input} required minLength="6" />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Confirm New Password</label>
                  <input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} style={styles.input} required minLength="6" />
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} style={styles.submitBtn}>
                  {loading ? 'Updating...' : 'Update Security'}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

// --- PREMIUM LUXURY STYLES ---
const styles = {
  pageWrapper: { minHeight: '100vh', background: '#f4f7f6', paddingBottom: '80px', fontFamily: 'Inter, sans-serif' },
  
  // Hero Banner
  heroBanner: { position: 'relative', width: '100%', height: '320px', overflow: 'hidden' },
  heroImage: { width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' },
  heroOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,36,53,0.1) 0%, #f4f7f6 100%)' },
  
  container: { maxWidth: '1100px', margin: '-140px auto 0 auto', padding: '0 20px', position: 'relative', zIndex: 10 },
  
  // Grid Layout
  grid: { display: 'grid', gridTemplateColumns: window.innerWidth < 900 ? '1fr' : '320px 1fr', gap: '30px' },
  rightColumn: { display: 'flex', flexDirection: 'column', gap: '30px' },
  
  // Identity Card (Left)
  identityCard: { background: 'white', padding: '40px 30px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(15,36,53,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', border: '1px solid rgba(0,0,0,0.02)' },
  avatarContainer: { position: 'relative', display: 'inline-block' },
  avatarRing: { padding: '5px', borderRadius: '50%', background: '#C5A059', boxShadow: '0 10px 25px rgba(197, 160, 89, 0.3)' },
  avatar: { width: '110px', height: '110px', borderRadius: '50%', background: '#0F2435', color: 'white', fontSize: '3rem', fontFamily: 'Playfair Display, serif', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '4px solid white' },
  
  userName: { margin: '0', fontSize: '1.8rem', color: '#0F2435', fontFamily: 'Playfair Display, serif', fontWeight: '700' },
  userEmail: { margin: '5px 0 0 0', color: '#64748b', fontSize: '0.9rem' },
  
  divider: { width: '100%', height: '1px', background: '#e2e8f0', margin: '30px 0' },
  
  statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', width: '100%', marginBottom: '30px' },
  statBox: { background: '#f8fafc', padding: '20px', borderRadius: '16px', textAlign: 'center', border: '1px solid #e2e8f0' },
  statValue: { margin: '0', fontSize: '1.5rem', color: '#0F2435', fontWeight: '800' },
  statLabel: { color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' },
  
  goldBtn: { width: '100%', background: '#C5A059', color: 'white', border: 'none', padding: '16px', borderRadius: '14px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 10px 20px rgba(197, 160, 89, 0.25)' },

  // Info Cards (Right)
  infoCard: { background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(15,36,53,0.04)', border: '1px solid rgba(0,0,0,0.02)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '35px' },
  cardTitle: { margin: 0, fontSize: '1.6rem', color: '#0F2435', fontFamily: 'Playfair Display, serif', fontWeight: '700' },
  cardSubtitle: { margin: '5px 0 0 0', color: '#64748b', fontSize: '0.9rem' },
  
  editBtn: { background: 'transparent', color: '#0F2435', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', transition: 'all 0.2s' },
  secureBadge: { background: '#ecfeff', color: '#10b981', padding: '6px 12px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' },

  // Info Grid
  infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '30px' },
  infoItem: { display: 'flex', alignItems: 'center', gap: '18px' },
  iconBox: { width: '50px', height: '50px', borderRadius: '14px', background: '#fcfaf5', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid rgba(197, 160, 89, 0.2)' },
  label: { color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' },
  value: { margin: '4px 0 0 0', color: '#1e293b', fontWeight: '600', fontSize: '1.05rem' },

  // Security Rows
  securityRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  securityLabel: { margin: 0, color: '#1e293b', fontWeight: '700', fontSize: '1.05rem' },
  securityDesc: { margin: '4px 0 0 0', color: '#64748b', fontSize: '0.9rem' },
  settingsDivider: { height: '1px', background: '#f1f5f9', margin: '25px 0' },
  outlineBtn: { background: 'transparent', border: '2px solid #0F2435', color: '#0F2435', padding: '8px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem' },

  // Modals
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(15, 36, 53, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' },
  modalContent: { background: 'white', width: '100%', maxWidth: '480px', borderRadius: '24px', padding: '40px', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { margin: 0, fontSize: '1.8rem', fontFamily: 'Playfair Display, serif', color: '#0F2435', fontWeight: '700' },
  modalSubtitle: { color: '#64748b', fontSize: '0.95rem', margin: '8px 0 30px 0' },
  closeBtn: { background: '#f1f5f9', border: 'none', color: '#64748b', cursor: 'pointer', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'background 0.2s' },
  
  form: { display: 'flex', flexDirection: 'column', gap: '22px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  inputLabel: { fontSize: '0.85rem', fontWeight: '700', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '1rem', background: '#f8fafc', color: '#0F2435', transition: 'border 0.3s', fontWeight: '500' },
  submitBtn: { padding: '18px', background: '#0F2435', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.05rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', boxShadow: '0 10px 20px rgba(15,36,53,0.2)' }
};

export default Profile;