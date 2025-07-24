import React from 'react';
import { Link } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <div style={sidebarStyle}>
      <h3>Admin Panel</h3>
      <nav>
        <ul style={navList}>
          <li><Link to="/admin" style={linkStyle}>📊 Dashboard</Link></li>
          <li><Link to="/admin/settings" style={linkStyle}>⚙️ Settings</Link></li>
          <li><Link to="/" style={linkStyle}>⬅️ Kembali ke Situs</Link></li>
        </ul>
      </nav>
    </div>
  );
};

const sidebarStyle = {
  width: '250px',
  backgroundColor: '#34495e',
  color: 'white',
  height: 'calc(100vh - 60px)',
  position: 'fixed',
  top: '60px',
  left: 0,
  padding: '20px',
  borderRight: '1px solid #bdc3c7'
};

const navList = {
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