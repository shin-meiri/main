import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Header = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    axios.get('/api/get-css.php')
      .then(res => setData(res.data))
      .catch(() => setData({}));
  }, []);

  const style = data.header || {};
  const menuStyle = data.menu_style || {};
  const hover = data.menu_hover || {};

  return (
    <header style={style}>
      <nav>
        <ul style={{ display: 'flex', listStyle: 'none', gap: menuStyle.gap || '20px', padding: '10px' }}>
          {data.menu?.map((item, i) => (
            <li key={i}>
              <a
                href={item.url}
                style={{ color: 'inherit', textDecoration: 'none' }}
                onMouseEnter={e => Object.assign(e.target.style, hover)}
                onMouseLeave={e => Object.assign(e.target.style, { color: 'inherit' })}
              >
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