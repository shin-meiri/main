import React from 'react';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="main-content">
        <h1>Dashboard Admin</h1>
        <p>Selamat datang di panel administrasi.</p>
        <div className="stats">
          <div className="stat-card">Total Users: 100</div>
          <div className="stat-card">Total Posts: 50</div>
          <div className="stat-card">Pending: 5</div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;