import React, { useState, useEffect } from 'react';

const MySQL = () => {
  const [form, setForm] = useState({
    db_host: '',
    db_user: '',
    db_pass: '',
    db_name: '',
    db_port: '3306',
  });
  const [tables, setTables] = useState([]);
  const [message, setMessage] = useState('');
  const [testing, setTesting] = useState(false);
  const [loadingTables, setLoadingTables] = useState(false);

  useEffect(() => {
    // Load config dari data.json
    fetch('/api/data.php')
      .then(res => res.json())
      .then(data => {
        const db = data.database || {};
        setForm({
          db_host: db.host || 'localhost',
          db_user: db.user || '',
          db_pass: db.pass || '',
          db_name: db.dbname || '',
          db_port: db.port || '3306',
        });
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const testConnection = () => {
    setMessage('Testing...');
    setTesting(true);

    fetch('/api/data.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, action: 'test_db' }),
    })
      .then(res => res.json())
      .then(data => {
        setMessage(data.message);
        if (data.success && data.has_db) {
          loadTables();
        }
      })
      .catch(() => setMessage('Error: Tidak bisa koneksi ke server.'))
      .finally(() => setTesting(false));
  };

  const loadTables = () => {
    setLoadingTables(true);
    fetch('/api/data.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, action: 'get_tables' }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTables(data.tables);
        } else {
          setMessage('Gagal ambil tabel: ' + data.message);
        }
      })
      .finally(() => setLoadingTables(false));
  };

  const saveConfig = () => {
    const payload = {
      ...form,
      action: 'save',
      database: {
        host: form.db_host,
        user: form.db_user,
        pass: form.db_pass,
        dbname: form.db_name,
        port: form.db_port,
      },
    };

    fetch('/api/data.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(data => {
        setMessage(data.message);
        setTimeout(() => setMessage(''), 3000);
      });
  };

  return (
    <div style={styles.container}>
      <h1>Konfigurasi MySQL</h1>
      {message && <p style={styles.message}>{message}</p>}

      <div style={styles.formGroup}>
        <label>Host</label>
        <input name="db_host" value={form.db_host} onChange={handleChange} style={styles.input} />
      </div>

      <div style={styles.formGroup}>
        <label>Port</label>
        <input name="db_port" value={form.db_port} onChange={handleChange} style={styles.input} />
      </div>

      <div style={styles.formGroup}>
        <label>Username</label>
        <input name="db_user" value={form.db_user} onChange={handleChange} style={styles.input} />
      </div>

      <div style={styles.formGroup}>
        <label>Password</label>
        <input
          type="password"
          name="db_pass"
          value={form.db_pass}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label>Database (opsional)</label>
        <input name="db_name" value={form.db_name} onChange={handleChange} style={styles.input} />
      </div>

      <div style={styles.buttonGroup}>
        <button onClick={testConnection} disabled={testing} style={styles.btnTest}>
          {testing ? 'Testing...' : '🔧 Test Koneksi'}
        </button>
        <button onClick={saveConfig} style={styles.btnSave}>
          💾 Simpan Konfigurasi
        </button>
      </div>

      {form.db_name && (
        <div style={styles.section}>
          <h2>Tabel di Database: {form.db_name}</h2>
          <button onClick={loadTables} disabled={loadingTables} style={styles.btnLoad}>
            {loadingTables ? 'Loading...' : '🔁 Muat Tabel'}
          </button>
          <ul style={styles.tableList}>
            {tables.map((table, i) => (
              <li key={i} style={styles.tableItem}>
                📄 {table}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '2rem', maxWidth: '800px', margin: '0 auto' },
  formGroup: { marginBottom: '1rem' },
  input: { width: '100%', padding: '0.7rem', border: '1px solid #ccc', borderRadius: '4px' },
  buttonGroup: { display: 'flex', gap: '1rem', margin: '1.5rem 0' },
  btnTest: { padding: '0.7rem 1rem', backgroundColor: '#ffc107', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  btnSave: { padding: '0.7rem 1rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  btnLoad: { padding: '0.5rem 1rem', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  message: { padding: '1rem', backgroundColor: '#d1ecf1', color: '#0c5460', border: '1px solid #bee5eb', borderRadius: '4px' },
  section: { marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px' },
  tableList: { listStyle: 'none', padding: 0, marginTop: '1rem' },
  tableItem: { padding: '0.5rem', borderBottom: '1px solid #eee' },
};

export default MySQL;