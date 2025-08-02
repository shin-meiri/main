import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QrScanner from './QrScanner';

const Login = () => {
  const [input, setInput] = useState({ username: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [method, setMethod] = useState('form');
  const [theme, setTheme] = useState({});

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      window.location.replace('#/');
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
        window.location.replace('#/');
      } else {
        setError(res.data.message);
      }
    } catch {
      setError('Gagal koneksi ke server');
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

  return (
    <div style={theme.login?.form || {}}>
      <h2 style={theme.login?.title || {}}>🔐 Login</h2>
      {error && <p style={theme.login?.error || {}}>{error}</p>}

      <div style={theme.login?.tabContainer || {}}>
        <button onClick={() => setMethod('form')} style={method === 'form' ? theme.login?.tabActive : theme.login?.tabInactive}>Form</button>
        <button onClick={() => setMethod('qrcode')} style={method === 'qrcode' ? theme.login?.tabActive : theme.login?.tabInactive}>QR Code</button>
        <button onClick={() => setMethod('phone')} style={method === 'phone' ? theme.login?.tabActive : theme.login?.tabInactive}>No HP</button>
      </div>

      {method === 'form' && (
        <form onSubmit={handleSubmit}>
          <input name="username" placeholder="Username" value={input.username} onChange={handleChange} required style={theme.login?.input || {}} />
          <input name="password" type="password" placeholder="Password" value={input.password} onChange={handleChange} required style={theme.login?.input || {}} />
          <button type="submit" style={theme.login?.button || {}}>Login</button>
        </form>
      )}

      {method === 'qrcode' && (
        <div style={theme.login?.qrContainer || {}}>
          <QrScanner onScan={login} />
        </div>
      )}

      {method === 'phone' && (
        <form onSubmit={handlePhoneSubmit}>
          <input name="phone" placeholder="Nomor HP" value={input.phone} onChange={handleChange} required style={theme.login?.input || {}} />
          <input name="password" type="password" placeholder="Password" value={input.password} onChange={handleChange} required style={theme.login?.input || {}} />
          <button type="submit" style={theme.login?.button || {}}>Login</button>
        </form>
      )}
    </div>
  );
};

export default Login;