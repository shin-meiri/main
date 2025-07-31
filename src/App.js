import React, { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

const Header = lazy(() => import('./pages/Header'));
const Footer = lazy(() => import('./pages/Footer'));
const Pages = lazy(() => import('./pages/Pages'));
const Login = lazy(() => import('./admin/Login'));

function App() {
  return (
    <HashRouter>
      <Suspense fallback={<div>Memuat...</div>}>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Pages />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <Footer />
      </Suspense>
    </HashRouter>
  );
}

export default App;