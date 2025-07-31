import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Footer = () => {
  const [style, setStyle] = useState({});

  useEffect(() => {
    axios.get('/api/get-css.php')
      .then(res => setStyle(res.data.footer || {}))
      .catch(err => console.error('Gagal ambil CSS untuk Footer:', err));
  }, []);

  return (
    <footer style={style}>
      &copy; {new Date().getFullYear()} Aplikasi Dinamis. Semua gaya dari MySQL.
    </footer>
  );
};

export default Footer;