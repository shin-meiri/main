import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QrScanner from './QrScanner';

const Login = () => {
  const [input, setInput] = useState({ username: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [method, setMethod] = useState('form');
  const [theme, setTheme] = useState({});

  // 🔒 Cek login saat komponen muncul
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      window.location.href = '#/';
    }
  }, []);

  useEffect(() => {
    axios.get('/api/theme.php')
      .then(res => setTheme(res.data))
      .catch(() => setTheme({}));
  }, []);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const login = async (username, password) => {
    setError('');
    try {
      const res = await axios.post('/api/login.php', { username, password });
      if (res.data.success) {
        localStorage.setItem('user', res.data.username);
        window.location.href = '#/';
      } else {
        setError(res.data.message);
      }
    } catch {
      setError('Gagal koneksi');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(input.username, input.password);
  };

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    login(input.phone, input.password);
  };

  const formStyle = theme.login?.form || {};
  const titleStyle = theme.login?.title || {};
  const tabContainerStyle = theme.login?.tabContainer || {};
  const tabStyle = (active) => ({
    ...(active ? theme.login?.tabActive : theme.login?.tabInactive),
    cursor: 'pointer'
  });
  const inputStyle = theme.login?.input || {};
  const buttonStyle = theme.login?.button || {};
  const errorStyle = theme.login?.error || {};
  const qrContainerStyle = theme.login?.qrContainer || {};

  return (
    <div style={formStyle}>
      <h2 style={titleStyle}>🔐 Login</h2>
      {error && <p style={errorStyle}>{error}</p>}

      <div style={tabContainerStyle}>
        <button onClick={() => setMethod('form')} style={tabStyle(method === 'form')}>Form</button>
        <button onClick={() => setMethod('qrcode')} style={tabStyle(method === 'qrcode')}>QR Code</button>
        <button onClick={() => setMethod('phone')} style={tabStyle(method === 'phone')}>No HP</button>
      </div>

      {method === 'form' && (
        <form onSubmit={handleSubmit}>
          <input name="username" placeholder="Username" value={input.username} onChange={handleChange} required style={inputStyle} />
          <input name="password" type="password" placeholder="Password" value={input.password} onChange={handleChange} required style={inputStyle} />
          <button type="submit" style={buttonStyle}>Login</button>
        </form>
      )}

      {method === 'qrcode' && (
        <div style={qrContainerStyle}>
          <QrScanner onScan={login} />
        </div>
      )}

      {method === 'phone' && (
        <form onSubmit={handlePhoneSubmit}>
          <input name="phone" placeholder="Nomor HP" value={input.phone} onChange={handleChange} required style={inputStyle} />
          <input name="password" type="password" placeholder="Password" value={input.password} onChange={handleChange} required style={inputStyle} />
          <button type="submit" style={buttonStyle}>Login</button>
        </form>
      )}
    </div>
  );
};

export default Login;