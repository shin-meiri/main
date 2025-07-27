// Pages.jsx
import React, { useState, useEffect } from 'react';

const Pages = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Request ke API untuk membuat/memperbarui data
        const response = await fetch('/api/dat.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            message: 'welcome',
            color: 'pink',
            background: 'black'
          })
        });

        if (!response.ok) {
          throw new Error('Gagal menyimpan data');
        }

        // Mengambil data yang sudah disimpan
        const result = await fetch('/api/dat.json');
        const jsonData = await result.json();
        setData(jsonData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div style={{ 
      backgroundColor: 'black', 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      color: 'white'
    }}>
      Loading...
    </div>
  );

  if (error) return (
    <div style={{ 
      backgroundColor: 'black', 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      color: 'red'
    }}>
      Error: {error}
    </div>
  );

  return (
    <div style={{
      backgroundColor: data?.background || 'black',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{
        color: data?.color || 'pink',
        fontSize: '3rem',
        textAlign: 'center',
        margin: 0
      }}>
        {data?.message || 'welcome'}
      </h1>
    </div>
  );
};

export default Pages;
