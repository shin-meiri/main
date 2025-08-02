import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Pages = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    axios.get('/api/theme.php')
      .then(res => setData(res.data))
      .catch(() => setData({}));
  }, []);

  const cardStyle = data.pages?.card || {};
  const titleStyle = data.pages?.title || {};
  const buttonStyle = data.pages?.button || {};

  return (
    <div style={data.body || {}}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Selamat Datang di Aplikasi Kasir</h1>
        <p>Ini adalah halaman utama yang hanya bisa diakses setelah login.</p>
        <button style={buttonStyle}>Mulai</button>
      </div>
    </div>
  );
};

export default Pages;