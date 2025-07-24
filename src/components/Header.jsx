import React from 'react';

const Header = () => {
  return (
    <header style={headerStyle}>
      <div className="container">
        <h1>Logo</h1>
        <nav>
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

// Styling sederhana (bisa dipindah ke CSS nanti)
const headerStyle = {
  backgroundColor: '#333',
  color: '#fff',
  padding: '1rem 0',
};

const navListStyle = {
  display: 'flex',
  gap: '1rem',
  listStyle: 'none',
  padding: 0,
};

export default Header;