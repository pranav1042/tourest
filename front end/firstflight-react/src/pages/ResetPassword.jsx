import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const ResetPassword = () => {
  const { token } = useParams(); // Gets the token from the URL
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return Swal.fire({ icon: 'error', title: 'Error', text: 'Passwords do not match!' });
    }

    setLoading(true);
    try {
      const response = await axios.put(`https://tourest-cidj.vercel.app/api/auth/reset-password/${token}`, { password });
      
      Swal.fire({ icon: 'success', title: 'Success!', text: response.data.msg, confirmButtonColor: '#C5A059' });
      navigate('/login'); // Send them to login with their new password
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Link Expired', text: error.response?.data?.msg || 'This link is invalid or has expired.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f8fafc' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ fontFamily: 'serif', color: '#0F2435', marginBottom: '10px' }}>Reset Password</h2>
        <p style={{ color: '#64748b', marginBottom: '20px' }}>Enter your new password below.</p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', color: '#334155', marginBottom: '5px' }}>New Password</label>
            <input type="password" required minLength="6" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', color: '#334155', marginBottom: '5px' }}>Confirm Password</label>
            <input type="password" required minLength="6" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
          </div>
          <button type="submit" disabled={loading} style={{ padding: '15px', background: '#0F2435', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;