import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside style={sidebarStyle}>
      <div style={logoStyle}>Admin Panel</div>
      <nav>
        <ul style={navListStyle}>
          <li><Link to="/dashboard" style={linkStyle}>Dashboard</Link></li>
          <li><Link to="/users" style={linkStyle}>Kelola User</Link></li>
          <li><Link to="/settings" style={linkStyle}>Pengaturan</Link></li>
          <li>
            <button
              onClick={() => {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
              }}
              style={{ ...linkStyle, textAlign: 'left', color: '#dc3545' }}
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

const sidebarStyle = {
  width: '250px',
  backgroundColor: '#2c3e50',
  color: '#ecf0f1',
  height: '100vh',
  padding: '1rem 0',
  position: 'fixed',
};

const logoStyle = {
  padding: '0 1rem',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  marginBottom: '2rem',
};

const navListStyle = {
  listStyle: 'none',
  padding: 0,
};

const linkStyle = {
  display: 'block',
  padding: '0.75rem 1rem',
  color: '#ecf0f1',
  textDecoration: 'none',
  fontSize: '0.95rem',
};

linkStyle[':hover'] = {
  backgroundColor: '#34495e',
};

export default Sidebar;