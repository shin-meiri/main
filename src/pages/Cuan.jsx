// src/pages/Cuan.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cuan = () => {
  const [cuanData, setCuanData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('');
  const [editingRow, setEditingRow] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [addingRow, setAddingRow] = useState(false);
  const [newData, setNewData] = useState({
    dapat: '',
    dari: '',
    jumlah: '',
    keperluan: '',
    time_stamp: new Date().toISOString().slice(0, 19).replace('T', ' ')
  });
  const navigate = useNavigate();

  // Cek apakah user sudah login
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch data cuan dari API - menggunakan useCallback
  const fetchData = useCallback(async () => {
    if (!currentUser) return;
    
    setLoading(true);
    setConnectionStatus('Mengambil data cuan...');

    try {
      const response = await axios.post('/api/cuan.php', {
        host: currentUser.host,
        dbname: currentUser.dbname,
        username: currentUser.username,
        password: currentUser.password,
        action: 'get'
      });

      if (response.data && response.data.success) {
        setCuanData(response.data.data || []);
        setConnectionStatus(`✅ Menampilkan ${response.data.data?.length || 0} data cuan`);
      } else {
        setConnectionStatus(`❌ Gagal mengambil  ${response.data.error}`);
      }
    } catch (err) {
      setConnectionStatus(`❌ Error: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Fetch data ketika user berubah
  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser, fetchData]);

  // Parse JSON data dengan validasi
  const parseJsonData = (jsonString) => {
    try {
      // Jika string kosong, kembalikan objek kosong
      if (!jsonString || jsonString.trim() === '' || jsonString === '{}') {
        return {};
      }
      
      // Coba parse JSON
      const parsed = JSON.parse(jsonString);
      
      // Validasi hasil parsing
      if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return {};
      }
      
      return parsed;
    } catch (e) {
      console.error('JSON parse error:', e, 'String:', jsonString);
      return {};
    }
  };

  // Hitung total pemasukan, pengeluaran, dan dana
  const calculateTotals = () => {
    let totalPemasukan = 0;
    let totalPengeluaran = 0;

    cuanData.forEach(item => {
      // Hitung pemasukan
      const masukData = parseJsonData(item.masuk);
      Object.keys(masukData).forEach(key => {
        const value = parseFloat(key.replace(/[^0-9.-]+/g, '')) || 0;
        totalPemasukan += value;
      });

      // Hitung pengeluaran
      const kluarData = parseJsonData(item.kluar);
      Object.keys(kluarData).forEach(key => {
        const value = parseFloat(key.replace(/[^0-9.-]+/g, '')) || 0;
        totalPengeluaran += value;
      });
    });

    const dana = totalPemasukan - totalPengeluaran;

    return {
      pemasukan: totalPemasukan,
      pengeluaran: totalPengeluaran,
      dana: dana
    };
  };

  // Format angka dengan pemisah ribuan
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  // Format display data
  const formatDisplayData = (data) => {
    return data.map((item, index) => {
      const masukData = parseJsonData(item.masuk);
      const kluarData = parseJsonData(item.kluar);
      
      // Ambil nilai pertama dari objek masuk
      const dapatKeys = Object.keys(masukData);
      const dapatValues = Object.values(masukData);
      
      // Ambil nilai pertama dari objek kluar
      const jumlahKeys = Object.keys(kluarData);
      const jumlahValues = Object.values(kluarData);
      
      return {
        id: item.id,
        dapat: dapatKeys.length > 0 ? dapatKeys[0] : '0',
        dari: dapatValues.length > 0 ? dapatValues[0] : 'N/A',
        jumlah: jumlahKeys.length > 0 ? jumlahKeys[0] : '0',
        keperluan: jumlahValues.length > 0 ? jumlahValues[0] : 'N/A',
        time_stamp: item.time_stamp
      };
    });
  };

  // Start editing row
  const startEditingRow = (row) => {
    setEditingRow(row.id);
    
    const masukData = parseJsonData(cuanData.find(d => d.id === row.id).masuk);
    const kluarData = parseJsonData(cuanData.find(d => d.id === row.id).kluar);
    
    // Ambil nilai pertama dari objek masuk
    const dapatKeys = Object.keys(masukData);
    const dapatValues = Object.values(masukData);
    
    // Ambil nilai pertama dari objek kluar
    const jumlahKeys = Object.keys(kluarData);
    const jumlahValues = Object.values(kluarData);
    
    setEditingData({
      id: row.id,
      dapat: dapatKeys.length > 0 ? dapatKeys[0] : '',
      dari: dapatValues.length > 0 ? dapatValues[0] : '',
      jumlah: jumlahKeys.length > 0 ? jumlahKeys[0] : '',
      keperluan: jumlahValues.length > 0 ? jumlahValues[0] : '',
      time_stamp: row.time_stamp
    });
  };

  // Save edited row
  const saveEditedRow = async () => {
    if (!editingData.id) return;

    // Validasi data sebelum disimpan
    if (!editingData.dapat && !editingData.jumlah) {
      setConnectionStatus('❌ Minimal masukkan data masuk atau keluar!');
      return;
    }

    setLoading(true);
    setConnectionStatus('Menyimpan perubahan...');

    try {
      // Buat JSON yang valid
      let masukJson = '{}';
      let kluarJson = '{}';
      
      // Buat JSON masuk jika ada data
      if (editingData.dapat) {
        const masukObj = {};
        masukObj[editingData.dapat] = editingData.dari || 'N/A';
        masukJson = JSON.stringify(masukObj);
      }
      
      // Buat JSON kluar jika ada data
      if (editingData.jumlah) {
        const kluarObj = {};
        kluarObj[editingData.jumlah] = editingData.keperluan || 'N/A';
        kluarJson = JSON.stringify(kluarObj);
      }

      // Validasi JSON sebelum dikirim
      try {
        JSON.parse(masukJson);
        JSON.parse(kluarJson);
      } catch (e) {
        setConnectionStatus('❌ Format JSON tidak valid!');
        setLoading(false);
        return;
      }

      const response = await axios.post('/api/cuan.php', {
        host: currentUser.host,
        dbname: currentUser.dbname,
        username: currentUser.username,
        password: currentUser.password,
        action: 'update',
        id: editingData.id,
        masuk: masukJson,
        kluar: kluarJson,
        time_stamp: editingData.time_stamp
      });

      if (response.data.success) {
        setConnectionStatus('✅ Data berhasil diupdate!');
        setEditingRow(null);
        setEditingData({});
        fetchData();
      } else {
        setConnectionStatus(`❌ Gagal mengupdate  ${response.data.error}`);
      }
    } catch (err) {
      setConnectionStatus(`❌ Error mengupdate  ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingRow(null);
    setEditingData({});
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setEditingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle new data input change
  const handleNewDataChange = (field, value) => {
    setNewData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Start adding new row
  const startAddingRow = () => {
    setAddingRow(true);
    setNewData({
      dapat: '',
      dari: '',
      jumlah: '',
      keperluan: '',
      time_stamp: new Date().toISOString().slice(0, 19).replace('T', ' ')
    });
  };

  // Cancel adding
  const cancelAdding = () => {
    setAddingRow(false);
    setNewData({
      dapat: '',
      dari: '',
      jumlah: '',
      keperluan: '',
      time_stamp: new Date().toISOString().slice(0, 19).replace('T', ' ')
    });
  };

  // Save new row
  const saveNewRow = async () => {
    if (!newData.dapat && !newData.jumlah) {
      setConnectionStatus('❌ Minimal masukkan data masuk atau keluar!');
      return;
    }

    setLoading(true);
    setConnectionStatus('Menyimpan data baru...');

    try {
      // Buat JSON yang valid
      let masukJson = '{}';
      let kluarJson = '{}';
      
      // Buat JSON masuk jika ada data
      if (newData.dapat) {
        const masukObj = {};
        masukObj[newData.dapat] = newData.dari || 'N/A';
        masukJson = JSON.stringify(masukObj);
      }
      
      // Buat JSON kluar jika ada data
      if (newData.jumlah) {
        const kluarObj = {};
        kluarObj[newData.jumlah] = newData.keperluan || 'N/A';
        kluarJson = JSON.stringify(kluarObj);
      }

      // Validasi JSON sebelum dikirim
      try {
        JSON.parse(masukJson);
        JSON.parse(kluarJson);
      } catch (e) {
        setConnectionStatus('❌ Format JSON tidak valid!');
        setLoading(false);
        return;
      }

      const response = await axios.post('/api/cuan.php', {
        host: currentUser.host,
        dbname: currentUser.dbname,
        username: currentUser.username,
        password: currentUser.password,
        action: 'insert',
        masuk: masukJson,
        kluar: kluarJson,
        time_stamp: newData.time_stamp
      });

      if (response.data.success) {
        setConnectionStatus('✅ Data berhasil ditambahkan!');
        setAddingRow(false);
        setNewData({
          dapat: '',
          dari: '',
          jumlah: '',
          keperluan: '',
          time_stamp: new Date().toISOString().slice(0, 19).replace('T', ' ')
        });
        fetchData();
      } else {
        setConnectionStatus(`❌ Gagal menambahkan  ${response.data.error}`);
      }
    } catch (err) {
      setConnectionStatus(`❌ Error menambahkan  ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Delete row
  const deleteRow = async (rowId) => {
    if (!rowId) return;

    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      setLoading(true);
      setConnectionStatus('Menghapus data...');

      try {
        const response = await axios.post('/api/cuan.php', {
          host: currentUser.host,
          dbname: currentUser.dbname,
          username: currentUser.username,
          password: currentUser.password,
          action: 'delete',
          id: rowId
        });

        if (response.data.success) {
          setConnectionStatus('✅ Data berhasil dihapus!');
          fetchData();
        } else {
          setConnectionStatus(`❌ Gagal menghapus  ${response.data.error}`);
        }
      } catch (err) {
        setConnectionStatus(`❌ Error menghapus  ${err.response?.data?.error || err.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    navigate('/login');
  };

  // Jika belum login, jangan tampilkan konten
  if (!currentUser) {
    return null;
  }

  const formattedData = formatDisplayData(cuanData);
  const totals = calculateTotals();

  return (
    <div style={{ 
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px'
      }}>
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '10px',
          borderBottom: '1px solid #eee'
        }}>
          <h1>Data Cuan</h1>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
            <div style={{ display: 'flex', gap: '20px', fontSize: '14px' }}>
              <span style={{ color: '#dc3545' }}>
                <strong>Pengeluaran:</strong> Rp {formatCurrency(totals.pengeluaran)}
              </span>
              <span style={{ color: '#28a745' }}>
                <strong>Pemasukan:</strong> Rp {formatCurrency(totals.pemasukan)}
              </span>
              <span style={{ 
                color: totals.dana >= 0 ? '#28a745' : '#dc3545',
                fontWeight: 'bold'
              }}>
                <strong>Dana:</strong> Rp {formatCurrency(totals.dana)}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <span>Welcome, {currentUser.username}</span>
              <button 
                onClick={handleLogout}
                style={{
                  padding: '8px 15px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {connectionStatus && (
          <div style={{
            padding: '10px',
            backgroundColor: connectionStatus.includes('✅') ? '#d4edda' : '#f8d7da',
            color: connectionStatus.includes('✅') ? '#155724' : '#721c24',
            border: `1px solid ${connectionStatus.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            {connectionStatus}
          </div>
        )}

        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <button
            onClick={fetchData}
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: loading ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Loading...' : 'Refresh Data'}
          </button>
          <button
            onClick={startAddingRow}
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: loading ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            ➕ Tambah Data
          </button>
        </div>

        {/* Add New Row Form */}
        {addingRow && (
          <div style={{ 
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            border: '1px solid #ddd',
            borderRadius: '8px'
          }}>
            <h3 style={{ margin: '0 0 15px 0' }}>Tambah Data Baru</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>Dapat (Rp):</label>
                <input
                  type="text"
                  value={newData.dapat}
                  onChange={(e) => handleNewDataChange('dapat', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                  placeholder="15000"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>Dari:</label>
                <input
                  type="text"
                  value={newData.dari}
                  onChange={(e) => handleNewDataChange('dari', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                  placeholder="babe"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>Jumlah (Rp):</label>
                <input
                  type="text"
                  value={newData.jumlah}
                  onChange={(e) => handleNewDataChange('jumlah', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                  placeholder="15000"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>Keperluan:</label>
                <input
                  type="text"
                  value={newData.keperluan}
                  onChange={(e) => handleNewDataChange('keperluan', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                  placeholder="beli bbm"
                />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>Waktu:</label>
                <input
                  type="text"
                  value={newData.time_stamp}
                  onChange={(e) => handleNewDataChange('time_stamp', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                  placeholder="YYYY-MM-DD HH:MM:SS"
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={saveNewRow}
                disabled={loading}
                style={{
                  padding: '8px 15px',
                  backgroundColor: loading ? '#6c757d' : '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={cancelAdding}
                style={{
                  padding: '8px 15px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #ddd'
          }}>
            <thead>
              <tr>

                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f8f9fa' }}>No</th>
                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f8f9fa' }}>Dapat</th>
                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f8f9fa' }}>Dari</th>
                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f8f9fa' }}>Jumlah</th>
                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f8f9fa' }}>Keperluan</th>
                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f8f9fa' }}>Waktu</th>
                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f8f9fa' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {formattedData.map((row, index) => (
                <React.Fragment key={row.id}>
                  <tr style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa' }}>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{row.id}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.dapat}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.dari}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.jumlah}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.keperluan}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.time_stamp}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                      <button
                        onClick={() => startEditingRow(row)}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          marginRight: '5px'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteRow(row.id)}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>

                  {/* Edit form row - muncul di bawah baris yang diklik */}
                  {editingRow === row.id && (
                    <tr>
                      <td colSpan="7" style={{ padding: '0', border: '1px solid #007bff' }}>
                        <div style={{ padding: '15px', backgroundColor: '#e3f2fd' }}>
                          <h3>Edit Record</h3>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '15px' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '11px', marginBottom: '3px' }}>Dapat (Rp):</label>
                              <input
                                type="text"
                                value={editingData.dapat || ''}
                                onChange={(e) => handleInputChange('dapat', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '6px',
                                  border: '1px solid #ddd',
                                  borderRadius: '3px',
                                  fontSize: '12px'
                                }}
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '11px', marginBottom: '3px' }}>Dari:</label>
                              <input
                                type="text"
                                value={editingData.dari || ''}
                                onChange={(e) => handleInputChange('dari', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '6px',
                                  border: '1px solid #ddd',
                                  borderRadius: '3px',
                                  fontSize: '12px'
                                }}
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '11px', marginBottom: '3px' }}>Jumlah (Rp):</label>
                              <input
                                type="text"
                                value={editingData.jumlah || ''}
                                onChange={(e) => handleInputChange('jumlah', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '6px',
                                  border: '1px solid #ddd',
                                  borderRadius: '3px',
                                  fontSize: '12px'
                                }}
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '11px', marginBottom: '3px' }}>Keperluan:</label>
                              <input
                                type="text"
                                value={editingData.keperluan || ''}
                                onChange={(e) => handleInputChange('keperluan', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '6px',
                                  border: '1px solid #ddd',
                                  borderRadius: '3px',
                                  fontSize: '12px'
                                }}
                              />
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                              <label style={{ display: 'block', fontSize: '11px', marginBottom: '3px' }}>Waktu:</label>
                              <input
                                type="text"
                                value={editingData.time_stamp || ''}
                                onChange={(e) => handleInputChange('time_stamp', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '6px',
                                  border: '1px solid #ddd',
                                  borderRadius: '3px',
                                  fontSize: '12px'
                                }}
                              />
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                              onClick={saveEditedRow}
                              disabled={loading}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: loading ? '#6c757d' : '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '12px',
                                cursor: loading ? 'not-allowed' : 'pointer'
                              }}
                            >
                              {loading ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              onClick={cancelEditing}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '12px',
                                cursor: 'pointer'
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {formattedData.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
            Tidak ada data cuan
          </div>
        )}
      </div>
    </div>
  );
};

export default Cuan;
