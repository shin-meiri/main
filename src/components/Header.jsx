import React from 'react';
import './Header.css'; // kita buat CSS terpisah agar rapi

const Header = () => {
  return (
    <header className="header">
      <div className="logo">Logo</div>
      <nav className="nav-menu">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </nav>
    </header>
  );
};

export default Header;