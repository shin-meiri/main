import React from 'react';

const Header = () => {
  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        {/* Logo di kiri */}
        <div style={logoStyle}>
          <h1>Logo</h1>
        </div>

        {/* Menu di kanan */}
        <nav style={navStyle}>
          <ul style={navListStyle}>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

// Styling
const headerStyle = {
  backgroundColor: '#333',
  color: '#fff',
  padding: '1rem 0',
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 1rem',
};

const logoStyle = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
};

const navStyle = {};

const navListStyle = {
  display: 'flex',
  gap: '2rem',
  listStyle: 'none',
  margin: 0,
  padding: 0,
};

const navLinkStyle = {
  color: '#fff',
  textDecoration: 'none',
};

// Tambahkan style inline pada <a> jika perlu
// Kita bisa modifikasi JSX jika ingin lebih fleksibel

export default Header;