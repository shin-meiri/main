import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Pages.css';

const Pages = () => {
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    // Cek apakah user sudah login
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userData = localStorage.getItem('user');
    
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Update waktu setiap detik
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleLogout = () => {
    // Konfirmasi logout
    if (window.confirm('Apakah Anda yakin ingin logout?')) {
      // Hapus status login
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      // Redirect ke login
      navigate('/login', { replace: true });
    }
  };

  const formatTime = (date) => {
    return date.toLocaleString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="loading-container">
        <div className="spinner-large"></div>
        <p>Memuat data pengguna...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Dashboard Sistem</h1>
          <div className="user-info">
            <span className="welcome-text">
              Selamat datang, <strong>{user.username}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="btn btn-danger btn-sm"
              title="Logout"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Success Card */}
        <div className="success-card">
          <div className="success-content">
            <div className="success-icon">✅</div>
            <div className="success-text">
              <h2>Berhasil Login</h2>
              <p>Anda telah berhasil masuk ke sistem. Selamat datang kembali!</p>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="info-cards">
          <div className="info-card">
            <div className="info-card-icon">🕒</div>
            <div className="info-card-content">
              <h3>Waktu Server</h3>
              <p className="info-card-value">{formatTime(currentTime)}</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-card-icon">👤</div>
            <div className="info-card-content">
              <h3>Pengguna</h3>
              <p className="info-card-value">{user.username}</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-card-icon">🔒</div>
            <div className="info-card-content">
              <h3>Status</h3>
              <p className="info-card-value success">Terautentikasi</p>
            </div>
          </div>
        </div>

        {/* Credentials Info */}
        <div className="credentials-card">
          <h3>Informasi Kredensial</h3>
          <div className="credentials-content">
            <div className="credential-item">
              <span className="credential-label">Username:</span>
              <code className="credential-value">admin</code>
            </div>
            <div className="credential-item">
              <span className="credential-label">Password:</span>
              <code className="credential-value">1234admin</code>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} Sistem Manajemen. Hak Cipta Dilindungi.</p>
      </footer>
    </div>
  );
};

export default Pages;