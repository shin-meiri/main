import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';           // ✅ Sekarang kita gunakan
import Login from './admin/pages/Login';
import Dashboard from './admin/pages/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false); // kontrol tampilkan login

  // Tampilkan halaman sesuai state
  let content;

  if (showLogin && !isAuthenticated) {
    content = <Login onLogin={() => setIsAuthenticated(true)} />;
  } else if (isAuthenticated) {
    content = <Dashboard />;
  } else {
    content = <Home onGoToLogin={() => setShowLogin(true)} />;
  }

  return (
    <div>
      <Header />
      <main>{content}</main>
      <Footer />
    </div>
  );
}

export default App;