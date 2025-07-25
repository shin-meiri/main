// src/pages/Pages.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const Pages = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header style={{ backgroundColor: '#000', padding: '15px 20px', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>
          Login
        </div>
      </header>

      <main style={{ flex: 1, padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f6f8' }}>
        <Outlet />
      </main>

      <footer style={{ backgroundColor: '#000', height: '60px', width: '100%' }}></footer>
    </div>
  );
};

export default Pages;