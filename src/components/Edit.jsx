// src/components/Edit.jsx
import React, { useState, useEffect } from 'react';

const Edit = () => {
  const [form, setForm] = useState({ id: '', nama: '' });
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false); // Tetap dipakai di UI
  const [error, setError] = useState('');

  const loadData = () => {
    setLoading(true);
    fetch('/crud.php')
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          setAllData(data.data);
          if (data.data.length > 0) {
            setForm(data.data[0]);
          }
        }
      })
      .catch(() => setError('Gagal muat data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = (id) => {
    if (!id) return;
    setLoading(true);
    fetch(`/crud.php?id=${id}`)
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

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const goToPrev = () => {
    const index = allData.findIndex(d => d.id === form.id); // ✅ Ganti == → ===
    if (index > 0) setForm(allData[index - 1]);
  };

  const goToNext = () => {
    const index = allData.findIndex(d => d.id === form.id); // ✅ Ganti == → ===
    if (index < allData.length - 1) setForm(allData[index + 1]);
  };

  const clearForm = () => {
    setForm({ id: '', nama: '' });
  };

  const saveData = () => {
    if (!form.nama) {
      setError('Nama harus diisi!');
      return;
    }
    setLoading(true);
    fetch('/crud.php', {
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
    fetch('/crud.php', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          loadData();
          if (form.id === id) clearForm(); // ✅ Ganti == → ===
        } else {
          setError('Hapus gagal');
        }
      });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📝 Edit Data</h2>

      {/* Tampilkan loading jika perlu */}
      {loading && <div style={styles.loading}>🔄 Sedang memuat...</div>}
      {error && <div style={styles.error}>{error}</div>}

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
            onChange={handleInputChange}
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

      {/* Tabel Hasil */}
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
                  📭 Tidak ada data
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

// === STYLES ===
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
  loading: {
    textAlign: 'center',
    color: '#27ae60',
    fontWeight: 'bold',
    marginBottom: '15px'
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '15px',
    textAlign: 'center'
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
