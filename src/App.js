import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './admin/pages/Login';
import Dashboard from './admin/pages/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div>
      <Header />
      <main>
        {isAuthenticated ? (
          <Dashboard />
        ) : (
          <Login onLogin={() => setIsAuthenticated(true)} />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;