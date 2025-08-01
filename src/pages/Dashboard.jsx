import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [theme, setTheme] = useState({});
  const [toko, setToko] = useState('Warung Hendi');

  useEffect(() => {
    axios.get('/api/theme.php')
      .then(res => {
        setTheme(res.data);
        if (res.data.home?.title) setToko(res.data.home.title);
      })
      .catch(() => setTheme({}));
  }, []);

  const containerStyle = {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    background: theme.body?.background || '#f8f9fa',
    minHeight: '100vh'
  };

  const cardStyle = {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
    margin: '10px',
    height: '120px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    cursor: 'pointer'
  };

  const imgStyle = {
    width: '80px',
    height: '80px',
    margin: '0 auto 10px',
    borderRadius: '8px'
  };

  const menuItems = [
    { label: 'Pendapatan Lain', icon: '💰', path: '#/income' },
    { label: 'Pengeluaran', icon: '💸', path: '#/expense' },
    { label: 'Order Tersimpan', icon: '📦', path: '#/orders' },
    { label: 'Histori', icon: '📅', path: '#/history' },
    { label: 'Pembayaran', icon: '💳', path: '#/payment' },
    { label: 'Penjualan', icon: '🛒', path: '#/sales' },
    { label: 'Grafik', icon: '📊', path: '#/chart' },
    { label: 'Jurnal', icon: '📒', path: '#/journal' },
    { label: 'Produk', icon: '🛍️', path: '#/products' }
  ];

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        {theme.home?.logo && (
          <img src={theme.home.logo} alt="Logo" style={{ height: '60px', marginBottom: '10px' }} />
        )}
        <h1>{toko}</h1>
        <p>31/07/2025</p>
      </div>

      {/* Grid Menu */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {menuItems.map((item, i) => (
          <div key={i} style={cardStyle} onClick={() => alert(`Fitur: ${item.label}`)}>
            <img src="https://via.placeholder.com/80" alt="icon" style={imgStyle} />
            <div>{item.label}</div>
          </div>
        ))}
      </div>

      {/* Footer Navigation */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        background: '#007BFF',
        color: 'white',
        padding: '10px 0'
      }}>
        {[
          { label: 'Beranda', icon: '🏠', path: '#/dashboard' },
          { label: 'Histori', icon: '📅', path: '#/history' },
          { label: 'Penjualan', icon: '🛒', path: '#/sales' },
          { label: 'Lainnya', icon: '☰', path: '#/more' }
        ].map((item, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center' }}>
            <div>{item.icon}</div>
            <div style={{ fontSize: '12px' }}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;