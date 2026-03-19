import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaFacebookF, FaApple, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phone: 'Not Provided' // Added to match your backend model
    });

    // Handle Input Changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Adjust URL to match your server port (5000)
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);

            Swal.fire({
                icon: 'success',
                title: 'Account Created!',
                text: 'Your journey begins now. Please log in.',
                confirmButtonColor: '#0F2435',
                background: '#ffffff',
            });

            navigate('/login');
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: err.response?.data?.msg || 'Something went wrong. Try again.',
                confirmButtonColor: '#0F2435',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ height: '100vh', width: '100%', display: 'flex', background: '#f0f2f5' }}>
            
            {/* LEFT SIDE: VISUALS */}
            <div className="auth-visuals" style={{ flex: 1.2, position: 'relative', overflow: 'hidden' }}>
                <img 
                    src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop" 
                    alt="Adventure Travel" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to right, rgba(15,36,53,0.9), rgba(15,36,53,0.2))' }}></div>
                
                <div style={{ position: 'absolute', bottom: '10%', left: '10%', color: 'white', maxWidth: '450px', zIndex: 2 }}>
                    <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3.5rem', marginBottom: '15px', lineHeight: 1.1 }}>
                        Start Your <br/> Journey.
                    </h1>
                    <p style={{ opacity: 0.9, lineHeight: 1.8, fontSize: '1.1rem', fontWeight: '300' }}>
                        Join our exclusive community of travelers. Unlock VIP deals, curated itineraries, and seamless booking experiences.
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE: FORM */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px', background: '#ffffff' }}>
                <motion.div 
                    initial={{ opacity: 0, y: 30 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.6 }}
                    style={{ width: '100%', maxWidth: '420px', padding: '40px', borderRadius: '20px', background: 'white', boxShadow: '0 20px 60px rgba(0,0,0,0.05)' }}
                >
                    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#64748b', textDecoration: 'none', marginBottom: '30px', fontWeight: '600', fontSize: '0.9rem' }}>
                        <FaArrowLeft /> Back to Home
                    </Link>

                    <div style={{ marginBottom: '30px' }}>
                        <h2 style={{ fontSize: '2.2rem', fontFamily: 'Playfair Display, serif', color: '#0F2435', margin: '0 0 10px 0' }}>Create Account</h2>
                        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>It's free and only takes a minute.</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Full Name */}
                        <div>
                            <label style={labelStyle}>Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <FaUser style={iconStyle} />
                                <input 
                                    required
                                    name="fullName"
                                    type="text" 
                                    placeholder="John Doe" 
                                    style={inputStyle} 
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label style={labelStyle}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <FaEnvelope style={iconStyle} />
                                <input 
                                    required
                                    name="email"
                                    type="email" 
                                    placeholder="name@company.com" 
                                    style={inputStyle} 
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label style={labelStyle}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <FaLock style={iconStyle} />
                                <input 
                                    required
                                    name="password"
                                    type="password" 
                                    placeholder="Create a strong password" 
                                    style={inputStyle} 
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <motion.button 
                            disabled={loading}
                            whileHover={{ scale: 1.02, backgroundColor: '#163a54' }}
                            whileTap={{ scale: 0.98 }}
                            style={{ ...buttonStyle, opacity: loading ? 0.7 : 1 }}
                        >
                            {loading ? <FaSpinner className="spin" /> : 'Create Account'}
                        </motion.button>
                    </form>

                    <div style={dividerStyle}>
                        <div style={lineStyle}></div>
                        <span style={{ padding: '0 15px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Or sign up with</span>
                        <div style={lineStyle}></div>
                    </div>

                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                        <button className="social-btn"><FaGoogle color="#DB4437" /></button>
                        <button className="social-btn"><FaFacebookF color="#4267B2" /></button>
                        <button className="social-btn"><FaApple color="black" /></button>
                    </div>

                    <p style={{ textAlign: 'center', marginTop: '30px', color: '#64748b', fontSize: '0.95rem' }}>
                        Already a member? <Link to="/login" style={{ color: '#0F2435', fontWeight: 'bold', textDecoration: 'none' }}>Log In</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

// Reusable Styles
const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155', fontSize: '0.9rem' };
const iconStyle = { position: 'absolute', top: '14px', left: '15px', color: '#94a3b8' };
const inputStyle = { width: '100%', padding: '12px 12px 12px 45px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '1rem', background: '#f8fafc', color: '#1e293b', transition: 'border 0.3s' };
const buttonStyle = { padding: '14px', background: '#0F2435', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', marginTop: '10px', boxShadow: '0 4px 12px rgba(15, 36, 53, 0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center' };
const dividerStyle = { display: 'flex', alignItems: 'center', margin: '30px 0', color: '#94a3b8' };
const lineStyle = { flex: 1, height: '1px', background: '#e2e8f0' };

export default Register;