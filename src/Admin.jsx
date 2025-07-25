// src/Admin.jsx
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '250px',
          backgroundColor: '#2c3e50',
          color: '#ecf0f1',
          padding: '20px 0',
          height: '100vh',
          position: 'fixed',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px', fontSize: '18px', fontWeight: 'bold' }}>
          Admin Panel
        </div>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>
              <a
                href="/admin"
                style={{
                  display: 'block',
                  padding: '12px 20px',
                  color: '#ecf0f1',
                  textDecoration: 'none',
                  borderBottom: '1px solid #34495e',
                }}
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="/admin/profile"
                style={{
                  display: 'block',
                  padding: '12px 20px',
                  color: '#bdc3c7',
                  textDecoration: 'none',
                }}
              >
                Profile
              </a>
            </li>
            <li>
              <a
                href="/admin/settings"
                style={{
                  display: 'block',
                  padding: '12px 20px',
                  color: '#bdc3c7',
                  textDecoration: 'none',
                }}
              >
                Settings
              </a>
            </li>
          </ul>
        </nav>
        <div style={{ marginTop: 'auto', padding: '20px', textAlign: 'center' }}>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        style={{
          marginLeft: '250px',
          padding: '30px',
          flex: 1,
          backgroundColor: '#ecf0f1',
        }}
      >
        <header style={{ marginBottom: '20px' }}>
          <h1 style={{ color: '#2c3e50' }}>Dashboard</h1>
        </header>
        <div
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <h2>Selamat datang di Admin Dashboard!</h2>
          <p>Anda telah berhasil login sebagai <strong>amy</strong>.</p>
        </div>
      </main>
    </div>
  );
};

export default Admin;