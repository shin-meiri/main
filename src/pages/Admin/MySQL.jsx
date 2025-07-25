import React, { useState, useEffect } from 'react';

const MySQL = () => {
  // Form konfigurasi
  const [form, setForm] = useState({
    host: 'localhost',
    port: '3306',
    user: '',
    pass: '',
    dbname: '',
  });

  const [tables, setTables] = useState([]);        // Daftar tabel
  const [message, setMessage] = useState('');      // Status message
  const [testing, setTesting] = useState(false);   // Loading test
  const [saving, setSaving] = useState(false);     // Loading save
  const [loadingTables, setLoadingTables] = useState(false); // Loading tabel

  // Load konfigurasi saat komponen mount
  useEffect(() => {
    const fetchConfig = () => {
      fetch('/api/db.php') // GET request ke db.php
        .then((res) => {
          if (!res.ok) throw new Error('Gagal muat konfigurasi');
          return res.json();
        })
        .then((data) => {
          if (data.success && data.config) {
            setForm(data.config); // Isi form dengan konfig dari db.php
          }
        })
        .catch((err) => {
          setMessage('⚠️ Tidak bisa muat konfigurasi: ' + err.message);
          console.error(err);
        });
    };

    fetchConfig();
  }, []);

  // Handler: Ubah input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handler: Simpan konfigurasi ke db.php
  const handleSave = () => {
    setMessage('Menyimpan konfigurasi...');
    setSaving(true);

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
          setMessage('❌ Gagal simpan: ' + (data.message || 'Unknown error'));
        }
        setTimeout(() => setMessage(''), 5000);
      })
      .catch((err) => {
        setMessage('❌ Error: Tidak bisa menyimpan.');
        console.error(err);
      })
      .finally(() => setSaving(false));
  };

  // Handler: Test koneksi ke MySQL
  const handleTest = () => {
    setMessage('Sedang menguji koneksi...');
    setTesting(true);

    fetch('/api/db.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, action: 'test_db' }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessage('✅ ' + data.message);
          // Simpan otomatis jika sukses
          handleSave();
        } else {
          setMessage('❌ ' + data.message);
        }
      })
      .catch((err) => {
        setMessage('❌ Koneksi gagal: ' + err.message);
      })
      .finally(() => setTesting(false));
  };

  // Handler: Muat daftar tabel
  const loadTables = () => {
    if (!form.dbname) {
      setMessage('⚠️ Pilih database terlebih dahulu.');
      return;
    }

    setLoadingTables(true);
    setMessage('Memuat daftar tabel...');

    fetch('/api/db.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get_tables' }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTables(data.tables);
          setMessage(`✅ ${data.tables.length} tabel ditemukan.`);
        } else {
          setMessage('❌ Gagal muat tabel: ' + data.message);
        }
      })
      .catch((err) => {
        setMessage('❌ Error: Tidak bisa ambil tabel.');
        console.error(err);
      })
      .finally(() => setLoadingTables(false));
  };

  return (
    <div style={styles.container}>
      <h1>🔧 Konfigurasi Database MySQL</h1>

      {/* Status Message */}
      {message && <div style={styles.message}>{message}</div>}

      {/* Form Input */}
      <div style={styles.form}>
        <div style={styles.row}>
          <div style={styles.col}>
            <label>Host</label>
            <input
              type="text"
              name="host"
              value={form.host}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.col}>
            <label>Port</label>
            <input
              type="text"
              name="port"
              value={form.port}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.col}>
            <label>Username</label>
            <input
              type="text"
              name="user"
              value={form.user}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.col}>
            <label>Password</label>
            <input
              type="password"
              name="pass"
              value={form.pass}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.col}>
            <label>Database (Opsional)</label>
            <input
              type="text"
              name="dbname"
              value={form.dbname}
              onChange={handleChange}
              placeholder="Nama database (opsional)"
              style={styles.input}
            />
          </div>
        </div>

        {/* Buttons */}
        <div style={styles.buttonGroup}>
          <button
            onClick={handleTest}
            disabled={testing}
            style={testing ? { ...styles.btn, opacity: 0.7 } : styles.btn}
          >
            {testing ? '🔧 Testing...' : '🔧 Test Koneksi'}
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            style={saving ? { ...styles.btnSave, opacity: 0.7 } : styles.btnSave}
          >
            {saving ? 'Menyimpan...' : '💾 Simpan Konfigurasi'}
          </button>

          <button
            onClick={loadTables}
            disabled={loadingTables || !form.dbname}
            style={
              loadingTables || !form.dbname
                ? { ...styles.btnLoad, opacity: 0.7 }
                : styles.btnLoad
            }
          >
            {loadingTables ? 'Loading...' : '📊 Muat Tabel'}
          </button>
        </div>
      </div>

      {/* Dropdown Tabel */}
      {tables.length > 0 && (
        <div style={styles.section}>
          <h2>📋 Daftar Tabel di Database: <strong>{form.dbname}</strong></h2>
          <select
            style={styles.select}
            onChange={(e) => {
              const table = e.target.value;
              if (table) alert(`Anda memilih tabel: ${table}`);
              // Di sini bisa tambah fungsi baca data tabel
            }}
          >
            <option value="">Pilih tabel untuk dilihat</option>
            {tables.map((table, i) => (
              <option key={i} value={table}>
                {table}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

// === STYLES ===
const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  message: {
    padding: '1rem',
    marginBottom: '1.5rem',
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    border: '1px solid #bbdefb',
    borderRadius: '6px',
    fontSize: '0.95rem',
  },
  form: {
    backgroundColor: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid #e9ecef',
  },
  row: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
  },
  col: {
    flex: 1,
  },
  input: {
    width: '100%',
    padding: '0.7rem',
    border: '1px solid #ced4da',
    borderRadius: '6px',
    fontSize: '1rem',
    boxSizing: 'border-box',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem',
    flexWrap: 'wrap',
  },
  btn: {
    padding: '0.7rem 1.2rem',
    backgroundColor: '#ffc107',
    color: '#000',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
  btnSave: {
    padding: '0.7rem 1.2rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
  btnLoad: {
    padding: '0.7rem 1.2rem',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
  section: {
    marginTop: '2rem',
    padding: '1.5rem',
    backgroundColor: '#f1f3f5',
    borderRadius: '8px',
    border: '1px solid #e9ecef',
  },
  select: {
    width: '100%',
    padding: '0.7rem',
    border: '1px solid #ced4da',
    borderRadius: '6px',
    fontSize: '1rem',
    backgroundColor: 'white',
  },
};

export default MySQL;