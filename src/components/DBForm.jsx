// src/components/DBForm.jsx
import React, { useState } from 'react';

export default function DBForm() {
  const [form, setForm] = useState({
    host: 'sql210.infinityfree.com',
    user: '',
    pass: '',
  });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('Testing connection...');

    try {
      const res = await fetch('test-db.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setResult(
        data.success
          ? `✅ Connected! MySQL ${data.server_info}`
          : `❌ Failed: ${data.message}`
      );
    } catch (err) {
      setResult(`❌ Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div style={styles.container}>
      <h2>🔧 Test MySQL Connection</h2>
      <form onSubmit={handleSubmit}>
        <Input label="Host" name="host" value={form.host} onChange={handleChange} />
        <Input label="Username" name="user" value={form.user} onChange={handleChange} required />
        <Input label="Password" name="pass" type="password" value={form.pass} onChange={handleChange} />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
      </form>

      {result && (
        <div style={result.includes('✅') ? styles.success : styles.error}>
          <strong>Result:</strong> {result}
        </div>
      )}
    </div>
  );
}

// Komponen Input
function Input({ label, ...props }) {
  return (
    <div style={styles.field}>
      <label>{label}:</label>
      <input style={styles.input} {...props} />
    </div>
  );
}

// Styling sederhana
const styles = {
  container: { padding: '20px', fontFamily: 'Arial, sans-serif' },
  field: { marginBottom: '15px' },
  input: { width: '100%', padding: '8px', boxSizing: 'border-box' },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
  },
  success: { marginTop: '20px', padding: '10px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px' },
  error: { marginTop: '20px', padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px' },
};
