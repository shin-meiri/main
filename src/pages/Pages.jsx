import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Pages = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Cek apakah user sudah login
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    // Hapus status login dan redirect ke login
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{ color: '#333', margin: 0 }}>Dashboard</h1>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>

        <div style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '8px',
          color: '#155724'
        }}>
          <h2 style={{ margin: '0 0 1rem 0' }}>✅ Berhasil Login</h2>
          <p style={{ fontSize: '1.1rem' }}>
            Selamat datang! Anda telah berhasil masuk ke sistem.
          </p>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3>Informasi Login:</h3>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '1rem',
            borderRadius: '4px',
            border: '1px solid #dee2e6'
          }}>
            <p><strong>Username:</strong> admin</p>
            <p><strong>Password:</strong> 1234admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pages;
