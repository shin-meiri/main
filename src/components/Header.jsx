import React from 'react';
import './Header.css'; // Kita buat CSS-nya di bawah

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="logo">Logo</div>
        <nav className="nav">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;