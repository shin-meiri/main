import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Login from './admin/Login';
import Header from './paged/Header';
import Footer from './paged/Footer';
import Pages from './paged/Pages';

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
        <Route path="/" element={<Pages />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </HashRouter>
  );
};

export default App;