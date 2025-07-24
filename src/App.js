import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import { isAuthenticated, login } from './utils/auth'; // Tambahkan login jika diperlukan

function App() {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('admin');
    if (stored) {
      setAdmin(JSON.parse(stored));
    }
  }, []);

  const handleLogin = (user) => {
    setAdmin(user);
  };

  const handleLogout = () => {
    setAdmin(null);
  };

  return (
    <Router>
      <div style={appStyle}>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/admin/login" element={
            admin ? <Navigate to="/admin/dashboard" /> : <AdminLogin onLogin={handleLogin} />
          } />

          <Route path="/admin/dashboard" element={
            admin ? (
              <>
                <Sidebar onLogout={handleLogout} />
                <Dashboard />
              </>
            ) : (
              <Navigate to="/admin/login" />
            )
          } />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

const appStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
};

export default App;
