import React from 'react';
import Header from './pages/Header';
import Footer from './pages/Footer';
import Pages from './pages/Pages';
import { BrowserRouter } from 'react-router-dom';

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Pages />
      </main>
      <Footer />
    </BrowserRouter>
  );
};

export default App;