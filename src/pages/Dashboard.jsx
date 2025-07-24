import React from 'react';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div style={containerStyle}>
      <Sidebar />
      <main style={mainContentStyle}>
        <h2>Dashboard Admin</h2>
        <p>Selamat datang, <strong>{user.username}</strong>!</p>
        <div style={cardStyle}>
          <h3>Statistik</h3>
          <p>User aktif: 120</p>
          <p>Transaksi hari ini: 24</p>
        </div>
      </main>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
};

const mainContentStyle = {
  marginLeft: '250px',
  padding: '2rem',
  width: 'calc(100% - 250px)',
};

const cardStyle = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '1rem',
  backgroundColor: '#f9f9f9',
};

export default Dashboard;