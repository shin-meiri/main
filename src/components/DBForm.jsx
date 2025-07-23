import React, { useState } from 'react';

function DBForm() {
  const [form, setForm] = useState({
    host: '',
    user: '',
    pass: '',
  });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('Testing connection...');

    try {
      const res = await fetch('https://bos.free.nf/test-db.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setResult(data.success ? '✅ Connected!' : '❌ Failed: ' + data.message);
    } catch (err) {
      console.error("Fetch error:", err);
      setResult('❌ Error: ' + err.message + ' (' + typeof err.message + ')');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Test MySQL Connection</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Host:</label>
          <input
            type="text"
            name="host"
            value={form.host}
            onChange={handleChange}
            placeholder="localhost or host from InfinityFree"
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Username:</label>
          <input
            type="text"
            name="user"
            value={form.user}
            onChange={handleChange}
            placeholder="Your MySQL username"
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Password:</label>
          <input
            type="password"
            name="pass"
            value={form.pass}
            onChange={handleChange}
            placeholder="Your MySQL password"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
      </form>

      {result && (
        <div
          style={{
            marginTop: '20px',
            padding: '10px',
            backgroundColor: result.includes('Failed') ? '#f8d7da' : '#d4edda',
            color: result.includes('Failed') ? '#721c24' : '#155724',
            borderRadius: '4px',
          }}
        >
          <strong>Result:</strong> {result}
        </div>
      )}
    </div>
  );
}

export default DBForm;
