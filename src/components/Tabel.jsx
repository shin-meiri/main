import React, { useState, useEffect } from 'react';

const Tabel = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [tableData, setTableData] = useState({ columns: [], data: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Ambil daftar tabel
  useEffect(() => {
    fetch('/crudb.php?tables=true')
      .then(res => res.json())
      .then(data => {
        if (data.tables) {
          setTables(data.tables);
          if (data.tables.length > 0) {
            setSelectedTable(data.tables[0]);
          }
        }
      })
      .catch(() => setError('Gagal ambil daftar tabel'));
  }, []);

  // Ambil data tabel saat dipilih
  useEffect(() => {
    if (!selectedTable) return;

    setLoading(true);
    setError('');
    fetch(`/crudb.php?tabel=${encodeURIComponent(selectedTable)}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setTableData(data);
        }
      })
      .catch(() => setError('Gagal muat data tabel'))
      .finally(() => setLoading(false));
  }, [selectedTable]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📊 Isi Database</h2>

      {error && <div style={styles.error}>❌ {error}</div>}

      <div style={styles.selector}>
        <label style={styles.label}>Pilih Tabel: </label>
        <select
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
          style={styles.select}
        >
          {tables.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {loading && (
        <div style={styles.loading}>🔍 Sedang memuat data...</div>
      )}

      {!loading && tableData.columns.length > 0 && (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                {tableData.columns.map(col => (
                  <th key={col} style={styles.th}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.data.length === 0 ? (
                <tr>
                  <td colSpan={tableData.columns.length} style={styles.empty}>
                    📭 Tidak ada data
                  </td>
                </tr>
              ) : (
                tableData.data.map((row, i) => (
                  <tr key={i} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                    {tableData.columns.map(col => (
                      <td key={col} style={styles.td}>
                        {row[col] === null ? 'NULL' : String(row[col])}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <div style={styles.footer}>
        📎 Menampilkan {tableData.data.length} baris dari tabel <strong>{selectedTable}</strong>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Segoe UI, Arial, sans-serif',
    color: '#2c3e50'
  },
  title: {
    textAlign: 'center',
    color: '#2980b9',
    fontSize: '1.8em',
    marginBottom: '20px'
  },
  selector: {
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  label: {
    fontWeight: 'bold',
    fontSize: '16px'
  },
  select: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #bdc3c7',
    flex: 1
  },
  loading: {
    textAlign: 'center',
    padding: '30px',
    fontSize: '18px',
    color: '#7f8c8d'
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '15px',
    borderRadius: '6px',
    marginBottom: '20px',
    textAlign: 'center'
  },
  tableWrapper: {
    overflowX: 'auto',
    maxHeight: '60vh',
    border: '1px solid #bdc3c7',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '600px'
  },
  th: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '12px 15px',
    textAlign: 'left',
    position: 'sticky',
    top: 0,
    zIndex: 1
  },
  td: {
    padding: '10px 12px',
    border: '1px solid #ecf0f1',
    backgroundColor: '#fff'
  },
  rowEven: {
    backgroundColor: '#f8f9fa'
  },
  rowOdd: {
    backgroundColor: '#ffffff'
  },
  empty: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#95a5a6',
    padding: '30px'
  },
  footer: {
    marginTop: '15px',
    fontSize: '14px',
    color: '#7f8c8d',
    textAlign: 'center'
  }
};

export default Tabel;
