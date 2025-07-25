// src/AdminPanel.jsx
import React, { useState, useEffect } from 'react';

const API_URL = 'https://bos.free.nf/api/crud.php';

export default function AdminPanel() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    // Coba kirim request ke crud.php
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'getAdminData' })
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        setMessage(`Error: ${data.error}`);
      } else {
        setMessage('OK - Admin Panel Jalan! 🎉');
      }
    })
    .catch(err => {
      setMessage(`Gagal koneksi: ${err.message}`);
    });
  }, []);

  return (
    <div style={styles.container}>
      <h1>🧪 TEST ADMIN PANEL</h1>
      <p><strong>Status:</strong> {message}</p>
      <button onClick={() => window.location.reload()} style={styles.button}>
        Refresh
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: '40px',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    backgroundColor: '#f0f8ff',
    minHeight: '100vh'
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};