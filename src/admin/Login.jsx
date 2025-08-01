import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Login = () => {
  const [input, setInput] = useState({ username: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [method, setMethod] = useState('form'); // 'form', 'qrcode', 'phone'
  const [scanning, setScanning] = useState(false);
  const [theme, setTheme] = useState({});

  // Ambil tema dari MySQL
  useEffect(() => {
    axios.get('/api/theme.php')
      .then(res => setTheme(res.data))
      .catch(() => setTheme({}));
  }, []);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // Fungsi login
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
      setError('Gagal koneksi ke server');
    }
  };

  // Submit form username/password
  const handleSubmit = (e) => {
    e.preventDefault();
    login(input.username, input.password);
  };

  // Submit form phone/password
  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    login(input.phone, input.password);
  };

  // Simulasi scan QR Code
  const simulateQRScan = () => {
    setScanning(true);
    // Simulasi data QR: { "username": "admin", "password": "12345" }
    setTimeout(() => {
      const qrData = { username: 'admin', password: '12345' };
      setInput({ ...input, username: qrData.username, password: qrData.password });
      setScanning(false);
      // Langsung login, tanpa klik tombol
      login(qrData.username, qrData.password);
    }, 1500);
  };

  // Auto-login jika username & password sudah terisi (dari QR)
  useEffect(() => {
    if (input.username && input.password && !localStorage.getItem('user')) {
      const timer = setTimeout(() => {
        login(input.username, input.password);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [input.username, input.password]);

  // Style dari tema
  const formStyle = theme.login?.form || {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '30px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
  };

  const buttonStyle = theme.login?.button || {
    background: 'linear-gradient(45deg, #3498db, #8e44ad)',
    color: 'white',
    border: 'none',
    padding: '12px',
    width: '100%',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    border: `1px solid ${theme.login?.inputBorder || '#ddd'}`,
    borderRadius: '8px',
    fontSize: '16px'
  };

  const tabStyle = (active) => ({
    padding: '10px 15px',
    background: active ? '#007BFF' : '#eee',
    color: active ? 'white' : '#333',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  });

  const scannerButtonStyle = theme.qrScanner?.scannerButton || {
    ...buttonStyle,
    background: '#28a745',
    marginTop: '20px'
  };

  const scanningMessageStyle = theme.qrScanner?.scanningMessage || {
    color: '#007BFF',
    textAlign: 'center',
    marginTop: '10px'
  };

  return (
    <div style={formStyle}>
      <h2 style={{ textAlign: 'center' }}>🔐 Login Aplikasi Kasir</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Pilih Metode */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '20px 0' }}>
        <button onClick={() => setMethod('form')} style={tabStyle(method === 'form')}>Username</button>
        <button onClick={() => setMethod('qrcode')} style={tabStyle(method === 'qrcode')}>QR Code</button>
        <button onClick={() => setMethod('phone')} style={tabStyle(method === 'phone')}>Nomor HP</button>
      </div>

      {/* Form Username/Password */}
      {method === 'form' && (
        <form onSubmit={handleSubmit}>
          <input name="username" placeholder="Username" value={input.username} onChange={handleChange} required style={inputStyle} />
          <input name="password" type="password" placeholder="Password" value={input.password} onChange={handleChange} required style={inputStyle} />
          <button type="submit" style={buttonStyle}>Login</button>
        </form>
      )}

      {/* QR Code Scanner */}
      {method === 'qrcode' && (
        <div>
          <p>Scan QR Code untuk login otomatis:</p>
          <button onClick={simulateQRScan} disabled={scanning} style={scannerButtonStyle}>
            {scanning ? 'Memindai...' : 'Mulai Scan'}
          </button>
          {scanning && <p style={scanningMessageStyle}>Tunggu, sedang memindai...</p>}
        </div>
      )}

      {/* Form Phone/Password */}
      {method === 'phone' && (
        <form onSubmit={handlePhoneSubmit}>
          <input name="phone" placeholder="Nomor HP" value={input.phone} onChange={handleChange} required style={inputStyle} />
          <input name="password" type="password" placeholder="Password" value={input.password} onChange={handleChange} required style={inputStyle} />
          <button type="submit" style={buttonStyle}>Login</button>
        </form>
      )}

      <p style={{ marginTop: '30px', fontSize: '14px', color: '#666', textAlign: 'center' }}>
        © 2025 Aplikasi Kasir
      </p>
    </div>
  );
};

export default Login;
