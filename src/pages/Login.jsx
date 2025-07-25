// pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'amy' && password === 'amymeiri') {
      // Simpan status login (bisa pakai localStorage atau context)
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/admin');
    } else {
      setError('Username atau password salah!');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          width: '320px',
          textAlign: 'center',
        }}
      >
        <h2 style={{ marginBottom: '20px', color: '#333' }}>Login Admin</h2>
        {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '15px', textAlign: 'left' }}>
            <label htmlFor="username" style={{ display: 'block', marginBottom: '6px', color: '#555' }}>
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '6px', color: '#555' }}>
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#1890ff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;