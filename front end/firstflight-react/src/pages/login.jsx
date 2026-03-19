import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaGoogle, FaFacebookF, FaApple, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import axios from 'axios';
import Swal from 'sweetalert2';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  // OTP Modal States
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1 = Email, 2 = OTP & New Password
  const [resetData, setResetData] = useState({ email: '', otp: '', newPassword: '', confirmPassword: '' });

  // ==========================================
  // STANDARD LOGIN
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      Swal.fire({ icon: 'success', title: 'Welcome Back!', text: 'Login successful.', timer: 1500, showConfirmButton: false });
      setTimeout(() => window.location.href = '/', 1500);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: err.response?.data?.msg || 'Invalid Credentials' });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SEND OTP
  // ==========================================
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email: resetData.email });
      Swal.fire({ icon: 'success', title: 'OTP Sent!', text: response.data.msg, confirmButtonColor: '#C5A059' });
      setForgotStep(2); // Move to Step 2 (Enter OTP)
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.msg || 'Failed to send OTP' });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // VERIFY OTP & RESET PASSWORD
  // ==========================================
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (resetData.newPassword !== resetData.confirmPassword) {
      return Swal.fire({ icon: 'error', title: 'Error', text: 'Passwords do not match!' });
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
        email: resetData.email,
        otp: resetData.otp,
        newPassword: resetData.newPassword
      });

      Swal.fire({ icon: 'success', title: 'Success!', text: response.data.msg, confirmButtonColor: '#C5A059' });
      
      // Close modal and reset state
      setIsForgotModalOpen(false);
      setForgotStep(1);
      setResetData({ email: '', otp: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.msg || 'Invalid OTP' });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div style={styles.pageWrapper}>
      {/* LEFT SIDE: VISUALS */}
      <div className="auth-visuals" style={styles.visualsSide}>
        <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop" alt="Luxury Hotel" style={styles.bgImg} />
        <div style={styles.overlay}></div>
        <div style={styles.visualContent}>
          <h1 style={styles.visualH1}>Welcome <br/> Back.</h1>
          <p style={styles.visualP}>"Travel is the only thing you buy that makes you richer." <br/> Continue your journey with Tourest.</p>
        </div>
      </div>

      {/* RIGHT SIDE: FORM */}
      <div style={styles.formSide}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={styles.formCard}>
          <Link to="/" style={styles.backLink}><FaArrowLeft /> Back to Home</Link>

          <div style={{ marginBottom: '30px' }}>
            <h2 style={styles.h2}>Log In</h2>
            <p style={styles.subText}>Enter your credentials to access your account.</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <div style={s.inputIconWrap}>
                <FaEnvelope style={s.icon} />
                <input required type="email" placeholder="name@company.com" style={s.input} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label style={styles.label}>Password</label>
                {/* Opens the OTP Modal */}
                <span onClick={() => setIsForgotModalOpen(true)} style={styles.forgot}>Forgot?</span>
              </div>
              <div style={s.inputIconWrap}>
                <FaLock style={s.icon} />
                <input required type="password" placeholder="Enter your password" style={s.input} onChange={(e) => setFormData({...formData, password: e.target.value})} />
              </div>
            </div>

            <motion.button disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{...styles.submitBtn, opacity: loading ? 0.7 : 1}}>
              {loading ? <FaSpinner className="spin" /> : 'Sign In'}
            </motion.button>
          </form>

          <div style={styles.dividerWrap}>
            <div style={styles.line}></div>
            <span style={styles.dividerText}>Or continue with</span>
            <div style={styles.line}></div>
          </div>

          <div style={styles.socialRow}>
            <button style={styles.socialBtn}><FaGoogle color="#DB4437" /></button>
            <button style={styles.socialBtn}><FaFacebookF color="#4267B2" /></button>
            <button style={styles.socialBtn}><FaApple color="black" /></button>
          </div>

          <p style={styles.footerText}>New to Tourest? <Link to="/register" style={styles.footerLink}>Create an account</Link></p>
        </motion.div>
      </div>

      {/* ========================================== */}
      {/* FORGOT PASSWORD OTP MODAL                  */}
      {/* ========================================== */}
      <AnimatePresence>
        {isForgotModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.modalOverlay}>
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} style={styles.modalContent}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>Reset Password</h3>
                <button onClick={() => { setIsForgotModalOpen(false); setForgotStep(1); }} style={styles.closeBtn}><FiX size={24} /></button>
              </div>

              {forgotStep === 1 ? (
                // STEP 1: ENTER EMAIL TO GET OTP
                <form onSubmit={handleSendOtp} style={styles.form}>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '10px' }}>Enter your email address and we will send you a 6-digit OTP to reset your password.</p>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Email Address</label>
                    <input type="email" required style={s.inputPlain} placeholder="Enter your email" value={resetData.email} onChange={e => setResetData({...resetData, email: e.target.value})} />
                  </div>
                  <button type="submit" disabled={loading} style={styles.submitBtn}>
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </form>
              ) : (
                // STEP 2: ENTER OTP & NEW PASSWORD
                <form onSubmit={handleResetPassword} style={styles.form}>
                  <p style={{ color: '#10b981', fontSize: '0.9rem', marginBottom: '10px', fontWeight: 'bold' }}>✓ OTP Sent to {resetData.email}</p>
                  
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>6-Digit OTP</label>
                    <input type="text" required maxLength="6" style={{...s.inputPlain, letterSpacing: '5px', fontSize: '1.2rem', textAlign: 'center'}} placeholder="000000" value={resetData.otp} onChange={e => setResetData({...resetData, otp: e.target.value})} />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>New Password</label>
                    <input type="password" required minLength="6" style={s.inputPlain} value={resetData.newPassword} onChange={e => setResetData({...resetData, newPassword: e.target.value})} />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Confirm New Password</label>
                    <input type="password" required minLength="6" style={s.inputPlain} value={resetData.confirmPassword} onChange={e => setResetData({...resetData, confirmPassword: e.target.value})} />
                  </div>
                  <button type="submit" disabled={loading} style={styles.submitBtn}>
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

// --- STYLES ---
const styles = {
  pageWrapper: { height: '100vh', width: '100%', display: 'flex', background: '#f0f2f5', fontFamily: 'Inter, sans-serif' },
  visualsSide: { flex: 1.2, position: 'relative', overflow: 'hidden', display: window.innerWidth < 768 ? 'none' : 'block' },
  bgImg: { width: '100%', height: '100%', objectFit: 'cover' },
  overlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(15,36,53,0.9), rgba(15,36,53,0.3))' },
  visualContent: { position: 'absolute', bottom: '10%', left: '10%', color: 'white', maxWidth: '450px', zIndex: 2 },
  visualH1: { fontSize: '3.5rem', marginBottom: '15px', lineHeight: 1.1 },
  visualP: { opacity: 0.9, lineHeight: 1.8, fontSize: '1.1rem' },
  formSide: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px', background: '#ffffff', overflowY: 'auto' },
  formCard: { width: '100%', maxWidth: '420px', padding: '20px 0' },
  backLink: { display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#64748b', textDecoration: 'none', marginBottom: '30px', fontWeight: '600' },
  h2: { fontSize: '2.2rem', color: '#0F2435', margin: '0' },
  subText: { color: '#64748b', fontSize: '0.95rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  label: { display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155', fontSize: '0.9rem' },
  forgot: { color: '#C5A059', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer' },
  submitBtn: { padding: '14px', background: '#0F2435', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center' },
  dividerWrap: { display: 'flex', alignItems: 'center', margin: '30px 0', color: '#94a3b8' },
  line: { flex: 1, height: '1px', background: '#e2e8f0' },
  dividerText: { padding: '0 15px', fontSize: '0.85rem', textTransform: 'uppercase' },
  socialRow: { display: 'flex', gap: '15px', justifyContent: 'center' },
  socialBtn: { width: '50px', height: '50px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  footerText: { textAlign: 'center', marginTop: '30px', color: '#64748b' },
  footerLink: { color: '#0F2435', fontWeight: 'bold', textDecoration: 'none' },

  // Modal Styles
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(15, 36, 53, 0.8)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' },
  modalContent: { background: 'white', width: '100%', maxWidth: '450px', borderRadius: '20px', padding: '30px', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  modalTitle: { margin: 0, fontSize: '1.5rem', fontFamily: 'serif', color: '#0F2435' },
  closeBtn: { background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }
};

const s = {
  inputIconWrap: { position: 'relative' },
  icon: { position: 'absolute', top: '14px', left: '15px', color: '#94a3b8' },
  input: { width: '100%', padding: '12px 12px 12px 45px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc' },
  inputPlain: { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc' }
};

export default Login;