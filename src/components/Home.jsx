// src/components/Home.jsx
import React from 'react';

const Home = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>👋 Selamat Datang di Situs Saya</h1>
      <p style={styles.subtitle}>
        Aplikasi ini digunakan untuk mengelola koneksi database secara sederhana.
      </p>
      <div style={styles.emoji}>
        🚀 ✨ 💻 🔧
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#2c3e50'
  },
  title: {
    fontSize: '2.5em',
    margin: '10px 0',
    color: '#3498db'
  },
  subtitle: {
    fontSize: '1.2em',
    color: '#7f8c8d',
    maxWidth: '600px',
    margin: '20px auto'
  },
  emoji: {
    fontSize: '2em',
    marginTop: '30px'
  }
};

export default Home;
