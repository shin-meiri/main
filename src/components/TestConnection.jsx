import React, { useState } from 'react';

const TestConnection = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('https://bos.free.nf/api/datadb.php', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, message: 'Gagal terhubung ke API: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Tes Koneksi Database</h2>
      <button onClick={handleTest} disabled={loading}>
        {loading ? 'Sedang Mengecek...' : 'Tes Koneksi'}
      </button>

      {result && (
        <div
          style={{
            marginTop: '20px',
            padding: '10px',
            borderRadius: '5px',
            backgroundColor: result.success ? '#d4edda' : '#f8d7da',
            color: result.success ? '#155724' : '#721c24',
            border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`,
          }}
        >
          <strong>Status:</strong> {result.success ? 'Berhasil' : 'Gagal'}
          <br />
          <strong>Pesan:</strong> {result.message}
        </div>
      )}
    </div>
  );
};

export default TestConnection;