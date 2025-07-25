// src/components/TestConnection.js

import React, { useState } from 'react';

const TestConnection = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('https://bos.free.nf/api/datadb.php');

      // Cek apakah respons OK (status 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setResult({
        success: false,
        message: `Gagal: ${error.message}. Cek console untuk detail.`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>🧪 Tes Koneksi Database</h2>
      <p>Tekan tombol di bawah untuk cek apakah React bisa terhubung ke database via API.</p>

      <button onClick={handleTest} disabled={loading} style={styles.button}>
        {loading ? '🔄 Mengecek...' : '🔍 Tes Koneksi'}
      </button>

      {result && (
        <div style={result.success ? styles.successBox : styles.errorBox}>
          <strong>Status:</strong> {result.success ? '✅ Berhasil' : '❌ Gagal'}
          <br />
          <strong>Pesan:</strong> {result.message}
          {result.error && <><br /><strong>Error:</strong> {result.error}</>}
        </div>
      )}
    </div>
  );
};

// Styling sederhana
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
    textAlign: 'left',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  successBox: {
    marginTop: '20px',
    padding: '15px',
    borderRadius: '8px',
    backgroundColor: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb',
  },
  errorBox: {
    marginTop: '20px',
    padding: '15px',
    borderRadius: '8px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb',
  },
};

export default TestConnection;