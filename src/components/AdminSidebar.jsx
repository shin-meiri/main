import React from 'react';
import { Link } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <div style={sidebarStyle}>
      <h3>Admin Panel</h3>
      <ul style={listStyle}>
        <li><Link to="/admin/settings" style={linkStyle}>⚙️ Settings</Link></li>
        <li><Link to="/admin/profile" style={linkStyle}>👤 Profile</Link></li>
        <li><Link to="/" style={linkStyle}>🏠 View Site</Link></li>
      </ul>
    </div>
  );
};

// Styles
const sidebarStyle = {
  width: '220px',
  backgroundColor: '#34495e',
  color: 'white',
  height: 'calc(100vh - 60px)',
  position: 'fixed',
  top: '60px',
  left: 0,
  padding: '20px',
  boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
};

const listStyle = {
  listStyle: 'none',
  padding: 0,
  marginTop: '20px'
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  display: 'block',
  padding: '10px 0',
  fontSize: '16px'
};

export default AdminSidebar;