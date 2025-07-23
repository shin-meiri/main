// src/components/Edit.jsx
import React, { useState, useEffect, useCallback } from 'react';

const Edit = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [form, setForm] = useState({ id: '', nama: '' });
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 🔁 Gunakan useCallback agar fungsi tidak dibuat ulang
  const loadData = useCallback(() => {
    if (!selectedTable) return;
    setLoading(true);
    setError('');
    fetch(`/crudb.php?tabel=${selectedTable}`)
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          setAllData(data.data);
          if (data.data.length > 0) {
            setForm(data.data[0]);
          } else {
            setForm({ id: '', nama: '' });
          }
        } else {
          setAllData([]);
          setForm({ id: '', nama: '' });
        }
      })
      .catch(() => setError('Gagal muat data tabel'))
      .finally(() => setLoading(false));
  }, [selectedTable]);

  // Ambil daftar tabel (hanya sekali)
  useEffect(() => {
    fetch('/crudb.php?tables=true')
      .then(res => res.json())
      .then(data => {
        if (data.tables) {
          setTables(data.tables);
          if (data.tables.length > 0 && !selectedTable) {
            setSelectedTable(data.tables[0]);
          }
        } else {
          setError('Gagal muat daftar tabel');
        }
      })
      .catch(() => setError('Koneksi gagal ke crudb.php'));
  }, [selectedTable]); // 👈 Tambahkan jika ingin reload saat tabel berubah

  // Muat data saat tabel berubah
  useEffect(() => {
    loadData();
  }, [selectedTable, loadData]); // ✅ loadData dari useCallback → stabil

  const handleSearch = (id) => {
    if (!id || !selectedTable) return;
    setLoading(true);
    fetch(`/crudb.php?tabel=${selectedTable}&id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setForm(data);
        } else {
          setForm({ id, nama: '' });
          setError('Data tidak ditemukan');
          setTimeout(() => setError(''), 3000);
        }
      })
      .catch(() => setError('Gagal cari data'))
      .finally(() => setLoading(false));
  };

  const goToPrev = () => {
    const index = allData.findIndex(d => d.id === form.id);
    if (index > 0) setForm(allData[index - 1]);
  };

  const goToNext = () => {
    const index = allData.findIndex(d => d.id === form.id);
    if (index < allData.length - 1) setForm(allData[index + 1]);
  };

  const clearForm = () => {
    setForm({ id: '', nama: '' });
  };

  const saveData = () => {
    if (!selectedTable) {
      setError('Pilih tabel dulu!');
      return;
    }
    if (!form.nama) {
      setError('Field nama harus diisi!');
      return;
    }

    setLoading(true);
    fetch(`/crudb.php?tabel=${selectedTable}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setForm({ ...form, id: data.id });
          loadData();
          setError('');
        } else {
          setError('Simpan gagal: ' + (data.error || ''));
        }
      })
      .catch(() => setError('Koneksi gagal'))
      .finally(() => setLoading(false));
  };

  const deleteData = (id) => {
    if (!window.confirm('Hapus data ini?')) return;
    fetch(`/crudb.php?tabel=${selectedTable}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          loadData();
          if (form.id === id) clearForm();
        } else {
          setError('Hapus gagal');
        }
      });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📝 Edit Data</h2>

      {error && <div style={styles.error}>{error}</div>}
      {loading && <div style={styles.loading}>🔄 Memuat...</div>}

      {/* Pilih Tabel */}
      <div style={styles.selector}>
        <label style={styles.label}>📊 Pilih Tabel:</label>
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

      {/* Pencarian */}
      <div style={styles.searchBox}>
        <input
          type="number"
          placeholder="🔍 Cari by ID"
          onChange={(e) => handleSearch(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* Form Input */}
      <div style={styles.formCard}>
        <div style={styles.field}>
          <label>ID</label>
          <input
            type="number"
            name="id"
            value={form.id}
            readOnly
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          <label>Nama</label>
          <input
            type="text"
            name="nama"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            placeholder="Masukkan nama"
            style={styles.input}
          />
        </div>

        <div style={styles.navButtons}>
          <button onClick={goToPrev} disabled={!form.id} style={styles.navBtn}>
            ⬅️ Prev
          </button>
          <button onClick={goToNext} disabled={!form.id} style={styles.navBtn}>
            Next ➡️
          </button>
          <button onClick={clearForm} style={styles.clearBtn}>❌ Clear</button>
          <button onClick={saveData} style={styles.saveBtn}>
            💾 {form.id ? 'Update' : 'Simpan'}
          </button>
        </div>
      </div>

      {/* Tabel Data */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {allData.length === 0 ? (
              <tr>
                <td colSpan="3" style={styles.empty}>
                  📭 Tidak ada data di tabel "{selectedTable}"
                </td>
              </tr>
            ) : (
              allData.map((item) => (
                <tr key={item.id}>
                  <td style={styles.idCol}>{item.id}</td>
                  <td>{item.nama}</td>
                  <td style={styles.actionCol}>
                    <button
                      onClick={() => setForm(item)}
                      style={styles.editBtn}
                    >
                      📝
                    </button>
                    <button
                      onClick={() => deleteData(item.id)}
                      style={styles.deleteBtn}
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// === STYLES === (tetap sama)
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    color: '#2c3e50'
  },
  title: {
    textAlign: 'center',
    color: '#2980b9',
    fontSize: '1.8em',
    marginBottom: '20px'
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '15px',
    textAlign: 'center'
  },
  loading: {
    textAlign: 'center',
    padding: '10px',
    color: '#27ae60'
  },
  selector: {
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  label: {
    fontWeight: 'bold',
    fontSize: '16px',
    color: '#2c3e50'
  },
  select: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #3498db',
    borderRadius: '6px',
    flex: 1
  },
  searchBox: {
    marginBottom: '20px',
    textAlign: 'center'
  },
  searchInput: {
    padding: '12px',
    fontSize: '16px',
    width: '80%',
    maxWidth: '400px',
    border: '2px solid #3498db',
    borderRadius: '8px',
    outline: 'none'
  },
  formCard: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px',
    border: '1px solid #dee2e6'
  },
  field: {
    marginBottom: '15px'
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #bdc3c7',
    borderRadius: '6px',
    boxSizing: 'border-box'
  },
  navButtons: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
    flexWrap: 'wrap'
  },
  navBtn: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  clearBtn: {
    padding: '10px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  saveBtn: {
    padding: '10px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px'
  },
  idCol: {
    width: '80px',
    textAlign: 'center'
  },
  actionCol: {
    width: '120px',
    textAlign: 'center'
  },
  editBtn: {
    background: '#3498db',
    color: 'white',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '4px',
    marginRight: '5px',
    cursor: 'pointer'
  },
  deleteBtn: {
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  empty: {
    textAlign: 'center',
    padding: '20px',
    color: '#95a5a6',
    fontStyle: 'italic'
  }
};

export default Edit;
