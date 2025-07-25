import React, { useState } from 'react';

export default function TestConnection() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('https://bos.free.nf/api/datadb.php');
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({
        success: false,
        message: 'Gagal load API',
        error: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>🧪 Tes Koneksi Database</h2>
      <p>Klik tombol di bawah untuk cek koneksi ke database.</p>
      
      <button onClick={handleClick} disabled={loading} style={styles.button}>
        {loading ? '🔄 Loading...' : '🔍 Tes Koneksi'}
      </button>

      {result && (
        <div style={result.success ? styles.success : styles.error}>
          <strong>Status:</strong> {result.success ? '✅ Berhasil' : '❌ Gagal'}
          <br />
          <strong>Pesan:</strong> {result.message}
          {result.error && (
            <>
              <br />
              <strong>Error:</strong> {result.error}
            </>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    maxWidth: '600px',
    margin: '0 auto'
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  success: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb',
    borderRadius: '5px'
  },
  error: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb',
    borderRadius: '5px'
  }
};