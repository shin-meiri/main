import React from 'react';

const Dashboard = () => {
  return (
    <div style={dashboardStyle}>
      <h2>Admin Dashboard</h2>
      <p>Selamat datang di panel administrasi. Ini adalah halaman utama setelah login.</p>
      <div style={cardStyle}>
        <h3>📊 Statistik</h3>
        <p>Users: 100</p>
        <p>Posts: 50</p>
      </div>
    </div>
  );
};

const dashboardStyle = {
  marginLeft: '250px', // Agar tidak tertutup sidebar
  padding: '2rem',
  minHeight: '100vh',
  backgroundColor: '#f8f9fa',
};

const cardStyle = {
  backgroundColor: 'white',
  padding: '1.5rem',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

export default Dashboard;