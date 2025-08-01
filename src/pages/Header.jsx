import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Header = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    axios.get('/api/theme.php')
      .then(res => setData(res.data))
      .catch(() => setData({}));
  }, []);

  const style = data.header || {};
  const logo = data.home?.logo || '';
  const menu = data.menu || [];

  return (
    <header style={style}>
      {logo && (
        <img 
          src={logo} 
          alt="Logo" 
          style={{ height: '40px', display: 'block', margin: '0 auto 10px' }} 
        />
      )}
      <nav>
        <ul style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '30px', 
          listStyle: 'none', 
          padding: '10px', 
          margin: '0' 
        }}>
          {menu.map((item, i) => (
            <li key={i}>
              <a href={item.url} style={{ color: 'inherit', textDecoration: 'none' }}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;