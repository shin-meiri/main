import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header style={{
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <h1 style={{ margin: 0 }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            My Professional Site
          </Link>
        </h1>
      </div>
      <nav>
        <Link to="/" style={linkStyle}>Home</Link> | 
        <Link to="/post" style={linkStyle}>Posts</Link> | 
        <Link to="/about" style={linkStyle}>About</Link> | 
        <Link to="/contact" style={linkStyle}>Contact</Link> | 
        <Link to="/admin" style={linkStyle}>Admin</Link>
      </nav>
    </header>
  );
};

const linkStyle = { color: 'white', margin: '0 10px', textDecoration: 'none' };

export default Header;