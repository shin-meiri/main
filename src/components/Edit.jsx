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
        if (data.tables?.length) {
          setTables(data.tables);
          if (!selectedTable) setSelectedTable(data.tables[0]);
        }
      })
      .catch(() => setError('Gagal muat daftar tabel'));
  }, [selectedTable]);

  // Cari data
  useEffect(() => {
    if (!selectedTable || !search.trim()) {
      setRows([]);
      setForm({});
      setCurrentIndex(-1);
      setShowId(false);
      return;
    }

    setLoading(true);
    fetch(`/crudb.php?tabel=${selectedTable}&search=${encodeURIComponent(search)}`)
      .then(res => res.json())
      .then(data => {
        if (data.data?.length) {
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

  // ✅ SAVE: Insert atau Update
  const handleSave = () => {
    if (!selectedTable) {
      alert('Pilih tabel dulu!');
      return;
    }

    // Pastikan data ada
    if (Object.keys(form).length === 0) {
      alert('Form kosong, tidak bisa disimpan');
      return;
    }

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
          alert(`✅ Berhasil disimpan! ID: ${data.id}`);
          // Jika insert, update ID ke form
          if (!form.id && data.id) {
            setForm({ ...form, id: data.id });
            setShowId(true);
          }
        } else {
          alert('❌ Gagal: ' + (data.error || 'Tidak diketahui'));
        }
      })
      .catch(err => {
        console.error('Save error:', err);
        alert('❌ Gagal terhubung ke server');
      });
  };

  // ✅ DELETE: Hapus data berdasarkan ID
  const handleDelete = () => {
    if (!form.id) {
      alert('Tidak ada data yang dipilih untuk dihapus');
      return;
    }

    if (!window.confirm(`⚠️ Hapus data dengan ID ${form.id}? Tidak bisa dibatalkan.`)) {
      return;
    }

    const payload = {
      tabel: selectedTable,
      data: { id: form.id },
      mode: 'delete'
    };

    fetch('/crudb.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert(`🗑️ Data ID ${form.id} berhasil dihapus`);
          handleClear();
          // Refresh daftar
          if (search) setSearch(search); // trigger ulang pencarian
        } else {
          alert('Gagal hapus: ' + (data.error || 'Tidak diketahui'));
        }
      })
      .catch(err => {
        console.error('Delete error:', err);
        alert('Gagal terhubung ke server');
      });
  };

  // Urutkan field, id paling bawah
  const sortedFields = columns
    .filter(k => k !== 'id')
    .sort((a, b) => a.localeCompare(b));

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>✏️ Edit Data</h2>

      {/* Pilih Tabel & Search */}
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
          {tables.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
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

        {/* Tombol Navigasi & Aksi */}
        <div style={styles.navButtons}>
          <button onClick={handlePrev} disabled={currentIndex <= 0} style={styles.navBtn}>
            ⬅️ Prev
          </button>
          <button onClick={handleNext} disabled={currentIndex >= rows.length - 1} style={styles.navBtn}>
            Next ➡️
          </button>
          <button onClick={handleClear} style={{ ...styles.navBtn, backgroundColor: '#95a5a6' }}>
            ❌ Clear
          </button>
          <button onClick={handleSave} style={{ ...styles.navBtn, backgroundColor: '#27ae60' }}>
            💾 Save
          </button>
          {/* 🔴 Delete hanya muncul jika ada ID */}
          {showId && (
            <button onClick={handleDelete} style={{ ...styles.navBtn, backgroundColor: '#e74c3c' }}>
              🗑️ Delete
            </button>
          )}
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
                <tr
                  key={i}
                  onClick={() => handleRowClick(row, i)}
                  style={i === currentIndex ? styles.trActive : styles.tr}
                >
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

// === STYLES ===
const styles = {
  container: { padding: '20px', fontFamily: 'Segoe UI, Arial, sans-serif' },
  title: { textAlign: 'center', color: '#2c3e50', marginBottom: '20px' },
  searchSection: { display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center' },
  select: { padding: '10px', borderRadius: '6px', border: '1px solid #ccc', flex: 1 },
  searchBox: { display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '6px', overflow: 'hidden', flex: 1 },
  searchInput: { border: 'none', outline: 'none', padding: '8px', fontSize: '16px', flex: 1 },
  error: { color: 'red', textAlign: 'center', padding: '10px' },
  loading: { textAlign: 'center', color: '#777', padding: '10px' },
  form: { marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' },
  field: { display: 'flex', flexDirection: 'column' },
  label: { fontSize: '14px', fontWeight: 'bold', color: '#555' },
  input: { padding: '10px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '4px' },
  navButtons: { display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' },
  navBtn: { padding: '10px 15px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', color: 'white', fontSize: '14px' },
  resultTable: { overflowX: 'auto', marginTop: '20px' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
  th: { backgroundColor: '#3498db', color: 'white', padding: '10px', textAlign: 'left' },
  tr: { cursor: 'pointer', backgroundColor: '#fff' },
  trActive: { cursor: 'pointer', backgroundColor: '#d5f5e3', border: '2px solid #27ae60' },
  td: { padding: '8px', border: '1px solid #eee' }
};

export default Edit;
