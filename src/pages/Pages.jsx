import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Pages = () => {
  const [data, setData] = useState({});
  const [hover, setHover] = useState(false);

  useEffect(() => {
    axios.get('/api/get-css.php')
      .then(res => setData(res.data))
      .catch(() => setData({}));
  }, []);

  const style = data.body || {};
  const cardStyle = data.card_style || {};
  const btnStyle = data.button_style || {};
  const btnHover = data.button_hover || {};

  return (
    <div style={style}>
      <div
        style={cardStyle}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <h1>{data.home?.title || 'Selamat Datang'}</h1>
        <p>{data.home?.subtitle || 'Deskripsi halaman'}</p>
        <button
          style={hover ? { ...btnStyle, ...btnHover } : btnStyle}
        >
          {data.home?.button || 'Mulai'}
        </button>
      </div>
    </div>
  );
};

export default Pages;