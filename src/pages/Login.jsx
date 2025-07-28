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
        navigate('/');
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
      color: 'pink', 
      backgroundColor: 'black', 
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '400px', 
        width: '100%',
        padding: '30px',
        border: '1px solid pink',
        borderRadius: '8px',
        backgroundColor: '#111'
      }}>
        <div style={{ 
          textAlign: 'center', 
          fontSize: '2rem', 
          marginBottom: '30px'
        }}>
          Login
        </div>
        
        {error && (
          <div style={{
            backgroundColor: '#ff6b6b',
            color: 'white',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Username:</label>
            <input
              type="text"
              name="username"
              value={loginData.username}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#333',
                color: 'pink',
                border: '1px solid #555',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              placeholder="Masukkan username"
              disabled={loading}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Password:</label>
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#333',
                color: 'pink',
                border: '1px solid #555',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              placeholder="Masukkan password"
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '14px',
              backgroundColor: loading ? '#555' : 'pink',
              color: loading ? '#888' : 'black',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '20px', 
          fontSize: '14px',
          color: '#aaa'
        }}>
          <p>Demo login - Gunakan username dan password yang sudah ada</p>
        </div>
      </div>
    </div>
  );
};

export default Login;