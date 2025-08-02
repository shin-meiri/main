import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

const App = () => {
  useEffect(() => {
    const user = localStorage.getItem('user');
    const hash = window.location.hash;

    if (user && (hash === '' || hash === 'd/login')) {
      window.location.replace('d/');
    }

    if (!user && hash !== 'd/login') {
      window.location.replace('d/login');
    }
  }, []);

  return (
    <HashRouter>
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </main>
    </HashRouter>
  );
};

export default App;