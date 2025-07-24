import React from 'react';
import { logout } from '../utils/auth';

const Sidebar = ({ onLogout }) => {
  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <aside style={sidebarStyle}>
      <div style={logoStyle}>Admin Panel</div>
      <nav>
        <ul style={navStyle}>
          <li><a href="/admin/dashboard" style={linkStyle}>📊 Dashboard</a></li>
          <li><a href="/admin/posts" style={linkStyle}>📝 Posts</a></li>
          <li><a href="/admin/settings" style={linkStyle}>⚙️ Settings</a></li>
          <li>
            <button onClick={handleLogout} style={{ ...linkStyle, background: '#dc3545' }}>
              🔐 Logout
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
  color: 'white',
  height: '100vh',
  padding: '1rem 0',
  position: 'fixed',
  top: 0,
  left: 0,
};

const logoStyle = {
  textAlign: 'center',
  padding: '1rem',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  borderBottom: '1px solid #34495e',
};

const navStyle = {
  listStyle: 'none',
  padding: 0,
  marginTop: '1rem',
};

const linkStyle = {
  display: 'block',
  padding: '1rem 1.5rem',
  color: 'white',
  textDecoration: 'none',
  fontSize: '0.95rem',
  transition: 'background 0.3s',
};

export default Sidebar;