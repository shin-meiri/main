// src/components/DBForm.jsx
import React, { useState } from 'react';

function DBForm() {
  const [form, setForm] = useState({ host: '', user: '', pass: '' });
  const [result, setResult] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult('Testing...');

    try {
      const response = await fetch('/api/test-db.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      setResult(data.success ? `✅ ${data.message}` : `❌ ${data.message}`);
    } catch (err) {
      setResult(`❌ Gagal: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>🔧 Test Koneksi Database</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Host:</label>
          <input
            type="text"
            name="host"
            value={form.host}
            onChange={(e) => setForm({ ...form, host: e.target.value })}
            placeholder="Contoh: sql123.infinityfree.com"
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Username:</label>
          <input
            type="text"
            name="user"
            value={form.user}
            onChange={(e) => setForm({ ...form, user: e.target.value })}
            placeholder="Contoh: if0_12345678"
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Password:</label>
          <input
            type="password"
            name="pass"
            value={form.pass}
            onChange={(e) => setForm({ ...form, pass: e.target.value })}
            placeholder="Password MySQL"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Test Connection
        </button>
      </form>

      {result && (
        <div
          style={{
            marginTop: '20px',
            padding: '10px',
            backgroundColor: result.includes('✅') ? '#d4edda' : '#f8d7da',
            color: result.includes('✅') ? '#155724' : '#721c24',
            borderRadius: '4px',
          }}
        >
          <strong>Hasil:</strong> {result}
        </div>
      )}
    </div>
  );
}

export default DBForm;
