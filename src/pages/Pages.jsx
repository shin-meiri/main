import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Login from '../admin/Login';  // ← Harus ada

const Pages = () => {
  const [style, setStyle] = useState({});

  useEffect(() => {
    axios.get('/api/get-css.php')
      .then(res => setStyle(res.data.body || {}))
      .catch(() => setStyle({}));
  }, []);

  return (
    <Routes>
      <Route path="/" element={<div style={style}>Halaman Utama</div>} />
      <Route path="/about" element={<div style={style}>Tentang Kami</div>} />
      <Route path="/login" element={<div style={style}>Form Login</div>} />
    </Routes>
  );
};

export default Pages;