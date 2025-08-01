import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './pages/Header';
import Footer from './pages/Footer';
import Pages from './pages/Pages';
import Login from './admin/Login';

const App = () => {
  return (
    <HashRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Pages />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
      <Footer />
    </HashRouter>
  );
};

export default App;
