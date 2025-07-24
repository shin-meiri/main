import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const isLoggedIn = localStorage.getItem('admin_logged_in');
  if (!isLoggedIn) {
    window.location.href = '/admin';
    return null;
  }

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <nav>
        <Link to="/admin/settings">Pengaturan Website</Link> | 
        <Link to="/admin/logout" onClick={() => {
          localStorage.removeItem('admin_logged_in');
          window.location.href = '/';
        }}>Logout</Link>
      </nav>
    </div>
  );
}