// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// === Kita taruh semua komponen di sini (inline) ===

function App() {
  return (
    <Router>
      <div style={{ fontFamily: 'Arial, sans-serif' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

// === Halaman Utama ===
function HomePage() {
  return (
    <div style={styles.page}>
      <h1>🏠 Beranda</h1>
      <a href="/admin">
        <button style={styles.button}>➡️ Buka Admin</button>
      </a>
    </div>
  );
}

// === Admin Panel (Inline) ===
function AdminPanel() {
  const [message, setMessage] = React.useState('Memuat...');

  React.useEffect(() => {
    fetch('https://bos.free.nf/api/crud.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'getAdminData' })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setMessage('✅ OK - Admin Panel JALAN! Data dari database berhasil dimuat.');
      } else {
        setMessage(`❌ Error: ${data.error || data.details}`);
      }
    })
    .catch(err => {
      setMessage(`🚨 Gagal koneksi: ${err.message}`);
    });
  }, []);

  return (
    <div style={styles.page}>
      <h1>🛠️ Admin Panel</h1>
      <p><strong>Status:</strong></p>
      <div style={styles.result}>{message}</div>
      <button onClick={() => window.location.reload()} style={styles.button}>
        Refresh
      </button>
      <br /><br />
      <a href="/" style={styles.link}>← Kembali ke Home</a>
    </div>
  );
}

// === STYLES ===
const styles = {
  page: {
    padding: '40px',
    textAlign: 'center',
    minHeight: '100vh',
    backgroundColor: '#f9f9f9',
    margin: 0,
  },
  button: {
    padding: '15px 30px',
    fontSize: '18px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '20px',
  },
  link: {
    fontSize: '18px',
    color: '#007BFF',
    textDecoration: 'none',
  },
  result: {
    marginTop: '20px',
    padding: '20px',
    textAlign: 'left',
    backgroundColor: '#fff',
    borderRadius: '8px',
    border: '1px solid #ddd',
    display: 'inline-block',
    maxWidth: '600px',
    lineHeight: '1.6'
  }
};

export default App;