import React from 'react';

const Home = ({ onGoToLogin }) => {
  return (
    <div style={homeStyle}>
      <h2>Selamat Datang di Website Kami</h2>
      <p>Ini adalah halaman utama.</p>
      <button onClick={onGoToLogin} style={buttonStyle}>
        Masuk sebagai Admin
      </button>
    </div>
  );
};

const homeStyle = {
  padding: '2rem',
  textAlign: 'center',
};

const buttonStyle = {
  padding: '0.7rem 1.5rem',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '1rem',
  marginTop: '1rem',
};

export default Home;