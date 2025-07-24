import React, { useState, useEffect } from 'react';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [settings, setSettings] = useState({
    siteTitle: 'My Professional Site',
    bgColor: '#f8f9fa',
    textColor: '#212529',
    favicon: '/favicon.ico'
  });

  // Cek login status dari localStorage
  useEffect(() => {
    const loggedIn = localStorage.getItem('adminLoggedIn');
    if (loggedIn === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  // Load settings dari localStorage atau default
  useEffect(() => {
    const saved = localStorage.getItem('siteSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    } else {
      fetch('/settings.json')
        .then(res => res.json())
        .then(data => setSettings(data));
    }
  }, []);

  // Terapkan setting ke halaman
  useEffect(() => {
    if (isLoggedIn) {
      document.body.style.backgroundColor = settings.bgColor;
      document.body.style.color = settings.textColor;
      document.title = settings.siteTitle;

      const link = document.querySelector("link[rel='icon']");
      if (link) link.href = settings.favicon;
    }
  }, [settings, isLoggedIn]);

  // Login Handler
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
      .catch(() => setError('Gagal memuat data pengguna.'));
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  // Simpan setting
  const saveSettings = () => {
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    alert('Setting berhasil disimpan!');
  };

  if (!isLoggedIn) {
    return (
      <div style={loginContainer}>
        <h2>Admin Login</h2>
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

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Panel</h2>
      <button onClick={handleLogout} style={{...btnStyle, backgroundColor: '#e74c3c', marginBottom: '20px' }}>
        Logout
      </button>

      <form>
        <label>Site Title:<br/>
          <input type="text" name="siteTitle" value={settings.siteTitle} onChange={(e) => setSettings({...settings, siteTitle: e.target.value})} style={inputStyle} />
        </label><br/><br/>

        <label>Background Color:<br/>
          <input type="color" name="bgColor" value={settings.bgColor} onChange={(e) => setSettings({...settings, bgColor: e.target.value})} />
        </label><br/><br/>

        <label>Text Color:<br/>
          <input type="color" name="textColor" value={settings.textColor} onChange={(e) => setSettings({...settings, textColor: e.target.value})} />
        </label><br/><br/>

        <label>Favicon URL:<br/>
          <input type="text" name="favicon" value={settings.favicon} onChange={(e) => setSettings({...settings, favicon: e.target.value})} style={inputStyle} />
        </label><br/><br/>

        <button type="button" onClick={saveSettings} style={btnStyle}>
          Save Settings
        </button>
      </form>

      <p style={{ marginTop: '20px' }}>
        <small>Setting disimpan di browser. Hanya kamu yang melihat perubahan.</small>
      </p>
    </div>
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
const btnStyle = { backgroundColor: '#2c3e50', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer' };

export default Admin;