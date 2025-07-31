import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';

const Pages = () => {
  const [style, setStyle] = useState({});

  useEffect(() => {
    axios.get('/api/get-css.php')
      .then(res => setStyle(res.data.body || {}))
      .catch(() => setStyle({}));
  }, []);

  return (
    <Routes>
      <Route path="/" element={
        <div style={style}>
          <h1>Halaman Utama</h1>
          <p>Ini halaman home dengan style dari MySQL.</p>
        </div>
      } />
      <Route path="/about" element={
        <div style={style}>
          <h1>Tentang Kami</h1>
          <p>Kami adalah aplikasi dinamis.</p>
        </div>
      } />
      <Route path="/contact" element={
        <div style={style}>
          <h1>Kontak</h1>
          <p>Email: info@app.com</p>
        </div>
      } />
    </Routes>
  );
};

export default Pages;