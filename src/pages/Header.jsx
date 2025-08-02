import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Header = () => {
  const [data, setData] = useState({});
  const [user, setUser] = useState('');

  useEffect(() => {
    axios.get('/api/theme.php')
      .then(res => setData(res.data))
      .catch(() => setData({}));

    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(savedUser);
  }, []);

  const headerStyle = data.header || {};
  const menuStyle = data.menuStyle || {};
  const menuItemStyle = data.menuItemStyle || {};
  const menuHover = data.menuHover || {};
  const profileStyle = data.profileContainer || {};
  const profileTextStyle = data.profileText || {};
  const logoutButtonStyle = data.logoutButton || {};

  const handleLogout = () => {
    if (window.confirm('Yakin ingin keluar?')) {
      localStorage.removeItem('user');
      window.location.replace('#/login');
    }
  };

  return (
    <header style={headerStyle}>
      {user && (
        <div style={profileStyle}>
          <span style={profileTextStyle}>🧑‍💼 {user}</span>
          <button onClick={handleLogout} style={logoutButtonStyle}>
            Logout
          </button>
        </div>
      )}

      <nav>
        <ul style={menuStyle}>
          {data.menu?.map((item, i) => (
            <li key={i}>
              <a
                href={item.url}
                style={menuItemStyle}
                onMouseEnter={e => Object.assign(e.target.style, menuHover)}
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