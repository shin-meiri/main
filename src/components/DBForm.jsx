import React, { useState } from 'react';

const DbTestForm = () => {
  const [form, setForm] = useState({
    host: '',
    user: '',
    pass: ''
  });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('Sedang menguji koneksi...');

    try {
      const response = await fetch('/tes-db.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(form).toString()
      });

      const text = await response.text();
      setResult(text); // HTML dari tes-db.php
    } catch (error) {
      setResult(`<p style="color: red;">❌ Error: ${error.message}</p>`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>🔧 Uji Koneksi Database</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label} htmlFor="host">Host:</label>
          <input
            type="text"
            id="host"
            name="host"
            value={form.host}
            onChange={handleChange}
            placeholder="localhost atau sql123.epizy.com"
            required
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label} htmlFor="user">Username:</label>
          <input
            type="text"
            id="user"
            name="user"
            value={form.user}
            onChange={handleChange}
            placeholder="Username database"
            required
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label} htmlFor="pass">Password:</label>
          <input
            type="password"
            id="pass"
            name="pass"
            value={form.pass}
            onChange={handleChange}
            placeholder="Password database"
            required
            style={styles.input}
          />
        </div>

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Mengujicoba...' : 'Tes Koneksi'}
        </button>
      </form>

      {result && (
        <div style={styles.result} dangerouslySetInnerHTML={{ __html: result }} />
      )}
    </div>
  );
};

// Gaya sederhana (bisa dipindah ke CSS nanti)
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '500px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  field: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    padding: '8px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    width: '100%',
    boxSizing: 'border-box',
  },
  button: {
    backgroundColor: '#007cba',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '10px',
  },
  result: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  },
};

export default DbTestForm;
