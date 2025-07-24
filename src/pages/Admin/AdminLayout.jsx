import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
  const [data, setData] = useState({});
  const [menu, setMenu] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetch('/api/data.php')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setMenu(json.admin?.menu || []);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div style={styles.adminContainer}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <img src={data.logo} alt="Logo" style={{ height: '40px' }} />
        </div>
        <nav>
          <ul style={styles.navList}>
            {menu.map((item, index) => (
              <li key={index}>
                <a href={item.url} style={styles.navLink}>
                  <span>{item.icon}</span> {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main style={styles.adminMain}>
        <Outlet /> {/* Tempat Dashboard dan halaman lain muncul */}
      </main>
    </div>
  );
};

const styles = {
  adminContainer: {
    display: 'flex',
    minHeight: 'calc(100vh - 60px)', // kurangi header
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRight: '1px solid #ddd',
    display: 'flex',
    flexDirection: 'column',
  },
  logo: {
    marginBottom: '2rem',
    textAlign: 'center',
  },
  navList: {
    listStyle: 'none',
    padding: 0,
    flex: 1,
  },
  navLink: {
    display: 'block',
    padding: '0.7rem 1rem',
    textDecoration: 'none',
    color: '#333',
    borderRadius: '4px',
    marginBottom: '0.5rem',
    fontSize: '0.95rem',
  },
  navLinkHover: {
    backgroundColor: '#007BFF',
    color: 'white',
  },
  logoutButton: {
    marginTop: 'auto',
    padding: '0.7rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  adminMain: {
    flex: 1,
    padding: '2rem',
    backgroundColor: '#fff',
  },
};

export default AdminLayout;