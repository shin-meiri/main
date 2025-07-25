import React, { useState, useEffect } from 'react';

const MySQL = () => {
  const [form, setForm] = useState({
    host: 'localhost',
    user: '',
    pass: '',
    dbname: '',
    port: '3306',
  });

  const [configs, setConfigs] = useState([]);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [status, setStatus] = useState({});
  const [message, setMessage] = useState('');
  const [loadingTables, setLoadingTables] = useState(false);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [tableData, setTableData] = useState([]);

  // Load konfig dari db.php
  useEffect(() => {
    fetch('/api/db.php')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const configList = Array.isArray(data.config) ? data.config : [data.config];
          setConfigs(configList);
          if (configList[0]) {
            const c = configList[0];
            setForm(c);
            setSelectedConfig(c);
            // Auto test koneksi pertama
            testConnection(c, 0);
          }
        }
      })
      .catch(() => setMessage('Gagal muat konfigurasi.'));
  }, []);

  // Simpan konfig baru
  const saveConfig = () => {
    const newConfig = { ...form };
    const exists = configs.findIndex(
      (c) => c.host === newConfig.host && c.user === newConfig.user && c.dbname === newConfig.dbname
    );

    if (exists >= 0) {
      setMessage('Konfigurasi ini sudah ada.');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    const updated = [...configs, newConfig];
    fetch('/api/db.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newConfig, action: 'save_config' }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setConfigs(updated);
          setForm({
            host: 'localhost',
            user: '',
            pass: '',
            dbname: '',
            port: '3306',
          });
          setMessage('Konfigurasi berhasil ditambahkan.');
          testConnection(newConfig, updated.length - 1);
        } else {
          setMessage('Simpan gagal: ' + data.message);
        }
        setTimeout(() => setMessage(''), 3000);
      });
  };

  // Test koneksi (untuk auto status)
  const testConnection = (config, index) => {
    setStatus((prev) => ({ ...prev, [index]: 'testing' }));

    fetch('/api/db.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...config, action: 'test_db' }),
    })
      .then((res) => res.json())
      .then((data) => {
        setStatus((prev) => ({
          ...prev,
          [index]: data.success ? 'success' : 'error',
        }));
      })
      .catch(() => {
        setStatus((prev) => ({ ...prev, [index]: 'error' }));
      });
  };

  // Hapus konfigurasi
  const deleteConfig = (index) => {
    const updated = configs.filter((_, i) => i !== index);
    const newConfig = updated.length > 0 ? updated[0] : null;

    // Simpan ke server (overwrite db.json)
    fetch('/api/db.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...(newConfig || {}),
        action: 'save_config',
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setConfigs(updated);
        setSelectedConfig(newConfig);
        setStatus({});
        setTables([]);
        setSelectedTable('');
        setTableData([]);

        if (newConfig) {
          setForm(newConfig);
          testConnection(newConfig, 0);
        } else {
          setForm({
            host: 'localhost',
            user: '',
            pass: '',
            dbname: '',
            port: '3306',
          });
        }

        setMessage('Konfigurasi dihapus.');
        setTimeout(() => setMessage(''), 2000);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
      .catch(() => setMessage('Gagal ambil tabel.'))
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
          setMessage('Gagal baca tabel.');
        }
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
          placeholder="Database"
          value={form.dbname}
          onChange={handleInputChange}
          style={styles.full}
        />
        <button onClick={saveConfig} style={styles.btnSave}>
          ➕ Tambah
        </button>
      </div>

      {/* Tabel Konfigurasi */}
      {configs.length > 0 && (
        <div style={styles.section}>
          <h2>Daftar Koneksi</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>No</th>
                <th>Database</th>
                <th>Status</th>
                <th>Hapus</th>
              </tr>
            </thead>
            <tbody>
              {configs.map((cfg, i) => (
                <tr
                  key={i}
                  style={selectedConfig === cfg ? styles.rowSelected : undefined}
                  onClick={() => {
                    setSelectedConfig(cfg);
                    setForm(cfg);
                  }}
                >
                  <td>{i + 1}</td>
                  <td>{cfg.dbname || '-'}</td>
                  <td>
                    {status[i] === 'testing'
                      ? '⏳'
                      : status[i] === 'success'
                      ? '🟢'
                      : '🔴'}
                  </td>
                  <td>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Hapus koneksi ke "${cfg.dbname || cfg.host}"?`))
                          deleteConfig(i);
                      }}
                      style={styles.btnDelete}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Dropdown Tabel */}
      {selectedConfig?.dbname && (
        <div style={styles.section}>
          <h2>Database: <strong>{selectedConfig.dbname}</strong></h2>
          <button onClick={loadTables} style={styles.btnLoad}>
            🔄 Muat Tabel
          </button>

          {loadingTables ? (
            <p>Memuat tabel...</p>
          ) : (
            tables.length > 0 && (
              <select
                value={selectedTable}
                onChange={(e) => viewTable(e.target.value)}
                style={styles.select}
              >
                <option value="">-- Pilih Tabel --</option>
                {tables.map((tbl, idx) => (
                  <option key={idx} value={tbl}>
                    {tbl}
                  </option>
                ))}
              </select>
            )
          )}
        </div>
      )}

      {/* Tampilkan Data */}
      {selectedTable && tableData.length > 0 && (
        <div style={styles.section}>
          <h3>Tabel: <code>{selectedTable}</code> ({tableData.length} baris)</h3>
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
    maxWidth: '900px',
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
  btnSave: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
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
    textAlign: 'center',
  },
  rowSelected: {
    backgroundColor: '#e3f2fd',
    cursor: 'pointer',
  },
  btnDelete: {
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    color: '#dc3545',
  },
  btnLoad: {
    padding: '0.5rem 1rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  select: {
    padding: '0.75rem',
    width: '100%',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    marginTop: '1rem',
  },
  tableContainer: {
    overflowX: 'auto',
    marginTop: '1rem',
  },
  dataTable: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    backgroundColor: '#f1f1f1',
    borderBottom: '2px solid #ddd',
    padding: '0.5rem',
    textAlign: 'left',
  },
  td: {
    padding: '0.5rem',
    borderBottom: '1px solid #eee',
  },
};

export default MySQL;