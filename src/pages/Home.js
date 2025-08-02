// src/pages/Home.js
import React from 'react';

function Home() {
  return (
    <div className="container">
      <h1>Selamat Datang di Dashboard!</h1>
      <p>Anda telah berhasil login.</p>
      <button onClick={() => {
        sessionStorage.removeItem('isLoggedIn');
        window.location.href = '/';
      }}>
        Logout
      </button>
    </div>
  );
}

export default Home;