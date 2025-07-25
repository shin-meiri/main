// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Tidak perlu Navigate dulu
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

// Komponen sementara
function Home() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>🏠 Home</h2>
      <a href="/admin" style={buttonStyle}>➡️ Buka Admin</a>
    </div>
  );
}

function AdminPanel() {
  // Akan diganti oleh import sebenarnya
  return null;
}

// Ganti dengan kode di atas
export default App;

const buttonStyle = {
  padding: '15px 30px',
  fontSize: '18px',
  backgroundColor: '#007BFF',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '8px'
};