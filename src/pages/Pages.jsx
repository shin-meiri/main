import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Login from '../admin/Login';  // ← di-import dan DIPAKAI

const Pages = () => {
  const [style, setStyle] = useState({});

  useEffect(() => {
    axios.get('/api/get-css.php')
      .then(res => setStyle(res.data.body || {}))
      .catch(() => setStyle({}));
  }, []);

  return (
    <Routes>
      <Route path="/" element={<div style={style}>Home</div>} />
      <Route path="/login" element={<Login />} />  {/* ← DIGUNAKAN DI SINI */}
    </Routes>
  );
};

export default Pages;
