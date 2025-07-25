// src/pages/Pages.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const Pages = () => {
  return (
    <div style={styles.container}>
      {/* Header Hitam - Ada Tulisan Login di Kanan */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <span style={styles.loginText}>Login</span>
        </div>
      </header>

      {/* Konten Halaman (Di sini Login.jsx akan muncul) */}
      <main style={styles.main}>
        <Outlet />
      </main>

      {/* Footer Hitam Tanpa Tulisan */}
      <footer style={styles.footer}></footer>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  header: {
    backgroundColor: '#000',
    color: '#fff',
    padding: '15px 20px',
    width: '100%',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'flex-end',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  loginText: {
    textTransform: 'uppercase',
  },
  main: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    backgroundColor: '#000',
    height: '60px',
    width: '100%',
  },
};

export default Pages;
