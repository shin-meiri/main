import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

const App = () => {
  useEffect(() => {
    const user = localStorage.getItem('user');
    const hash = window.location.hash;

    if (user && (hash === '' || hash === '#/login')) {
      window.location.replace('#/');
    }

    if (!user && hash !== '#/login') {
      window.location.replace('#/login');
    }
  }, []);

  return (
    <HashRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </main>
      <Footer />
    </HashRouter>
  );
};

export default App;