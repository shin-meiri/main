import React from 'react';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <h1>Dashboard Admin</h1>
        <p>Selamat datang di panel administrasi.</p>
        <div className="stats">
          <div className="stat-card">Total Posts: 10</div>
          <div className="stat-card">Total Users: 5</div>
          <div className="stat-card">Pending: 2</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;