// src/AdminPanel.jsx
import React, { useState } from 'react';

export default function AdminPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://bos.free.nf/api/crud.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getAdminData' })
      });
      const json = await res.json();
      setData(json);
    } catch (err) {
      setData({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>🔧 Test API</h1>
      <p>Tekan tombol di bawah untuk cek koneksi ke crud.php</p>
      <button onClick={testAPI} disabled={loading}>
        {loading ? 'Cek...' : 'Test API'}
      </button>

      {data && (
        <pre style={{ textAlign: 'left', margin: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}