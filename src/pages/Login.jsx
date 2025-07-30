// src/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fungsi untuk handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error saat user mulai mengetik
    if (error) setError('');
  };

  // Fungsi untuk handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validasi input
    if (!loginData.username || !loginData.password) {
      setError('Username dan Password harus diisi!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Ambil data user dari API
      const response = await axios.get('/api/dat.json');
      const users = response.data.users || [];
      
      // Cari user yang cocok
      const user = users.find(u => 
        u.username === loginData.username && u.password === loginData.password
      );

      if (user) {
        // Login berhasil
        // Simpan data user di localStorage/sessionStorage (opsional)
        localStorage.setItem('currentUser', JSON.stringify(user));
        // Redirect ke halaman utama
        navigate('/admin');
      } else {
        // Login gagal
        setError('Username atau Password salah!');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat login. Silakan coba lagi.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{ 
        width: '100%',
        maxWidth: '400px',
        padding: '40px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '15px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '30px'
        }}>
          <div style={{ 
            fontSize: '2.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px'
          }}>
            🔐 Login
          </div>
          <p style={{ 
            color: '#666', 
            fontSize: '1rem' 
          }}>
            Masuk ke akun Anda
          </p>
        </div>
        
        {error && (
          <div style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #fcc',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333'
            }}>
              Username
            </label>
            <input
              type="text"
              name="username"
              value={loginData.username}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '14px',
                border: '2px solid #e1e5e9',
                borderRadius: '10px',
                fontSize: '16px',
                transition: 'border-color 0.3s ease',
                outline: 'none'
              }}
              placeholder="Masukkan username"
              disabled={loading}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
            />
          </div>
          
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333'
            }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '14px',
                border: '2px solid #e1e5e9',
                borderRadius: '10px',
                fontSize: '16px',
                transition: 'border-color 0.3s ease',
                outline: 'none'
              }}
              placeholder="Masukkan password"
              disabled={loading}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '16px',
              backgroundColor: loading ? '#ccc' : 'linear-gradient(45deg, #667eea, #764ba2)',
              color: loading ? '#888' : 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              background: loading ? '#ccc' : 'linear-gradient(45deg, #667eea, #764ba2)'
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 10px 20px rgba(102, 126, 234, 0.3)';
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            {loading ? '🔄 Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '25px', 
          fontSize: '14px',
          color: '#888'
        }}>
          <p>Demo login - Gunakan username dan password yang sudah ada</p>
        </div>
      </div>
    </div>
  );
};

export default Login;