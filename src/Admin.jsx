// src/pages/Admin.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <h3>Admin Panel</h3>
        <ul style={styles.navList}>
          <li><a href="/admin" style={styles.navLink}>Dashboard</a></li>
          <li><a href="/admin/users" style={styles.navLink}>Users</a></li>
          <li><a href="/admin/settings" style={styles.navLink}>Settings</a></li>
        </ul>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        <h1>Dashboard</h1>
        <p>Selamat datang di halaman admin, Amy!</p>
        <div style={styles.cardContainer}>
          <div style={styles.card}>Total Users: 120</div>
          <div style={styles.card}>Revenue: $5,000</div>
          <div style={styles.card}>Orders: 85</div>
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
    color: 'white',
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
  navLink: {
    display: 'block',
    color: '#ecf0f1',
    textDecoration: 'none',
    padding: '10px 0',
    fontSize: '16px',
  },
  navLinkHover: {
    color: '#3498db',
  },
  logoutButton: {
    marginTop: 'auto',
    padding: '10px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  main: {
    flex: 1,
    padding: '30px',
    backgroundColor: '#ecf0f1',
  },
  cardContainer: {
    display: 'flex',
    gap: '20px',
    marginTop: '20px',
  },
  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    width: '200px',
    textAlign: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
  },
};

export default Admin;
