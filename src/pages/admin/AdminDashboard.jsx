import React from 'react';
import { Outlet } from 'react-router-dom'; // untuk render halaman anak: settings, profile
import AdminSidebar from '../../components/AdminSidebar';

const Dashboard = () => {
  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main style={{
        marginLeft: '220px',
        padding: '20px',
        width: `calc(100% - 220px)`,
        minHeight: 'calc(100vh - 60px)',
        backgroundColor: '#ecf0f1'
      }}>
        <h2>Dashboard Admin</h2>
        <Outlet /> {/* Render child route: Settings, Profile */}
      </main>
    </div>
  );
};

export default Dashboard;