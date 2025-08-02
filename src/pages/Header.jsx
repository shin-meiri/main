import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Header = () => {
  const [user, setUser] = useState('');
  const [theme, setTheme] = useState({});

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(savedUser);
    } else {
      setUser('');
    }

    axios.get('/api/theme.php')
      .then(res => setTheme(res.data))
      .catch(() => setTheme({}));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.replace('#/login');
  };

  // Jika belum login, jangan tampilkan header
  if (!user) return null;

  const headerStyle = theme.header?.container || {};
  const profileStyle = theme.header?.profile || {};
  const logoutButtonStyle = theme.header?.logoutButton || {};

  return (
    <header style={headerStyle}>
      <div style={profileStyle}>
        🧑‍💼 <strong>{user}</strong>
        <button onClick={handleLogout} style={logoutButtonStyle}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;