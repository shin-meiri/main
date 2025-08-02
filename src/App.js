import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Login from './admin/Login';
import Pages from './pages/Pages';
import Header from './pages/Header';
import Footer from './pages/Footer';

const App = () => {
  useEffect(() => {
    const user = localStorage.getItem('user');
    const isLogin = window.location.hash === '#/login';

    if (!user && !isLogin) {
      window.location.href = '#/login';
    }

    if (user && isLogin) {
      window.location.href = '#/';
    }
  }, []);

  return (
    <HashRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Pages />} />
        </Routes>
      </main>
      <Footer />
    </HashRouter>
  );
};

export default App;