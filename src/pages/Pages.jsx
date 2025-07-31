import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';  // ← BARIS INI YANG KAMU LUPA!

const Pages = () => {
  const [style, setStyle] = useState({});

  useEffect(() => {
    axios.get('/api/get-css.php')
      .then(res => setStyle(res.data.body || {}))
      .catch(err => console.error('Gagal ambil CSS untuk Halaman:', err));
  }, []);

  return (
    <Routes>
      <Route path="/" element={
        <div style={style}>
          <h1>Selamat Datang</h1>
          <p>Ini adalah halaman utama dengan style dari database.</p>
        </div>
      } />
      <Route path="/about" element={
        <div style={style}>
          <h1>Tentang Kami</h1>
          <p>Halaman dengan gaya dinamis.</p>
        </div>
      } />
    </Routes>
  );
};

export default Pages;