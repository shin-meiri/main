// src/components/Edit.jsx
import React, { useState, useEffect } from 'react';

const Edit = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [search, setSearch] = useState('');
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({});
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showId, setShowId] = useState(false);

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
      .catch(() => setError('Gagal muat daftar tabel'));
  }, []);

  // Cari data
  useEffect(() => {
    if (!selectedTable) return;
    if (search.trim() === '') {
      setRows([]);
      setForm({});
      setCurrentIndex(-1);
      return;
    }

    setLoading(true);
    fetch(`/crudb.php?tabel=${selectedTable}&search=${encodeURIComponent(search)}`)
      .then(res => res.json())
      .then(data => {
        if (data.data && data.data.length > 0) {
          setRows(data.data);
          setColumns(Object.keys(data.data[0]));
          setForm(data.data[0]);
          setCurrentIndex(0);
          setShowId(true);
        } else {
          setRows([]);
          setForm({});
          setCurrentIndex(-1);
          setShowId(false);
        }
      })
      .catch(() => setError('Gagal cari data'))
      .finally(() => setLoading(false));
  }, [selectedTable, search]);

  const handleRowClick = (row, index) => {
    setForm(row);
    setCurrentIndex(index);
    setShowId(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prev = currentIndex - 1;
      setForm(rows[prev]);
      setCurrentIndex(prev);
    }
  };

  const handleNext = () => {
    if (currentIndex < rows.length - 1) {
      const next = currentIndex + 1;
      setForm(rows[next]);
      setCurrentIndex(next);
    }
  };

  const handleClear = () => {
    setForm({});
    setCurrentIndex(-1);
    setShowId(false);
    setSearch('');
  };

  const handleSave = () => {
    const payload = {
      tabel: selectedTable,
      data: form,
      mode: form.id ? 'update' : 'insert'
    };

    fetch('/crudb.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert(`Data berhasil disimpan! ID: ${data.id}`);
          if (!form.id) {
            setForm({ ...form, id: data.id });
            setShowId(true);
          }
        } else {
          alert('Gagal: ' + data.error);
        }
      })
      .catch(() => alert('Gagal terhubung ke server'));
  };

  const sortedFields = columns
    .filter(k => k !== 'id')
    .sort((a, b) => a.localeCompare(b));

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>✏️ Edit Data</h2>

      <div style={styles.searchSection}>
        <select
          value={selectedTable}
          onChange={(e) => {
            setSelectedTable(e.target.value);
            setSearch('');
            setRows([]);
            setForm({});
            setCurrentIndex(-1);
          }}
          style={styles.select}
        >
          {tables.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <div style={styles.searchBox}>
          <span>🔍</span>
          <input
            type="text"
            placeholder="Cari..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}
      {loading && <div style={styles.loading}>🔍 Mencari...</div>}

      {/* Form Input */}
      <div style={styles.form}>
        {sortedFields.map(field => (
          <div key={field} style={styles.field}>
            <label style={styles.label}>{field}</label>
            <input
              type="text"
              name={field}
              value={form[field] || ''}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
        ))}

        {showId && (
          <div style={styles.field}>
            <label style={styles.label}>id 🔑</label>
            <input
              type="text"
              name="id"
              value={form.id || ''}
              disabled
              style={{ ...styles.input, backgroundColor: '#f0f0f0' }}
            />
          </div>
        )}

        <div style={styles.navButtons}>
          <button onClick={handlePrev} disabled={currentIndex <= 0} style={styles.navBtn}>
            ⬅️
          </button>
          <button onClick={handleNext} disabled={currentIndex >= rows.length - 1} style={styles.navBtn}>
            ➡️
          </button>
          <button onClick={handleClear} style={{ ...styles.navBtn, backgroundColor: '#e74c3c' }}>
            ❌
          </button>
          <button onClick={handleSave} style={{ ...styles.navBtn, backgroundColor: '#27ae60' }}>
            💾
          </button>
        </div>
      </div>

      {/* Tabel Hasil Pencarian */}
      {rows.length > 0 && (
        <div style={styles.resultTable}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['id', ...sortedFields].map(col => (
                  <th key={col} style={styles.th}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} onClick={() => handleRowClick(row, i)} style={styles.tr}>
                  {['id', ...sortedFields].map(col => (
                    <td key={col} style={styles.td}>{row[col]}</td>
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
  container: { padding: '20px', fontFamily: 'Arial, sans-serif' },
  title: { textAlign: 'center', color: '#2c3e50' },
  searchSection: { display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center' },
  select: { padding: '10px', borderRadius: '6px', border: '1px solid #ccc', flex: 1 },
  searchBox: { display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '6px', overflow: 'hidden', flex: 1 },
  searchInput: { border: 'none', outline: 'none', padding: '8px', fontSize: '16px', flex: 1 },
  error: { color: 'red', textAlign: 'center' },
  loading: { textAlign: 'center', color: '#777' },
  form: { marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' },
  field: { display: 'flex', flexDirection: 'column' },
  label: { fontSize: '14px', fontWeight: 'bold', color: '#555' },
  input: { padding: '10px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '4px' },
  navButtons: { display: 'flex', gap: '10px', marginTop: '10px' },
  navBtn: { padding: '10px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', color: 'white' },
  resultTable: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
  th: { backgroundColor: '#3498db', color: 'white', padding: '10px', textAlign: 'left' },
  tr: { cursor: 'pointer' },
  trHover: { backgroundColor: '#f0f0f0' },
  td: { padding: '8px', border: '1px solid #eee' }
};

export default Edit;
