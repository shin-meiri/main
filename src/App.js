// src/App.js
import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import DbForm from './components/DbForm';
import Tabel from './components/Tabel';
import Login from './components/Login';
//import Register from './components/Register';
import Edit from './components/Edit';

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('login'); // login, register, home

  // Cek login saat load
  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      setUser(JSON.parse(saved));
      setPage('home');
    }
  }, []);

  const handleLogin = (userData, next = 'home') => {
    setUser(userData);
    setPage(next);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setPage('login');
  };

  if (!user) {
    return (
      <div style={styles.authContainer}>
        {page === 'login' && <Login onLogin={handleLogin} />}
 
      </div>
    );
  }

  return (
    <div className="App">
      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.navTitle}>🔧 My Bos</div>
        <div style={styles.navLinks}>
          <button onClick={() => setPage('home')} style={getNavStyle(page === 'home')}>🏠 HOME</button>
          <button onClick={() => setPage('db')} style={getNavStyle(page === 'db')}>🗄️ DATABASE</button>
          <button onClick={() => setPage('tabel')} style={getNavStyle(page === 'tabel')}>📊 TABEL</button>
          <button onClick={() => setPage('edit')}>📝 EDIT</button>
          <button onClick={handleLogout} style={styles.navBtnLogout}>🚪 Logout</button>
        </div>
      </nav>

      {/* Konten */}
      <main style={styles.main}>
        {page === 'home' && <Home />}
        {page === 'db' && <DbForm />}
        {page === 'tabel' && <Tabel />}
        {page === 'edit' && <Edit />}
      </main>
    </div>
  );
}

// === STYLES ===
const styles = {
  authContainer: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    padding: '20px'
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
    padding: '15px 30px',
    color: 'white',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  navTitle: {
    fontSize: '1.5em',
    fontWeight: 'bold'
  },
  navLinks: {
    display: 'flex',
    gap: '10px'
  },
  main: {
    minHeight: 'calc(100vh - 80px)',
    backgroundColor: '#f5f7fa',
    padding: '30px 20px'
  },
  navBtnLogout: {
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

const getNavStyle = (active) => ({
  background: active ? '#3498db' : 'transparent',
  color: 'white',
  border: '2px solid #3498db',
  padding: '8px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: active ? 'bold' : 'normal'
});

export default App;
