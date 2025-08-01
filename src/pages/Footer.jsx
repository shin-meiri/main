import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Footer = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    axios.get('/api/theme.php')
      .then(res => setData(res.data))
      .catch(() => setData({}));
  }, []);

  return (
    <footer style={data.footer || {}}>
      {data.footer?.content || '© 2025 Aplikasi Dinamis'}
    </footer>
  );
};

export default Footer;