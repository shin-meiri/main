import React from 'react';

const Dashboard = () => {
  return (
    <div>
      <h2>📊 Dashboard</h2>
      <p>Selamat datang di panel admin!</p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        marginTop: '30px'
      }}>
        <div style={cardStyle}>Total Posts: <strong>12</strong></div>
        <div style={cardStyle}>Visitors: <strong>1.2K</strong></div>
        <div style={cardStyle}>Messages: <strong>5</strong></div>
      </div>
    </div>
  );
};

const cardStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  textAlign: 'center',
  fontWeight: 'bold',
  color: '#2c3e50'
};

export default Dashboard;