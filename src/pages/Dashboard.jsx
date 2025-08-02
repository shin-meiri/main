// pages/Dashboard.jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { isLoggedIn } = useAuth();

  // Jika belum login, arahkan ke /login
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Dashboard</h1>
      <p>Selamat datang! Kamu sudah login.</p>
    </div>
  );
};

export default Dashboard;