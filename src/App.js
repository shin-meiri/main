import React, { useState } from 'react';
import Home from './components/Home';
import DbForm from './components/DbForm'; // Ganti sesuai nama komponen kamu
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('home'); // default: home

  return (
    <div className="App">
      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.navTitle}>🔧 My Admin</div>
        <div style={styles.navLinks}>
          <button
            onClick={() => setActivePage('home')}
            style={activePage === 'home' ? styles.navBtnActive : styles.navBtn}
          >
            HOME
          </button>
          <button
            onClick={() => setActivePage('database')}
            style={activePage === 'database' ? styles.navBtnActive : styles.navBtn}
          >
            DATABASE
          </button>
        </div>
      </nav>

      {/* Konten */}
      <main style={styles.main}>
        {activePage === 'home' && <Home />}
        {activePage === 'database' && <DbForm />}
      </main>
    </div>
  );
}

// === STYLES ===
const styles = {
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
    gap: '15px'
  },
  navBtn: {
    background: 'transparent',
    color: 'white',
    border: '2px solid transparent',
    padding: '8px 16px',
    fontSize: '1em',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'all 0.3s'
  },
  navBtnActive: {
    background: '#3498db',
    color: 'white',
    border: '2px solid #2980b9',
    padding: '8px 16px',
    fontSize: '1em',
    cursor: 'pointer',
    borderRadius: '6px',
    fontWeight: 'bold'
  },
  main: {
    minHeight: 'calc(100vh - 80px)',
    backgroundColor: '#f5f7fa',
    padding: '30px 20px',
    display: 'flex',
    justifyContent: 'center'
  }
}

export default App;
