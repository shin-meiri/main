import React, { useState } from 'react';

const Dashboard = ({ children, onLogout }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  // Menu sidebar
  const menus = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <h3>Admin Panel</h3>
        </div>
        <nav>
          {menus.map((menu) => (
            <button
              key={menu.id}
              onClick={() => setActiveMenu(menu.id)}
              style={{
                ...styles.menuItem,
                backgroundColor: activeMenu === menu.id ? '#34495e' : 'transparent',
                color: activeMenu === menu.id ? 'white' : '#bdc3c7',
              }}
            >
              <span style={styles.icon}>{menu.icon}</span>
              {menu.label}
            </button>
          ))}
        </nav>
        <div style={styles.logout}>
          <button onClick={onLogout} style={styles.logoutButton}>
            🔐 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.content}>
        {children}
      </main>
    </div>
  );
};

// CSS-in-JS Styles
const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#2c3e50',
    color: '#ecf0f1',
    padding: '20px 0',
    display: 'flex',
    flexDirection: 'column',
  },
  logo: {
    padding: '0 20px 20px',
    borderBottom: '1px solid #34495e',
    marginBottom: '20px',
  },
  menuItem: {
    padding: '15px 20px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#bdc3c7',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'all 0.3s',
  },
  icon: {
    fontSize: '18px',
  },
  logout: {
    marginTop: 'auto',
    padding: '20px',
  },
  logoutButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: '30px',
    backgroundColor: '#ecf0f1',
    minHeight: '100vh',
  },
};

export default Dashboard;