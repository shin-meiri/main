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

  useEffect(() => {
    fetch('/crudb.php?tables=true')
      .then(r => r.json())
      .then(d => {
        if (d.tables?.length) {
          setTables(d.tables);
          if (!selectedTable) setSelectedTable(d.tables[0]);
        }
      })
      .catch(() => setError('Gagal muat tabel'));
  }, [selectedTable]);

  useEffect(() => {
    if (!selectedTable || !search.trim()) {
      setRows([]);
      setForm({});
      setCurrentIndex(-1);
      return;
    }
    setLoading(true);
    fetch(`/crudb.php?tabel=${selectedTable}&search=${encodeURIComponent(search)}`)
      .then(r => r.json())
      .then(d => {
        if (d.data?.length) {
          setRows(d.data);
          setColumns(Object.keys(d.data[0]));
          setForm(d.data[0]);
          setCurrentIndex(0);
        } else {
          setRows([]);
          setForm({});
          setCurrentIndex(-1);
        }
      })
      .catch(() => setError('Gagal cari'))
      .finally(() => setLoading(false));
  }, [selectedTable, search]);

  const handleRowClick = (row, idx) => {
    setForm(row);
    setCurrentIndex(idx);
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
    setSearch('');
  };

  const handleSave = () => {
    if (!selectedTable) return alert('Pilih tabel!');
    if (Object.keys(form).length === 0) return alert('Form kosong!');

    const payload = {
      tabel: selectedTable,
      data: form,           // ✅ DIPERBAIKI: "data: form"
      mode: form.id ? 'update' : 'insert'
    };

    fetch('/crudb.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          alert(`✅ Berhasil! ID: ${d.id}`);
          if (!form.id && d.id) setForm({ ...form, id: d.id });
        } else {
          alert('❌ Gagal: ' + (d.error || 'Error'));
        }
      })
      .catch(() => alert('❌ Server error'));
  };

  const handleDelete = () => {
    if (!form.id) return alert('Tidak ada data untuk dihapus');

    if (!window.confirm(`Hapus data ID ${form.id}?`)) return;

    const payload = {
      tabel: selectedTable,
      data: { id: form.id },  // ✅ DIPERBAIKI: "data: { id: ... }"
      mode: 'delete'
    };

    fetch('/crudb.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          alert('🗑️ Data dihapus');
          handleClear();
          if (search) setSearch(search);
        } else {
          alert('Gagal: ' + d.error);
        }
      })
      .catch(() => alert('Server error'));
  };

  const sortedFields = columns
    .filter(k => k !== 'id')
    .sort();

  return (
    <div style={styles.container}>
      <h2>✏️ Edit Data</h2>

      <div style={styles.row}>
        <select value={selectedTable} onChange={e => {
          setSelectedTable(e.target.value);
          setSearch('');
          setRows([]);
          setForm({});
          setCurrentIndex(-1);
        }} style={styles.select}>
          {tables.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <div style={styles.searchBox}>
          <span>🔍</span>
          <input
            type="text"
            placeholder="Cari..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}
      {loading && <div style={styles.loading}>Mencari...</div>}

      <div style={styles.form}>
        {sortedFields.map(f => (
          <div key={f} style={styles.field}>
            <label>{f}</label>
            <input
              type="text"
              name={f}
              value={form[f] || ''}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
        ))}

        {form.id && (
          <div style={styles.field}>
            <label>id 🔑</label>
            <input type="text" value={form.id} disabled style={styles.inputDisabled} />
          </div>
        )}

        <div style={styles.buttons}>
          <button onClick={handlePrev} disabled={currentIndex <= 0} style={styles.btn}>⬅️</button>
          <button onClick={handleNext} disabled={currentIndex >= rows.length - 1} style={styles.btn}>➡️</button>
          <button onClick={handleClear} style={{...styles.btn, background: '#95a5a6'}}>❌</button>
          <button onClick={handleSave} style={{...styles.btn, background: '#27ae60'}}>💾</button>
          {form.id && (
            <button onClick={handleDelete} style={{...styles.btn, background: '#e74c3c'}}>🗑️</button>
          )}
        </div>
      </div>

      {rows.length > 0 && (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                {sortedFields.map(f => <th key={f}>{f}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} onClick={() => handleRowClick(r, i)} style={i === currentIndex ? styles.active : {}}>
                  <td>{r.id}</td>
                  {sortedFields.map(f => <td key={f}>{r[f]}</td>)}
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
  container: { padding: 20 },
  row: { display: 'flex', gap: 10, marginBottom: 20 },
  select: { padding: 10, borderRadius: 6, border: '1px solid #ccc', flex: 1 },
  searchBox: { display: 'flex', border: '1px solid #ccc', borderRadius: 6, overflow: 'hidden' },
  searchInput: { border: 'none', outline: 'none', padding: '8px 12px', fontSize: 16, flex: 1 },
  error: { color: 'red', textAlign: 'center' },
  loading: { textAlign: 'center', color: '#555' },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  field: { display: 'flex', flexDirection: 'column', gap: 4 },
  input: { padding: 10, fontSize: 16, border: '1px solid #ddd', borderRadius: 4 },
  inputDisabled: { padding: 10, fontSize: 16, border: '1px solid #ddd', borderRadius: 4, backgroundColor: '#f5f5f5' },
  buttons: { display: 'flex', gap: 10, marginTop: 10 },
  btn: { padding: 10, border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold', color: 'white' },
  tableWrap: { marginTop: 20, overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  active: { backgroundColor: '#d5f5e3', border: '2px solid #27ae60' }
};

export default Edit;
