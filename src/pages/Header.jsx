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

  const style = data.header || {};
  const menuStyle = data.menuStyle || {};
  const hover = data.menuHover || {};

  const handleLogout = () => {
    if (window.confirm('Yakin ingin keluar?')) {
      localStorage.removeItem('user');
      window.location.href = '#/login';
    }
  };

  return (
    <header style={style}>
      {/* Profil + Logout (kiri atas) */}
      {user && (
        <div style={{ 
          textAlign: 'left', 
          padding: '0 20px', 
          color: 'white', 
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          🧑‍💼 <strong>{user}</strong>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '6px',
              padding: '4px 10px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Logout
          </button>
        </div>
      )}

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