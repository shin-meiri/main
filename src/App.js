import React from 'react';
import { HashRouter } from 'react-router-dom';
import Header from './pages/Header';
import Footer from './pages/Footer';
import Pages from './pages/Pages';
import Login from './admin/Login';

const App = () => {
  return (
    <HashRouter>
      <Header />
      <main>
        <Pages />
      </main>
      <Footer />
    </HashRouter>
  );
};

export default App;