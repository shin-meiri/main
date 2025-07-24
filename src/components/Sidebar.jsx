import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="logo">Admin Panel</div>
      <nav>
        <ul>
          <li><Link to="/admin/dashboard">📊 Dashboard</Link></li>
          <li><Link to="/admin/posts">📝 Posts</Link></li>
          <li><Link to="/admin/users">👥 Users</Link></li>
          <li><Link to="/admin/settings">⚙️ Settings</Link></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;