import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Header = () => {
  const [style, setStyle] = useState({});
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    axios.get('/api/get-css.php')
      .then(res => {
        setStyle(res.data.header || {});
        setMenu(res.data.menu || []);
      })
      .catch(() => {
        setMenu([]);
        setStyle({});
      });
  }, []);

  return (
    <header style={style}>
      <nav>
        <ul style={{ display: 'flex', listStyle: 'none', padding: '10px', margin: 0, gap: '20px' }}>
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