import React from 'react';

const Dashboard = () => {
  return (
    <div style={dashboardStyle}>
      <h1>Dashboard Admin</h1>
      <p>Selamat datang di panel administrasi!</p>
      <div style={cardStyle}>
        <h3>Statistik</h3>
        <p>Users: 100</p>
        <p>Posts: 50</p>
      </div>
    </div>
  );
};

const dashboardStyle = {
  marginLeft: '250px', // agar tidak tertutup sidebar
  padding: '2rem',
};

const cardStyle = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '1rem',
  backgroundColor: '#f9f9f9',
  marginTop: '1rem',
};

export default Dashboard;