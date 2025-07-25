import React, { useState, useEffect } from 'react';

const MySQL = () => {
  const [form, setForm] = useState({
    host: 'localhost',
    port: '3306',
    user: '',
    pass: '',
    dbname: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');

  // 🔹 1. Load konfigurasi dari db.php saat komponen mount
  useEffect(() => {
    const loadConfig = () => {
      fetch('/api/db.php') // GET request → ambil konfig
        .then((res) => {
          if (!res.ok) throw new Error('Gagal muat respons');
          return res.json();
        })
        .then((data) => {
          if (data.success && data.config) {
            const config = data.config;
            setForm({
              host: config.host || 'localhost',
              port: config.port || '3306',
              user: config.user || '',
              pass: config.pass || '',
              dbname: config.dbname || '',
            });
          }
          setMessage('');
        })
        .catch((err) => {
          setMessage('⚠️ Gagal muat konfigurasi DB.');
          console.error(err);
        });
    };

    loadConfig();
  }, []);

  // 🔹 2. Handle perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Reset status koneksi jika form berubah
    setConnected(false);
    setTables([]);
    setSelectedTable('');
  };

  // 🔹 3. Simpan konfigurasi ke db.php
  const handleSave = () => {
    setMessage('Menyimpan konfigurasi...');
    setLoading(true);

    fetch('/api/db.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, action: 'save_config' }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessage('✅ Konfigurasi berhasil disimpan!');
        } else {
          setMessage('❌ Simpan gagal: ' + (data.message || 'Unknown'));
        }
      })
      .catch((err) => {
        setMessage('❌ Error: Tidak bisa simpan.');
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => setMessage(''), 3000);
      });
  };

  // 🔹 4. Test koneksi ke database
  const handleTest = () => {
    setMessage('Menguji koneksi...');
    setTesting(true);
    setConnected(false);
    setTables([]);
    setSelectedTable('');

    fetch('/api/db.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'test_db' }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessage('✔️ Koneksi berhasil!');
          setConnected(true);
          // Muat tabel jika ada dbname
          if (form.dbname) {
            loadTables();
          }
        } else {
          setMessage('❌ Koneksi gagal: ' + data.message);
        }
      })
      .catch((err) => {
        setMessage('❌ Error koneksi: ' + err.message);
        console.error(err);
      })
      .finally(() => {
        setTesting(false);
      });
  };

  // 🔹 5. Muat daftar tabel
  const loadTables = () => {
    fetch('/api/db.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get_tables' }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTables(data.tables);
          if (data.tables.length > 0) {
            setSelectedTable(data.tables[0]); // default pilih tabel pertama
          }
        } else {
          setMessage('⚠️ Gagal ambil tabel: ' + data.message);
        }
      })
      .catch((err) => {
        setMessage('❌ Gagal ambil tabel.');
        console.error(err);
      });
  };

  // 🔹 6. Handle pilih tabel dari dropdown
  const handleSelectTable = (e) => {
    const table = e.target.value;
    setSelectedTable(table);
  };

  return (
    <div style={styles.container}>
      <h1>🔧 Konfigurasi Database</h1>

      {/* Status Message */}
      {message && <div style={styles.message}>{message}</div>}

      {/* Form Input */}
      <div style={styles.form}>
        <div style={styles.row}>
          <input
            name="host"
            placeholder="Host"
            value={form.host}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            name="port"
            placeholder="Port"
            value={form.port}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.row}>
          <input
            name="user"
            placeholder="Username"
            value={form.user}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            name="pass"
            type="password"
            placeholder="Password"
            value={form.pass}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <input
          name="dbname"
          placeholder="Database (opsional)"
          value={form.dbname}
          onChange={handleChange}
          style={styles.full}
        />
      </div>

      {/* Buttons */}
      <div style={styles.buttonGroup}>
        <button
          onClick={handleSave}
          disabled={loading}
          style={loading ? { ...styles.btn, opacity: 0.6 } : styles.btn}
        >
          {loading ? 'Menyimpan...' : '💾 Simpan Konfig'}
        </button>
        <button
          onClick={handleTest}
          disabled={testing}
          style={testing ? { ...styles.btnPrimary, opacity: 0.6 } : styles.btnPrimary}
        >
          {testing ? 'Testing...' : '🔍 Test Koneksi'}
        </button>
      </div>

      {/* Connection Status */}
      {connected && (
        <div style={styles.status}>
          <span style={styles.dot} title="Connected">🟢</span>
          Terhubung ke <strong>{form.dbname || 'server'}</strong>
        </div>
      )}

      {/* Tabel Dropdown */}
      {connected && form.dbname && (
        <div style={styles.section}>
          <h2>📁 Pilih Tabel</h2>
          {tables.length === 0 ? (
            <p>Belum ada tabel. Klik "Test Koneksi" lagi untuk muat.</p>
          ) : (
            <select value={selectedTable} onChange={handleSelectTable} style={styles.select}>
              {tables.map((table, i) => (
                <option key={i} value={table}>
                  {table}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Info Tabel Terpilih */}
      {selectedTable && (
        <div style={styles.info}>
          <p>
            <strong>Tabel aktif:</strong> <code>{selectedTable}</code>
          </p>
        </div>
      )}
    </div>
  );
};

// ✅ Styles
const styles = {
  container: {
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  },
  message: {
    padding: '0.75rem',
    marginBottom: '1rem',
    borderRadius: '6px',
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    fontSize: '0.95rem',
    border: '1px solid #bbdefb',
  },
  form: {
    marginBottom: '1.5rem',
  },
  row: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
  },
  input: {
    flex: 1,
    padding: '0.75rem',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '1rem',
  },
  full: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '1rem',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  },
  btn: {
    padding: '0.75rem 1.25rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  btnPrimary: {
    padding: '0.75rem 1.25rem',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem',
    backgroundColor: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb',
    borderRadius: '6px',
    marginBottom: '1.5rem',
    fontSize: '1rem',
  },
  dot: {
    fontSize: '1.2rem',
  },
  section: {
    marginBottom: '1.5rem',
  },
  select: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '1rem',
    backgroundColor: 'white',
  },
  info: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    border: '1px solid #dee2e6',
    borderRadius: '6px',
    fontSize: '0.95rem',
  },
};

export default MySQL;