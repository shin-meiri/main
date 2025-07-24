import React from 'react';

export default function Home() {
  return (
    <div className="page home">
      <h1>Selamat Datang di Website Saya</h1>
      <p>Website profesional dibuat dengan React. Modern, cepat, dan responsif.</p>
      <button onClick={() => window.location.href = '/post'}>Lihat Postingan</button>
    </div>
  );
}