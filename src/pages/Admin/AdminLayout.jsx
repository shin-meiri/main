import { Outlet, Link } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={sidebarStyle}>
        <h3>Admin Panel</h3>
        <nav>
          <ul style={navListStyle}>
            <li><Link to="dashboard" style={linkStyle}>📊 Dashboard</Link></li>
            <li><Link to="settings" style={linkStyle}>⚙️ Settings</Link></li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={mainStyle}>
        <div style={{ padding: '20px' }}>
          <Outlet /> {/* Tempat Dashboard & Settings muncul */}
        </div>
      </main>
    </div>
  );
};

// Styles
const sidebarStyle = {
  width: '250px',
  backgroundColor: '#2c3e50',
  color: 'white',
  padding: '20px 0',
  height: '100vh',
  position: 'fixed',
  top: 0,
  left: 0,
  display: 'flex',
  flexDirection: 'column'
};

const navListStyle = {
  listStyle: 'none',
  padding: 0,
  marginTop: '20px'
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  display: 'block',
  padding: '12px 20px',
  fontSize: '16px'
};

linkStyle[':hover'] = { backgroundColor: '#1a252f' };

const mainStyle = {
  marginLeft: '250px',
  flex: 1,
  backgroundColor: '#f8f9fa',
  minHeight: '100vh'
};

export default AdminLayout;