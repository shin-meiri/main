// src/pages/Admin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    fetch('/users.json')
      .then(res => res.json())
      .then(data => {
        if (username === data.username && password === data.password) {
          localStorage.setItem('adminLoggedIn', 'true');
          navigate('/admin/dashboard/settings'); // Redirect ke dashboard
        } else {
          setError('Username atau password salah!');
        }
      })
      .catch(() => setError('Gagal memuat data pengguna.'));
  };

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
};

// Styles (sama seperti sebelumnya)
const loginContainer = { maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' };
const formStyle = { display: 'flex', flexDirection: 'column' };
const inputStyle = { padding: '10px', margin: '10px 0', fontSize: '16px' };
const btnStyle = { backgroundColor: '#2c3e50', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer' };

export default Admin;