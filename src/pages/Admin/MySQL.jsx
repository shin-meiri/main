import React, { useState, useEffect } from 'react';

const MySQL = () => {
  const [form, setForm] = useState({
    host: 'localhost',
    user: '',
    pass: '',
    dbname: '',
    port: '3306',
  });
  const [message, setMessage] = useState('');
  const [testing, setTesting] = useState(false);
  const [loadingTables, setLoadingTables] = useState(false);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [tableData, setTableData] = useState([]);

  // Load konfig dari data.json
  useEffect(() => {
    fetch('/api/data.php')
      .then(res => res.json())
      .then(data => {
        const db = data.database || {};
        setForm({
          host: db.host || 'localhost',
          user: db.user || '',
          pass: db.pass || '',
          dbname: db.dbname || '',
          port: db.port || '3306',
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
    fetch('/api/db.php?action=test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(() => setMessage('Error: Tidak bisa hubungi db.php'))
      .finally(() => setTesting(false));
  };

  const loadTables = () => {
    if (!form.dbname) {
      setMessage('Pilih database dulu!');
      return;
    }
    setLoadingTables(true);
    fetch('/api/db.php?action=tables', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTables(data.tables);
        } else {
          setMessage(data.message);
        }
      })
      .finally(() => setLoadingTables(false));
  };

  const loadTableData = (table) => {
    setSelectedTable(table);
    fetch('/api/db.php?action=read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, table }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTableData(data.data);
        }
      });
  };

  const saveConfig = () => {
    const payload = {
      ...form,
      database: {
        host: form.host,
        user: form.user,
        pass: form.pass,
        dbname: form.dbname,
        port: form.port,
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
      <h1>Konfigurasi Database MySQL</h1>
      {message && <p style={styles.message}>{message}</p>}

      <div style={styles.grid}>
        <div style={styles.formGroup}>
          <label>Host</label>
          <input name="host" value={form.host} onChange={handleChange} style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label>Port</label>
          <input name="port" value={form.port} onChange={handleChange} style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label>Username</label>
          <input name="user" value={form.user} onChange={handleChange} style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label>Password</label>
          <input
            type="password"
            name="pass"
            value={form.pass}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Database (opsional)</label>
          <input name="dbname" value={form.dbname} onChange={handleChange} style={styles.input} />
        </div>
      </div>

      <div style={styles.buttonGroup}>
        <button onClick={testConnection} disabled={testing} style={styles.btnTest}>
          {testing ? 'Testing...' : '🔧 Test Koneksi'}
        </button>
        <button onClick={loadTables} disabled={loadingTables} style={styles.btnLoad}>
          {loadingTables ? 'Loading...' : '📋 Muat Tabel'}
        </button>
        <button onClick={saveConfig} style={styles.btnSave}>
          💾 Simpan Konfigurasi
        </button>
      </div>

      {tables.length > 0 && (
        <div style={styles.section}>
          <h2>Daftar Tabel</h2>
          <ul style={styles.tableList}>
            {tables.map((tbl, i) => (
              <li key={i} style={styles.tableItem}>
                <button onClick={() => loadTableData(tbl)} style={styles.tableBtn}>
                  📄 {tbl}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedTable && (
        <div style={styles.section}>
          <h2>Data: {selectedTable}</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                {tableData.length > 0 &&
                  Object.keys(tableData[0]).map((key) => (
                    <th key={key} style={styles.th}>{key}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((val, j) => (
                    <td key={j} style={styles.td}>
                      {String(val).length > 50
                        ? String(val).slice(0, 50) + '...'
                        : String(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '2rem', maxWidth: '1000px', margin: '0 auto' },
  grid: { display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' },
  formGroup: { marginBottom: '1rem' },
  input: { width: '100%', padding: '0.7rem', border: '1px solid #ccc', borderRadius: '4px' },
  buttonGroup: { display: 'flex', gap: '1rem', margin: '1.5rem 0', flexWrap: 'wrap' },
  btnTest: { padding: '0.7rem 1rem', backgroundColor: '#ffc107', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  btnLoad: { padding: '0.7rem 1rem', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  btnSave: { padding: '0.7rem 1rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  message: { padding: '1rem', backgroundColor: '#d1ecf1', color: '#0c5460', border: '1px solid #bee5eb', borderRadius: '4px' },
  section: { marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px' },
  tableList: { listStyle: 'none', padding: 0 },
  tableItem: { marginBottom: '0.5rem' },
  tableBtn: { padding: '0.5rem 1rem', backgroundColor: '#fff', border: '1px solid #ccc', width: '100%', textAlign: 'left', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' },
  th: { border: '1px solid #ddd', padding: '0.5rem', backgroundColor: '#f1f1f1', textAlign: 'left' },
  td: { border: '1px solid #ddd', padding: '0.5rem' },
};

export default MySQL;