import React, { useState } from 'react';

const TestConnection = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTest = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('https://bos.free.nf/api/datadb.php');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Gagal terhubung ke API: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Tes Koneksi Database</h2>
      <button onClick={handleTest} disabled={loading}>
        {loading ? 'Sedang memeriksa...' : 'Tes Koneksi'}
      </button>

      {error && <p style={{ color: 'red' }}><strong>Error:</strong> {error}</p>}

      {result && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
          <h3>Hasil:</h3>
          <p><strong>Success:</strong> {result.success ? 'Ya' : 'Tidak'}</p>
          <p><strong>Pesan:</strong> {result.message}</p>
          {result.data && (
            <pre>{JSON.stringify(result.data, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
};

export default TestConnection;