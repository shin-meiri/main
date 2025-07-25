// src/Admin.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/', { replace: true });
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <h3>Admin Panel</h3>
        <ul style={styles.navList}>
          <li onClick={() => navigate('/admin')} style={styles.navItem}>
            Dashboard
          </li>
          <li onClick={() => navigate('/admin/profile')} style={styles.navItem}>
            Profile
          </li>
          <li onClick={() => navigate('/admin/settings')} style={styles.navItem}>
            Settings
          </li>
        </ul>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        <header style={styles.header}>
          <h1>Dashboard</h1>
        </header>
        <div style={styles.content}>
          <p>Selamat datang di halaman admin, amy!</p>
          <p>Ini adalah dashboard utama.</p>
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#2c3e50',
    color: '#ecf0f1',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  navList: {
    listStyle: 'none',
    padding: 0,
    margin: '20px 0',
    flex: 1,
  },
  navItem: {
    padding: '10px',
    cursor: 'pointer',
    borderRadius: '4px',
    marginBottom: '5px',
    transition: 'background 0.3s',
  },
  logoutButton: {
    marginTop: 'auto',
    padding: '10px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  main: {
    flex: 1,
    padding: '20px',
    backgroundColor: '#ecf0f1',
  },
  header: {
    marginBottom: '20px',
    borderBottom: '2px solid #bdc3c7',
    paddingBottom: '10px',
  },
  content: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
};

export default Admin;