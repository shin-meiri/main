import React, { useState, useEffect } from 'react';
import AdminLogin from './Admin/AdminLogin';
import Dashboard from './Admin/Dashboard';
import SettingsForm from './Admin/SettingsForm'; // Akan kita buat di bawah

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');

  useEffect(() => {
    const loggedIn = localStorage.getItem('adminLoggedIn');
    if (loggedIn === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    setIsLoggedIn(false);
    setActivePage('dashboard');
  };

  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <Dashboard onLogout={handleLogout}>
      {activePage === 'dashboard' && (
        <div>
          <h1>Dashboard</h1>
          <p>Selamat datang di panel admin. Pilih menu untuk mengatur situs.</p>
        </div>
      )}
      {activePage === 'settings' && <SettingsForm />}
    </Dashboard>
  );
};

export default Admin;