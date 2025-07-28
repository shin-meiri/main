// src/pages/Pages.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Pages = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Kirim request ke API untuk menyimpan data
    axios.post('/api/dat.php', {
      message: 'welcome'
    })
    .then(response => {
      console.log('Data berhasil disimpan:', response.data);
      
      // Ambil data yang sudah disimpan dari JSON
      return axios.get('/api/dat.json');
    })
    .then(response => {
      setData(response.data);
      setLoading(false);
    })
    .catch(err => {
      setError(err.message);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ color: 'pink', backgroundColor: 'black', padding: '20px' }}>Loading...</div>;
  if (error) return <div style={{ color: 'pink', backgroundColor: 'black', padding: '20px' }}>Error: {error}</div>;

  return (
    <div style={{ 
      color: 'pink', 
      backgroundColor: 'black', 
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '2rem'
    }}>
      {data?.message || 'No data'}
    </div>
  );
};

export default Pages;