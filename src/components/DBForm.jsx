// src/components/DBForm.jsx
import React, { useState } from 'react';

function DBForm() {
  const [form, setForm] = useState({
    host: '',
    user: '',
    pass: '',
    endpoint: 'https://your-site.rf.gd/api/test-db.php', // 👈 Input URL
  });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [debug, setDebug] = useState(''); // Info tambahan

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');
    setDebug('');

    // Validasi URL
    if (!form.endpoint.startsWith('http')) {
      setResult('❌ URL endpoint harus dimulai dengan http:// atau https://');
      setLoading(false);
      return;
    }

    try {
      setDebug('🔍 Mengirim request ke: ' + form.endpoint);

      const res = await fetch(form.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          host: form.host,
          user: form.user,
          pass: form.pass,
        }),
        mode: 'cors', // 👈 Penting untuk CORS
      });

      setDebug(prev => prev + '\n📡 Status HTTP: ' + res.status);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      setDebug(prev => prev + '\n📥 Data dari server: ' + JSON.stringify(data));

      if (data.success) {
        setResult('✅ Connected! ' + (data.server_info ? `MySQL ${data.server_info}` : ''));
      } else {
        setResult('❌ Gagal: ' + (data.message || data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setResult(`❌ Error: ${err.message}`);
      setDebug(prev => prev + '\n🔥 Error: ' + err.message);

      // Detail tambahan
      if (err.message.includes('Failed to fetch')) {
        setDebug(prev => prev + '\n💡 Kemungkinan: URL salah, CORS, atau server mati');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '600px', margin: '0 auto' }}>
      <h2>🔧 Test MySQL Connection</h2>
      <p style={{ fontSize: '0.9em', color: '#666' }}>
        Isi form dan uji koneksi ke database MySQL via PHP di server.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Input Endpoint */}
        <div style={{ marginBottom: '15px' }}>
          <label>🌐 PHP Endpoint URL:</label>
          <input
            type="url"
            name="endpoint"
            value={form.endpoint}
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
            placeholder="Contoh: sql123.infinityfree.com"
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
            placeholder="Contoh: if0_xxxxxx"
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
            placeholder="Masukkan password"
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
            padding: '12px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
          }}
        >
          {loading ? '📡 Testing...' : '✅ Test Connection'}
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
            border: '1px solid',
            borderColor: result.includes('Connected') ? '#c3e6cb' : '#f5c6cb',
          }}
        >
          <strong>📌 Hasil:</strong> {result}
        </div>
      )}

      {/* Debug Info */}
      {debug && (
        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            fontSize: '0.9em',
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            whiteSpace: 'pre-wrap',
            color: '#495057',
          }}
        >
          <strong>🔧 Debug Info:</strong>
          <br />
          {debug}
        </div>
      )}
    </div>
  );
}

export default DBForm;
