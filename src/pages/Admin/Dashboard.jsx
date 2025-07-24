import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Settings from './Settings';

const Dashboard = () => {
  const [settings, setSettings] = useState({
    siteTitle: 'My Professional Site',
    bgColor: '#f8f9fa',
    textColor: '#212529',
    favicon: '/favicon.ico'
  });

  // Cek login
  useEffect(() => {
    const loggedIn = localStorage.getItem('adminLoggedIn');
    if (loggedIn !== 'true') {
      window.location.href = '/admin'; // Redirect ke login jika belum login
      return;
    }

    const saved = localStorage.getItem('siteSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    } else {
      fetch('/settings.json')
        .then(res => res.json())
        .then(data => setSettings(data));
    }
  }, []);

  // Terapkan setting
  useEffect(() => {
    document.body.style.backgroundColor = settings.bgColor;
    document.body.style.color = settings.textColor;
    document.title = settings.siteTitle;

    const link = document.querySelector("link[rel='icon']");
    if (link) link.href = settings.favicon;
  }, [settings]);

  return (
    <>
      <AdminSidebar />
      <main style={{ marginLeft: '270px', padding: '20px', minHeight: 'calc(100vh - 60px)' }}>
        <h1>Dashboard Admin</h1>
        <p>Selamat datang di panel administrasi.</p>
        <p>Kamu bisa mengatur tampilan situs melalui menu di sebelah kiri.</p>
        
        <hr />
        <Settings settings={settings} setSettings={setSettings} />
      </main>
    </>
  );
};

export default Dashboard;