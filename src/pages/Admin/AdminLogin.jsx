import React, { useState } from 'react';

const AdminLogin = ({ onLogin }) => {
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
          onLogin(); // Pindah ke dashboard
        } else {
          setError('Username atau password salah!');
        }
      })
      .catch(() => setError('Gagal memuat users.json'));
  };

  return (
    <div style={loginStyles.container}>
      <div style={loginStyles.card}>
        <h2>🔐 Admin Login</h2>
        {error && <p style={loginStyles.error}>{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={loginStyles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={loginStyles.input}
          />
          <button type="submit" style={loginStyles.button}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

// CSS-in-JS Styles
const loginStyles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    backgroundColor: '#f5f5f5',
    padding: '20px',
  },
  card: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  input: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#2c3e50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  error: {
    color: '#e74c3c',
    fontSize: '14px',
    marginBottom: '10px',
  },
};

export default AdminLogin;