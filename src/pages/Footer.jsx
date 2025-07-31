import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Footer = () => {
  const [style, setStyle] = useState({});

  useEffect(() => {
    axios.get('/api/get-css.php')
      .then(res => setStyle(res.data.footer || {}))
      .catch(() => setStyle({}));
  }, []);

  return (
    <footer style={style}>
      &copy; 2025 Aplikasi Dinamis
    </footer>
  );
};

export default Footer;