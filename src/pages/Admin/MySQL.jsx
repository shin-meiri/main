import React, { useState, useEffect } from 'react';

const MySQL = () => {
  const [form, setForm] = useState({
    host: 'localhost',
    user: '',
    pass: '',
    dbname: '',
    port: '3306',
  });
  const [tables, setTables] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [message, setMessage] = useState('');
  const [testing, setTesting] = useState(false);
  const [loadingTables, setLoadingTables] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // Load config dari session (jika ada)
  useEffect(() => {
    fetch('/api/db.php')
      .then(res => res.json())
      .catch(() => {
        // Error = belum ada session → abaikan
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const saveConfig = () => {
    setMessage('Menyimpan konfigurasi...');
    fetch('/api/db.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, action: 'save_config' }),
    })
      .then(res => res.json())
      .then(data => {
        setMessage(data.message || 'Konfigurasi disimpan.');
        setTimeout(() => setMessage(''), 3000);
      });
  };

  const testConnection = () => {
    setTesting(true);
    setMessage('Testing koneksi...');
    fetch('/api/db.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, action: 'test_db' }),
    })
      .then(res => res.json())
      .then(data => {
        setMessage(data.message);
        if (data.success) {
          saveConfig(); // Simpan jika berhasil
        }
      })
      .finally(() => setTesting(false));
  };

  const loadTables = () => {
    setLoadingTables(true);
    fetch('/api/db.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get_tables' }),
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

  const viewTable = (table) => {
    setSelectedTable(table);
    setLoadingData(true);
    setTableData([]);
    fetch('/api/db.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'read_table', table }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTableData(data.data);
        } else {
          setMessage(data.message);
        }
      })
      .finally(() => setLoadingData(false));
  };

  return (
    <div style={styles.container}>
      <h1>Konfigurasi MySQL & CRUD</h1>
      {message && <p style={styles.message}>{message}</p>}

      <div style={styles.grid}>
        <input name="host" placeholder="Host" value={form.host} onChange={handleChange} style={styles.input} />
        <input name="port" placeholder="Port" value={form.port} onChange={handleChange} style={styles.input} />
        <input name="user" placeholder="Username" value={form.user} onChange={handleChange} style={styles.input} />
        <input
          type="password"
          name="pass"
          placeholder="Password"
          value={form.pass}
          onChange={handleChange}
          style={styles.input}
        />
        <input name="dbname" placeholder="Database (opsional)" value={form.dbname} onChange={handleChange} style={styles.input} />
      </div>

      <div style={styles.buttonGroup}>
        <button onClick={testConnection} disabled={testing} style={styles.btnTest}>
          {testing ? 'Testing...' : '🔧 Test Koneksi'}
        </button>
        <button onClick={saveConfig} style={styles.btnSave}>💾 Simpan Konfig</button>
        <button onClick={loadTables} disabled={loadingTables} style={styles.btnLoad}>
          {loadingTables ? 'Loading...' : '📊 Muat Tabel'}
        </button>
      </div>

      <div style={styles.section}>
        <h2>Tabel</h2>
        <ul style={styles.tableList}>
          {tables.length === 0 ? (
            <li style={styles.tableItem}>Belum ada tabel</li>
          ) : (
            tables.map((table, i) => (
              <li key={i} style={styles.tableItem}>
                <button onClick={() => viewTable(table)} style={styles.tableBtn}>
                  📄 {table}
                </button>
              </li>
            ))
          )}
        </ul>
      </div>

      {selectedTable && (
        <div style={styles.section}>
          <h2>Isi Tabel: <code>{selectedTable}</code> ({tableData.length} baris)</h2>
          {loadingData ? (
            <p>Memuat data...</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  {tableData[0] && Object.keys(tableData[0]).map(key => (
                    <th key={key} style={styles.th}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((val, j) => (
                      <td key={j} style={styles.td}>{String(val)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '2rem', maxWidth: '1000px', margin: '0 auto' },
  grid: { display: 'grid', gap: '0.5rem', gridTemplateColumns: '1fr 1fr', marginBottom: '1rem' },
  input: { padding: '0.7rem', border: '1px solid #ccc', borderRadius: '4px' },
  buttonGroup: { display: 'flex', gap: '1rem', flexWrap: 'wrap', margin: '1.5rem 0' },
  btnTest: { padding: '0.7rem', backgroundColor: '#ffc107', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  btnSave: { padding: '0.7rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  btnLoad: { padding: '0.7rem', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  message: { padding: '1rem', backgroundColor: '#d1ecf1', color: '#0c5460', border: '1px solid #bee5eb', borderRadius: '4px' },
  section: { marginTop: '2rem' },
  tableList: { listStyle: 'none', padding: 0 },
  tableItem: { margin: '0.5rem 0' },
  tableBtn: { padding: '0.5rem 1rem', backgroundColor: '#f8f9fa', border: '1px solid #ddd', width: '100%', textAlign: 'left', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' },
  th: { textAlign: 'left', borderBottom: '2px solid #ddd', padding: '0.5rem', backgroundColor: '#f1f1f1' },
  td: { borderBottom: '1px solid #eee', padding: '0.5rem' },
};

export default MySQL;