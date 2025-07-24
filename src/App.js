import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';

function App() {
  return (
    <div style={appStyle}>
      <Header />
      <main style={mainStyle}>
        <Home />
      </main>
      <Footer />
    </div>
  );
}

const appStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
};

const mainStyle = {
  flex: 1,
  padding: '2rem 0',
};

export default App;