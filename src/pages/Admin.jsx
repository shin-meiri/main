import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import Settings from './admin/Settings';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loggedIn = localStorage.getItem('adminLoggedIn');
    if (loggedIn === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    fetch('/users.json')
      .then(res => res.json())
      .then(data => {
        if (username === data.username && password === data.password) {
          localStorage.setItem('adminLoggedIn', 'true');
          setIsLoggedIn(true);
          setError('');
        } else {
          setError('Username atau password salah!');
        }
      })
      .catch(() => setError('Gagal memuat users.json'));
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  if (!isLoggedIn) {
    return (
      <div style={loginContainer}>
        <h2>🔐 Admin Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleLogin} style={formStyle}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
          <button type="submit" style={btnStyle}>Login</button>
        </form>
      </div>
    );
  }

  // Jika sudah login, tampilkan AdminLayout + Routes
  return (
    <Routes>
      <Route element={<AdminLayout onLogout={handleLogout} />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      {/* Redirect default */}
      <Route path="*" element={<Navigate to="dashboard" />} />
    </Routes>
  );
};

// Styles
const loginContainer = {
  maxWidth: '400px',
  margin: '50px auto',
  padding: '20px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  backgroundColor: '#f9f9f9'
};

const formStyle = { display: 'flex', flexDirection: 'column' };
const inputStyle = { padding: '10px', margin: '10px 0', fontSize: '16px' };
const btnStyle = {
  backgroundColor: '#2c3e50',
  color: 'white',
  padding: '12px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginTop: '10px'
};

export default Admin;