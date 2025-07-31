import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Header from './pages/Header';
import Footer from './pages/Footer';
import Pages from './pages/Pages';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Pages />
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;