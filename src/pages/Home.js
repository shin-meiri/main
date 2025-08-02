import React from 'react';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="home-container">
      <header className="header">
        <h1>Selamat Datang, {user?.name || 'Pengguna'}!</h1>
        <button
          onClick={() => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }}
          className="logout-btn"
        >
          Keluar
        </button>
      </header>
      <main>
        <p>Ini adalah halaman utama setelah login berhasil.</p>
      </main>
    </div>
  );
};

export default Home;