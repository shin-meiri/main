import React, { useState, useEffect } from 'react';

const MySQL = () => {
  // Form state
  const [form, setForm] = useState({
    host: 'localhost',
    user: '',
    pass: '',
    dbname: '',
    port: '3306',
  });

  // Data dari db.json (banyak konfig)
  const [configs, setConfigs] = useState([]);
  const [selectedConfig, setSelectedConfig] = useState(null);

  // Status & loading
  const [status, setStatus] = useState({});
  const [testing, setTesting] = useState(false);
  const [loadingTables, setLoadingTables] = useState(false);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [tableData, setTableData] = useState([]);
  const [message, setMessage] = useState('');

  // Load semua konfig dari db.php (GET)
  useEffect(() => {
    fetch('/api/db.php')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Jika db.json cuma 1 konfig, jadikan array
          const configList = Array.isArray(data.config)
            ? data.config
            : [data.config];
          setConfigs(configList);
          if (configList[0]) {
            const c = configList[0];
            setForm({
              host: c.host || 'localhost',
              user: c.user || '',
              pass: c.pass || '',
              dbname: c.dbname || '',
              port: c.port || '3306',
            });
            setSelectedConfig(c);
          }
        }
      })
      .catch((err) => {
        console.error('Gagal muat konfig:', err);
        setMessage('Gagal muat konfigurasi.');
      });
  }, []);

  // Cek status koneksi untuk satu konfig
  const testConnection = (config, index) => {
    const key = index;
    setStatus((prev) => ({ ...prev, [key]: 'testing' }));
    setTesting(true);

    fetch('/api/db.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...config, action: 'test_db' }),
    })
      .then((res) => res.json())
      .then((data) => {
        setStatus((prev) => ({
          ...prev,
          [key]: data.success ? 'success' : 'error',
        }));
        if (data.success) {
          // Auto-pilih jika sukses
          setSelectedConfig(config);
          setForm(config);
          setMessage('Koneksi berhasil!');
          setTimeout(() => setMessage(''), 2000);
        }
      })
      .catch(() => {
        setStatus((prev) => ({ ...prev, [key]: 'error' }));
      })
      .finally(() => setTesting(false));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveConfig = () => {
    const newConfig = { ...form };
    const exists = configs.findIndex(
      (c) => c.host === newConfig.host && c.user === newConfig.user
    );

    let updated;
    if (exists >= 0) {
      updated = configs.map((c, i) => (i === exists ? newConfig : c));
    } else {
      updated = [...configs, newConfig];
    }

    // Simpan ke server
    fetch('/api/db.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newConfig, action: 'save_config' }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setConfigs(updated);
          setSelectedConfig(newConfig);
          setMessage('Konfigurasi disimpan dan diuji otomatis.');
          testConnection(newConfig, configs.length); // Coba koneksi
        } else {
          setMessage('Gagal simpan: ' + data.message);
        }
        setTimeout(() => setMessage(''), 3000);
      });
  };

  const loadTables = () => {
    if (!selectedConfig?.dbname) {
      setMessage('Pilih database dulu.');
      return;
    }
    setLoadingTables(true);
    setTables([]);
    setSelectedTable('');
    setTableData([]);

    fetch('/api/db.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get_tables' }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTables(data.tables);
          setMessage('Tabel dimuat.');
        } else {
          setMessage('Gagal muat tabel: ' + data.message);
        }
      })
      .catch((err) => {
        setMessage('Error: ' + err.message);
      })
      .finally(() => setLoadingTables(false));
  };

  const viewTable = (table) => {
    setSelectedTable(table);
    setTableData([]);
    setLoadingTables(true);

    fetch('/api/db.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'read_table', table }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTableData(data.data);
        } else {
          setMessage('Gagal baca tabel: ' + data.message);
        }
      })
      .catch((err) => {
        setMessage('Error baca tabel.');
      })
      .finally(() => setLoadingTables(false));
  };

  return (
    <div style={styles.container}>
      <h1>Konfigurasi Database MySQL</h1>
      {message && <p style={styles.message}>{message}</p>}

      {/* Form Input */}
      <div style={styles.form}>
        <div style={styles.row}>
          <input
            name="host"
            placeholder="Host"
            value={form.host}
            onChange={handleInputChange}
            style={styles.input}
          />
          <input
            name="port"
            placeholder="Port"
            value={form.port}
            onChange={handleInputChange}
            style={styles.input}
          />
        </div>
        <div style={styles.row}>
          <input
            name="user"
            placeholder="Username"
            value={form.user}
            onChange={handleInputChange}
            style={styles.input}
          />
          <input
            name="pass"
            type="password"
            placeholder="Password"
            value={form.pass}
            onChange={handleInputChange}
            style={styles.input}
          />
        </div>
        <input
          name="dbname"
          placeholder="Database (opsional)"
          value={form.dbname}
          onChange={handleInputChange}
          style={styles.full}
        />
        <div style={styles.buttonGroup}>
          <button onClick={saveConfig} style={styles.btnSave}>
            💾 Simpan
          </button>
          <button onClick={() => testConnection(form, 'form')} style={styles.btnTest}>
            {testing ? 'Testing...' : '🔧 Test Koneksi'}
          </button>
          <button onClick={loadTables} style={styles.btnLoad}>
            🔄 Muat Tabel
          </button>
        </div>
      </div>

      {/* Tabel Daftar Konfigurasi */}
      <div style={styles.section}>
        <h2>Daftar Koneksi</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>No.</th>
              <th>Host:Port</th>
              <th>User</th>
              <th>Database</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {configs.map((cfg, i) => (
              <tr
                key={i}
                style={
                  selectedConfig === cfg ? styles.rowSelected : undefined
                }
                onClick={() => {
                  setSelectedConfig(cfg);
                  setForm(cfg);
                }}
              >
                <td>{i + 1}</td>
                <td>{cfg.host}:{cfg.port}</td>
                <td>{cfg.user}</td>
                <td>{cfg.dbname || '-'}</td>
                <td>
                  {status[i] === 'testing' ? (
                    '⏳'
                  ) : status[i] === 'success' ? (
                    '🟢'
                  ) : status[i] === 'error' ? (
                    '🔴'
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        testConnection(cfg, i);
                      }}
                      style={styles.btnStatus}
                    >
                      🧪
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dropdown Tabel */}
      {selectedConfig?.dbname && (
        <div style={styles.section}>
          <h2>Pilih Tabel dari Database: <strong>{selectedConfig.dbname}</strong></h2>
          {loadingTables ? (
            <p>Memuat...</p>
          ) : (
            <select
              value={selectedTable}
              onChange={(e) => viewTable(e.target.value)}
              style={styles.select}
            >
              <option value="">-- Pilih Tabel --</option>
              {tables.map((tbl, i) => (
                <option key={i} value={tbl}>
                  {tbl}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Tampilkan Data Tabel */}
      {selectedTable && tableData.length > 0 && (
        <div style={styles.section}>
          <h3>Isi Tabel: <code>{selectedTable}</code> ({tableData.length} baris)</h3>
          <div style={styles.tableContainer}>
            <table style={styles.dataTable}>
              <thead>
                <tr>
                  {Object.keys(tableData[0]).map((key) => (
                    <th key={key} style={styles.th}>
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((val, j) => (
                      <td key={j} style={styles.td}>
                        {String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// === STYLES ===
const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  message: {
    padding: '0.75rem',
    backgroundColor: '#d1ecf1',
    color: '#0c5460',
    border: '1px solid #bee5eb',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  form: {
    backgroundColor: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '2rem',
  },
  row: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
  },
  input: {
    flex: 1,
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  full: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  btnSave: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  btnTest: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#ffc107',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  btnLoad: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  btnStatus: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.2rem',
  },
  section: {
    marginTop: '2rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '0.5rem',
  },
  th: {
    textAlign: 'left',
    padding: '0.75rem',
    borderBottom: '2px solid #ddd',
    backgroundColor: '#f1f1f1',
  },
  td: {
    padding: '0.75rem',
    borderBottom: '1px solid #eee',
  },
  rowSelected: {
    backgroundColor: '#e3f2fd',
    cursor: 'pointer',
  },
  select: {
    padding: '0.75rem',
    width: '100%',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  dataTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
  },
  dataTh: {
    backgroundColor: '#f1f1f1',
    borderBottom: '2px solid #ddd',
    padding: '0.5rem',
    textAlign: 'left',
  },
  dataTd: {
    padding: '0.5rem',
    borderBottom: '1px solid #eee',
  },
};

export default MySQL;