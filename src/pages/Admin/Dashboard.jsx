import React from 'react';

const Dashboard = () => {
  return (
    <div style={styles.container}>
      <h1>Dashboard Admin</h1>
      <p>Selamat datang di area admin. Ini adalah halaman utama dashboard.</p>
      <div style={styles.card}>
        <h3>Statistik</h3>
        <p>Users: 120</p>
        <p>Orders: 45</p>
        <p>Revenue: $2,300</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  card: {
    marginTop: '1rem',
    padding: '1.5rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
};

export default Dashboard;