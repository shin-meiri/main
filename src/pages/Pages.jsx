import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Pages = () => {
  const [style, setStyle] = useState({});

  useEffect(() => {
    axios.get('/api/get-css.php')
      .then(res => setStyle(res.data.body || {}))
      .catch(() => setStyle({}));
  }, []);

  return (
    <div style={style}>
      <h1>Halaman Utama</h1>
      <p>Selamat datang di aplikasi dinamis.</p>
      <p><a href="#/login">Masuk di sini</a></p>
    </div>
  );
};

export default Pages;