// src/Admin.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/', { replace: true });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{
        width: '250px',
        backgroundColor: '#2c3e50',
        color: '#ecf0f1',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h3>Admin Panel</h3>
        <ul style={{
          listStyle: 'none',
          padding: '0',
          margin: '20px 0',
          flex: 1
        }}>
          <li
            onClick={() => navigate('/admin')}
            style={{
              padding: '10px',
              cursor: 'pointer',
              borderRadius: '4px',
              marginBottom: '5px',
              transition: 'background 0.3s'
            }}
            onMouseOver={e => e.target.style.backgroundColor = '#34495e'}
            onMouseOut={e => e.target.style.backgroundColor = 'transparent'}
          >
            Dashboard
          </li>
          <li
            onClick={() => navigate('/admin/profile')}
            style={{
              padding: '10px',
              cursor: 'pointer',
              borderRadius: '4px',
              marginBottom: '5px',
              transition: 'background 0.3s'
            }}
            onMouseOver={e => e.target.style.backgroundColor = '#34495e'}
            onMouseOut={e => e.target.style.backgroundColor = 'transparent'}
          >
            Profile
          </li>
          <li
            onClick={() => navigate('/admin/settings')}
            style={{
              padding: '10px',
              cursor: 'pointer',
              borderRadius: '4px',
              marginBottom: '5px',
              transition: 'background 0.3s'
            }}
            onMouseOver={e => e.target.style.backgroundColor = '#34495e'}
            onMouseOut={e => e.target.style.backgroundColor = 'transparent'}
          >
            Settings
          </li>
        </ul>
        <button
          onClick={handleLogout}
          style={{
            marginTop: 'auto',
            padding: '10px',
            backgroundColor: '#e74c3c',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </aside>

      <main style={{
        flex: 1,
        padding: '20px',
        backgroundColor: '#ecf0f1'
      }}>
        <header style={{
          marginBottom: '20px',
          borderBottom: '2px solid #bdc3c7',
          paddingBottom: '10px'
        }}>
          <h1>Dashboard</h1>
        </header>
        <div style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <p>Selamat datang di halaman admin, amy!</p>
          <p>Ini adalah dashboard utama.</p>
        </div>
      </main>
    </div>
  );
};

export default Admin;