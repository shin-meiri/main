import React, { useState } from 'react';

const DatabaseTestForm = () => {
  const [form, setForm] = useState({
    host: 'localhost',
    port: '5432',
    username: '',
    password: '',
    database: '',
  });

  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');

    // Simulasi koneksi (karena frontend tidak bisa langsung akses DB)
    setTimeout(() => {
      if (form.username && form.password) {
        setResult('✅ Koneksi berhasil! (simulasi)');
      } else {
        setResult('❌ Gagal koneksi: Username atau password kosong.');
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Tes Koneksi Database</h2>
      <form onSubmit={handleSubmit}>
        <div style={styles.field}>
          <label>Host:</label>
          <input
            type="text"
            name="host"
            value={form.host}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.field}>
          <label>Port:</label>
          <input
            type="text"
            name="port"
            value={form.port}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.field}>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.field}>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.field}>
          <label>Database Name:</label>
          <input
            type="text"
            name="database"
            value={form.database}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Menghubungkan...' : 'Test Connection'}
        </button>
      </form>

      {result && (
        <div style={styles.result}>
          <strong>Hasil: </strong>
          <span>{result}</span>
        </div>
      )}
    </div>
  );
};

const styles = {
  field: {
    marginBottom: '15px',
  },
  result: {
    marginTop: '20px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#f9f9f9',
  },
};

export default DatabaseTestForm;