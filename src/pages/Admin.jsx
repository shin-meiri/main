import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Admin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    fetch('/users.json')
      .then(res => res.json())
      .then(data => {
        if (username === data.username && password === data.password) {
          localStorage.setItem('adminLoggedIn', 'true');
          window.location.href = '/admin/dashboard'; // Redirect ke dashboard
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
      <p style={{ marginTop: '20px' }}>
        <Link to="/" style={{ color: '#3498db' }}>← Kembali ke situs</Link>
      </p>
    </div>
  );
};

// Styling
const loginContainer = {
  maxWidth: '400px',
  margin: '100px auto',
  padding: '30px',
  border: '1px solid #ddd',
  borderRadius: '10px',
  backgroundColor: '#f9f9f9',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
};

const formStyle = { display: 'flex', flexDirection: 'column' };
const inputStyle = { padding: '12px', margin: '10px 0', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' };
const btnStyle = { backgroundColor: '#2c3e50', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' };

export default Admin;