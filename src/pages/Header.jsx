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
  const menuStyle = data.menuStyle || {};
  const hover = data.menuHover || {};

  return (
    <header style={style}>
      <nav>
        <ul style={{ ...menuStyle, margin: 0, padding: 0 }}>
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