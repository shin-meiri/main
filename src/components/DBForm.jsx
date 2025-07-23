// src/components/DBForm.jsx
import React, { useState } from 'react';

function DBForm() {
  const [form, setForm] = useState({
    host: '',
    user: '',
    pass: '',
    phpUrl: 'https://your-site.rf.gd/api/test-db.php', // 👈 tambah input URL
  });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult('');
    setLoading(true);

    try {
      const res = await fetch(form.phpUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: form.host,
          user: form.user,
          pass: form.pass,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      setResult(
        data.success
          ? `✅ Connected! MySQL: ${data.server_info}`
          : `❌ Failed: ${data.message}`
      );
    } catch (err) {
      setResult(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '600px', margin: '0 auto' }}>
      <h2>🔧 Test MySQL Connection</h2>

      <form onSubmit={handleSubmit}>
        {/* PHP URL Input */}
        <div style={{ marginBottom: '15px' }}>
          <label>🌐 PHP API URL:</label>
          <input
            type="url"
            name="phpUrl"
            value={form.phpUrl}
            onChange={handleChange}
            placeholder="https://yoursite.rf.gd/api/test-db.php"
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        {/* Host */}
        <div style={{ marginBottom: '15px' }}>
          <label>🖥️ Host:</label>
          <input
            type="text"
            name="host"
            value={form.host}
            onChange={handleChange}
            placeholder="e.g. sql123.infinityfree.com"
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        {/* User */}
        <div style={{ marginBottom: '15px' }}>
          <label>👤 Username:</label>
          <input
            type="text"
            name="user"
            value={form.user}
            onChange={handleChange}
            placeholder="if0_xxxxxx"
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: '15px' }}>
          <label>🔑 Password:</label>
          <input
            type="password"
            name="pass"
            value={form.pass}
            onChange={handleChange}
            placeholder="Your MySQL password"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%',
          }}
        >
          {loading ? '🔍 Testing Connection...' : '✅ Test Connection'}
        </button>
      </form>

      {/* Result */}
      {result && (
        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            borderRadius: '4px',
            backgroundColor: result.includes('Connected') ? '#d4edda' : '#f8d7da',
            color: result.includes('Connected') ? '#155724' : '#721c24',
            border: '1px solid #c3e6cb',
            whiteSpace: 'pre-wrap',
          }}
        >
          <strong>📌 Result:</strong> {result}
        </div>
      )}

      {/* Instructions */}
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
        <h3>📝 Troubleshooting:</h3>
        <ul>
          <li>1. Pastikan <code>test-db.php</code> ada di server dan bisa diakses.</li>
          <li>2. Cek URL PHP: buka di tab baru, harus muncul JSON.</li>
          <li>3. Jika 404: file salah path. Jika CORS: lihat console.</li>
          <li>4. InfinityFree kadang "tidur" — buka dulu situs utama agar server aktif.</li>
        </ul>
      </div>
    </div>
  );
}

export default DBForm;
