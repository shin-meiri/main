import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h3>Admin Panel</h3>
      <ul>
        <li><a href="/admin/dashboard">Dashboard</a></li>
        <li><a href="/admin/posts">Posts</a></li>
        <li><a href="/admin/users">Users</a></li>
        <li><a href="/admin/settings">Settings</a></li>
      </ul>
    </div>
  );
};

export default Sidebar;