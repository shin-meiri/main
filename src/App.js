import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Login from './admin/Login';
import Dashboard from './pages/Dashboard'; // ← Ini yang harus kamu buat dulu

const App = () => {
  // Cek login saat aplikasi jalan
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user && window.location.hash !== '#/login') {
      window.location.href = '#/login';
    }
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </HashRouter>
  );
};

export default App;