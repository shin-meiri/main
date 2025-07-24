import React from 'react';
import { isAuthenticated, logout } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header style={headerStyle}>
      <div style={logoContainer}>
        <h1>🎯 LogoApp</h1>
      </div>
      <nav style={navRight}>
        {isAuthenticated() ? (
          <button onClick={handleLogout} style={logoutButton}>
            Logout
          </button>
        ) : (
          <a href="/admin/login" style={navLink}>
            Login
          </a>
        )}
      </nav>
    </header>
  );
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#fff',
  padding: '1rem 2rem',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  position: 'fixed',
  width: '100%',
  top: 0,
  left: 0,
  zIndex: 1000,
  height: '60px',
};

const logoContainer = {
  fontWeight: 'bold',
  fontSize: '1.5rem',
  color: '#333',
};

const navRight = {
  display: 'flex',
  gap: '1rem',
  alignItems: 'center',
};

const navLink = {
  color: '#007bff',
  textDecoration: 'none',
  fontWeight: '500',
};

const logoutButton = {
  padding: '0.5rem 1rem',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default Header;