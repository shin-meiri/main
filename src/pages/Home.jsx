import React from 'react';

const Home = () => {
  return (
    <div style={homeStyle}>
      <h2>Selamat Datang di Halaman Utama</h2>
      <p>Ini adalah halaman home dari aplikasi React kamu.</p>
    </div>
  );
};

const homeStyle = {
  padding: '2rem',
  textAlign: 'center',
};

export default Home;