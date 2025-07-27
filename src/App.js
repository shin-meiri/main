// frontend/src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AdminPanel from './components/AdminPanel';
import PageManager from './components/PageManager';
import DynamicPage from './components/DynamicPage';

const AppContent = () => {
  const location = useLocation();
  const [connection, setConnection] = useState({ apiUrl: '', credentials: {} });

  const handleConnectionSuccess = (apiUrl, credentials) => {
    setConnection({ apiUrl, credentials });
  };

  // Determine if current route is admin
  const isAdminRoute = location.pathname.startsWith('/admin');
  const pageSlug = isAdminRoute ? null : location.pathname.substring(1) || 'home';

  if (isAdminRoute) {
    return (
      <div>
        <nav style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>
          <a href="/admin" style={{ marginRight: '10px' }}>Admin Panel</a> | 
          <a href="/admin/pages" style={{ marginRight: '10px' }}>Page Manager</a> | 
          <a href="/">View Website</a>
        </nav>
        
        <div style={{ padding: '20px' }}>
          <Routes>
            <Route 
              path="/admin" 
              element={
                <AdminPanel onConnectionSuccess={handleConnectionSuccess} />
              } 
            />
            <Route 
              path="/admin/pages" 
              element={
                <PageManager 
                  apiUrl={connection.apiUrl}
                  dbCredentials={connection.credentials}
                />
              } 
            />
          </Routes>
        </div>
      </div>
    );
  }

  return (
    <DynamicPage 
      apiUrl={connection.apiUrl}
      dbCredentials={connection.credentials}
      pageSlug={pageSlug}
    />
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;