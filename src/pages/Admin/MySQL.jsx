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

  // Daftar konfigurasi
  const [configs, setConfigs] = useState([]);
  const [selectedConfig, setSelectedConfig] = useState(null);

  // Tabel & data
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Load konfig dari db.php
  useEffect(() => {
    fetch('/api/db.php')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const list = Array.isArray(data.config) ? data.config : [data.config];
          setConfigs(list);
          if (list[0]) {
            const c = list[0];
            setForm(c);
            setSelectedConfig(c);
          }
        }
      })
      .catch(() => setMessage('Gagal muat konfigurasi.'));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Simpan konfigurasi baru
  const saveConfig = () => {
    const newConfig = { ...form };
    const exists = configs.findIndex(
      (c) => c.host === newConfig.host && c.user === newConfig.user
    );

    const updated = exists >= 0
      ? configs.map((c, i) => (i === exists ? newConfig : c))
      : [...configs, newConfig];

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
          setMessage('Konfigurasi disimpan.');
        } else {
          setMessage('Gagal simpan: ' + data.message);
        }
        setTimeout(() => setMessage(''), 3000);
      });
  };

  // Hapus konfigurasi
  const deleteConfig = (index) => {
    const updated = configs.filter((_, i) => i !== index);
    const isCurrent = selectedConfig === configs[index];

    // Simpan ke server (pakai yang tersisa)
    fetch('/api/db.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'save_config',
        ...updated[0] || { host: 'localhost', user: '', pass: '', dbname: '', port: '3306' }
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success || updated.length === 0) {
          setConfigs(updated);
          if (isCurrent) {
            const fallback = updated[0] || {
              host: 'localhost',
              user: '',
              pass: '',
              dbname: '',
              port: '3306',
            };
            setForm(fallback);
            setSelectedConfig(fallback);
          }
          setMessage('Konfigurasi dihapus.');
          setTimeout(() => setMessage(''), 3000);
        }
      });
  };

  // Muat daftar tabel
  const loadTables = () => {
    if (!selectedConfig?.dbname) {
      setMessage('Pilih database dulu.');
      return;
    }
    setLoading(true);
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
          setMessage(`Ditemukan ${data.tables.length} tabel.`);
        } else {
          setMessage('Gagal muat tabel: ' + data.message);
        }
      })
      .catch(() => setMessage('Error koneksi.'))
      .finally(() => setLoading(false));
  };

  // Baca isi tabel
  const viewTable = (table) => {
    setSelectedTable(table);
    setTableData([]);
    setLoading(true);

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
      .finally(() => setLoading(false));
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
              <th>Aksi</th>
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
                <td>{cfg.host}:{cfg.port}</td>
                <td>{cfg.user}</td>
                <td>{cfg.dbname || '-'}</td>
                <td>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Hapus koneksi ke ${cfg.host} (${cfg.user})?`))
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

      {/* Dropdown Tabel */}
      {selectedConfig?.dbname && (
        <div style={styles.section}>
          <h2>Database: <strong>{selectedConfig.dbname}</strong></h2>
          {loading ? (
            <p>Memuat tabel...</p>
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
  btnLoad: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  btnDelete: {
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