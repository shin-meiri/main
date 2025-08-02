import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Login from './admin/Login';
import Pages from './pages/Pages';

const App = () => {
  const [user, setUser] = useState('');

  useEffect(() => {
    const checkLogin = () => {
      const savedUser = localStorage.getItem('user');
      const hash = window.location.hash;

      if (savedUser) {
        setUser(savedUser);
        if (hash === '' || hash === '#/login') {
          window.location.replace('#/');
        }
      } else {
        setUser('');
        if (hash !== '#/login') {
          window.location.replace('#/login');
        }
      }
    };

    // Jalankan saat pertama kali
    checkLogin();

    // Dengarkan perubahan hash
    window.addEventListener('hashchange', checkLogin);
    return () => window.removeEventListener('hashchange', checkLogin);
  }, []);

  return (
    <HashRouter>
      {user && <Header user={user} onLogout={() => setUser('')} />}
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Pages />} />
        </Routes>
      </main>
    </HashRouter>
  );
};

// Header inline agar tidak perlu state terpisah
const Header = ({ user, onLogout }) => {
  return (
    <header style={headerStyle}>
      <div style={profileStyle}>
        🧑‍💼 <strong>{user}</strong>
        <button onClick={onLogout} style={logoutButtonStyle}>
          Logout
        </button>
      </div>
    </header>
  );
};

// Semua style dari theme.php
const headerStyle = {};
const profileStyle = {};
const logoutButtonStyle = {};

export default App;