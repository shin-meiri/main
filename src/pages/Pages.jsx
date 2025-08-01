import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Pages = () => {
  const [data, setData] = useState({});
  const [bodyStyle, setBodyStyle] = useState({});

  useEffect(() => {
    axios.get('/api/theme.php')
      .then(res => {
        setData(res.data);
        setBodyStyle(res.data.body || {});
      })
      .catch(() => setBodyStyle({}));
  }, []);

  const hero = data.home?.heroImage;
  const title = data.home?.title;
  const subtitle = data.home?.subtitle;
  const button = data.home?.button;

  return (
    <div style={bodyStyle}>
      {hero && (
        <div style={{
          backgroundImage: `url(${hero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          textShadow: '2px 2px 8px rgba(0,0,0,0.7)'
        }}>
          <div>
            <h1 style={{ fontSize: '3em', margin: '0' }}>{title}</h1>
            <p style={{ fontSize: '1.2em' }}>{subtitle}</p>
          </div>
        </div>
      )}
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <button style={{
          background: 'var(--button-bg, #007BFF)',
          border: 'none',
          padding: '12px 30px',
          fontSize: '18px',
          borderRadius: '8px',
          color: 'white'
        }}>
          {button}
        </button>
      </div>
    </div>
  );
};

export default Pages;