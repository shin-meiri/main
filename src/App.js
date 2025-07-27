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
        <nav>
          <a href="/admin">Admin Panel</a> | 
          <a href="/admin/pages">Page Manager</a> | 
          <a href="/">View Website</a>
        </nav>
        
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
              connection.apiUrl && connection.credentials.host ? (
                <PageManager 
                  apiUrl={connection.apiUrl}
                  dbCredentials={connection.credentials}
                />
              ) : (
                <div>Please connect to database first in <a href="/admin">Admin Panel</a></div>
              )
            } 
          />
        </Routes>
      </div>
    );
  }

  return (
    <DynamicPage 
      apiUrl={connection.apiUrl || 'http://localhost:8000/api/konek.php'}
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