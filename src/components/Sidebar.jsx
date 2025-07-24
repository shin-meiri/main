import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div style={sidebarStyle}>
      <div style={logoStyle}>Admin Panel</div>
      <nav>
        <ul style={navStyle}>
          <li><Link to="/admin/dashboard" style={linkStyle}>📊 Dashboard</Link></li>
          <li><Link to="/admin/posts" style={linkStyle}>📝 Posts</Link></li>
          <li><Link to="/admin/settings" style={linkStyle}>⚙️ Settings</Link></li>
        </ul>
      </nav>
    </div>
  );
};

const sidebarStyle = {
  width: '250px',
  backgroundColor: '#2c3e50',
  color: 'white',
  height: '100vh',
  position: 'fixed',
  top: 0,
  left: 0,
  padding: '2rem 0',
};

const logoStyle = {
  textAlign: 'center',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  marginBottom: '2rem',
};

const navStyle = {
  listStyle: 'none',
  padding: 0,
};

const linkStyle = {
  display: 'block',
  padding: '1rem 1.5rem',
  color: 'white',
  textDecoration: 'none',
  transition: 'background 0.3s',
};

linkStyle[':hover'] = {
  backgroundColor: '#34495e',
};

export default Sidebar;