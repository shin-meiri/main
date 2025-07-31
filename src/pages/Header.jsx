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
        setMenu([{ label: 'Home', url: '/' }]);
        setStyle({ backgroundColor: '#000', color: '#fff', padding: '10px' });
      });
  }, []);

  return (
    <header style={style}>
      <nav>
        <ul style={{ display: 'flex', listStyle: 'none', gap: '20px', padding: '10px' }}>
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