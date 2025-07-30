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
  const [addingRow, setAddingRow] = useState(false);
  const [formData, setFormData] = useState({
    masuk: '',
    dari: '',
    kluar: '',
    keperluan: ''
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
      // Mengambil data dari database MySQL
      const response = await axios.post('/api/cuan.php', {
        host: currentUser.host,
        dbname: currentUser.dbname,
        username: currentUser.username,
        password: currentUser.password
      });

      if (response.data && response.data.success) {
        setCuanData(response.data.data || []);
        setConnectionStatus(`✅ Menampilkan ${response.data.data?.length || 0} data cuan`);
      } else {
        setConnectionStatus(`❌ Gagal mengambil data: ${response.data.error}`);
      }
    } catch (err) {
      setConnectionStatus(`❌ Error: ${err.response?.data?.error || err.message}`);
      console.error('fetchData error:', err);
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

  // Format data sesuai dengan permintaan
  const formatCuanData = (data) => {
    return data.map((item, index) => {
      // Parse JSON untuk field masuk dan kluar
      let masukData = {};
      let kluarData = {};
      
      try {
        masukData = item.masuk ? JSON.parse(item.masuk) : {};
      } catch (e) {
        masukData = { "0": item.masuk || "N/A" };
      }
      
      try {
        kluarData = item.kluar ? JSON.parse(item.kluar) : {};
      } catch (e) {
        kluarData = { "0": item.kluar || "N/A" };
      }

      return {
        No: index + 1,
        Masuk: masukData,
        Dari: Object.values(masukData)[0] || 'N/A',
        Kluar: kluarData,
        Keperluan: Object.values(kluarData)[0] || 'N/A',
        Waktu: item.time_stamp || ''
      };
    });
  };

  // Handle form input change
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Start adding new row
  const startAdding = () => {
    setAddingRow(true);
    setFormData({
      masuk: '',
      dari: '',
      kluar: '',
      keperluan: ''
    });
  };

  // Cancel adding
  const cancelAdding = () => {
    setAddingRow(false);
    setFormData({
      masuk: '',
      dari: '',
      kluar: '',
      keperluan: ''
    });
  };

  // Save new row
  const saveNewRow = async () => {
    if (!currentUser || (!formData.masuk && !formData.kluar)) {
      setConnectionStatus('❌ Minimal masukkan masuk atau keluar!');
      return;
    }

    setLoading(true);
    setConnectionStatus('Menyimpan data baru...');

    try {
      // Format data sebagai JSON
      const masukJson = formData.masuk ? JSON.stringify({ [formData.masuk]: formData.dari }) : '{}';
      const kluarJson = formData.kluar ? JSON.stringify({ [formData.kluar]: formData.keperluan }) : '{}';

      const response = await axios.post('/api/insert-cuan.php', {
        host: currentUser.host,
        dbname: currentUser.dbname,
        username: currentUser.username,
        password: currentUser.password,
        masuk: masukJson,
        kluar: kluarJson
      });

      if (response.data.success) {
        setConnectionStatus('✅ Data berhasil disimpan!');
        setAddingRow(false);
        setFormData({
          masuk: '',
          dari: '',
          kluar: '',
          keperluan: ''
        });
        fetchData();
      } else {
        setConnectionStatus(`❌ Gagal menyimpan data: ${response.data.error}`);
      }
    } catch (err) {
      setConnectionStatus(`❌ Error menyimpan  ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Start editing row
  const startEditing = (row) => {
    const masukData = parseJsonData(row.masuk);
    const kluarData = parseJsonData(row.kluar);
    
    const masukKey = Object.keys(masukData)[0] || '';
    const dariValue = Object.values(masukData)[0] || '';
    const kluarKey = Object.keys(kluarData)[0] || '';
    const keperluanValue = Object.values(kluarData)[0] || '';
    
    setEditingRow(row.id);
    setFormData({
      masuk: masukKey,
      dari: dariValue,
      kluar: kluarKey,
      keperluan: keperluanValue
    });
  };

  // Parse JSON data
  const parseJsonData = (jsonString) => {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      return { "0": jsonString || "N/A" };
    }
  };

  // Save edited row
  const saveEditedRow = async () => {
    if (!currentUser || !editingRow) {
      setConnectionStatus('❌ Data tidak valid!');
      return;
    }

    setLoading(true);
    setConnectionStatus('Mengupdate data...');

    try {
      // Format data sebagai JSON
      const masukJson = formData.masuk ? JSON.stringify({ [formData.masuk]: formData.dari }) : '{}';
      const kluarJson = formData.kluar ? JSON.stringify({ [formData.kluar]: formData.keperluan }) : '{}';

      const response = await axios.post('/api/update-cuan.php', {
        host: currentUser.host,
        dbname: currentUser.dbname,
        username: currentUser.username,
        password: currentUser.password,
        id: editingRow,
        masuk: masukJson,
        kluar: kluarJson
      });

      if (response.data.success) {
        setConnectionStatus('✅ Data berhasil diupdate!');
        setEditingRow(null);
        setFormData({
          masuk: '',
          dari: '',
          kluar: '',
          keperluan: ''
        });
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
    setFormData({
      masuk: '',
      dari: '',
      kluar: '',
      keperluan: ''
    });
  };

  // Delete row
  const deleteRow = async (rowId) => {
    if (!currentUser || !rowId) {
      setConnectionStatus('❌ Data tidak valid!');
      return;
    }

    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      setLoading(true);
      setConnectionStatus('Menghapus data...');

      try {
        const response = await axios.post('/api/delete-cuan.php', {
          host: currentUser.host,
          dbname: currentUser.dbname,
          username: currentUser.username,
          password: currentUser.password,
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

  // Navigate to main page
  const goToMainPage = () => {
    navigate('/');
  };

  // Jika belum login, jangan tampilkan konten
  if (!currentUser) {
    return null;
  }

  const formattedData = formatCuanData(cuanData);
  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#1a1a2e',
      color: '#e0e0e0',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ 
          fontSize: '2rem',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          📊 Data Cuan
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '14px', color: '#a0a0c0' }}>
            👤 Welcome, <strong style={{ color: '#4ecdc4' }}>{currentUser.username}</strong>
          </span>
          <button
            onClick={goToMainPage}
            style={{
              padding: '8px 15px',
              backgroundColor: 'rgba(78, 205, 196, 0.2)',
              color: '#4ecdc4',
              border: '1px solid #4ecdc4',
              borderRadius: '25px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🏠 Main Page
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 15px',
              backgroundColor: 'rgba(255, 107, 107, 0.2)',
              color: '#ff6b6b',
              border: '1px solid #ff6b6b',
              borderRadius: '25px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🔒 Logout
          </button>
        </div>
      </div>

      {/* Connection Status */}
      {connectionStatus && (
        <div style={{
          padding: '15px',
          backgroundColor: connectionStatus.includes('✅') ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
          border: `1px solid ${connectionStatus.includes('✅') ? '#4CAF50' : '#f44336'}`,
          borderRadius: '10px',
          marginBottom: '25px',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '16px'
        }}>
          {connectionStatus}
        </div>
      )}

      {/* Refresh Button */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '30px' 
      }}>
        <button
          onClick={fetchData}
          disabled={loading}
          style={{
            padding: '12px 25px',
            backgroundColor: loading ? '#555' : 'pink',
            color: loading ? '#888' : 'black',
            border: 'none',
            borderRadius: '25px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '🔄 Loading...' : '🔄 Refresh Data'}
        </button>
      </div>

      {/* Add New Row Form */}
      <div style={{ 
        padding: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '15px',
        marginBottom: '30px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ 
            margin: 0,
            color: '#4ecdc4',
            fontSize: '1.8rem'
          }}>
            {addingRow ? '📝 Tambah Data Baru' : '📊 Data Cuan'}
          </h2>
          {!addingRow && (
            <button
              onClick={startAdding}
              style={{
                padding: '10px 20px',
                backgroundColor: 'pink',
                color: 'black',
                border: 'none',
                borderRadius: '25px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              ➕ Tambah Data
            </button>
          )}
        </div>

        {addingRow && (
          <div style={{ 
            marginBottom: '20px',
            padding: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid pink',
            borderRadius: '12px'
          }}>
            <h3 style={{ 
              margin: '0 0 20px 0',
              color: '#4ecdc4'
            }}>
              Form Tambah Data
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px',
              marginBottom: '20px'
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '12px', 
                  marginBottom: '5px',
                  color: '#a0a0c0'
                }}>
                  Masuk (Rp)
                </label>
                <input
                  type="text"
                  value={formData.masuk}
                  onChange={(e) => handleInputChange('masuk', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  placeholder="15000"
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '12px', 
                  marginBottom: '5px',
                  color: '#a0a0c0'
                }}>
                  Dari
                </label>
                <input
                  type="text"
                  value={formData.dari}
                  onChange={(e) => handleInputChange('dari', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  placeholder="babe"
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '12px', 
                  marginBottom: '5px',
                  color: '#a0a0c0'
                }}>
                  Keluar (Rp)
                </label>
                <input
                  type="text"
                  value={formData.kluar}
                  onChange={(e) => handleInputChange('kluar', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  placeholder="15000"
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '12px', 
                  marginBottom: '5px',
                  color: '#a0a0c0'
                }}>
                  Keperluan
                </label>
                <input
                  type="text"
                  value={formData.keperluan}
                  onChange={(e) => handleInputChange('keperluan', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  placeholder="beli bbm"
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={saveNewRow}
                disabled={loading}
                style={{
                  padding: '10px 20px',
                  backgroundColor: loading ? '#555' : 'green',
                  color: loading ? '#888' : 'white',
                  border: 'none',
                  borderRadius: '25px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? '💾 Menyimpan...' : '💾 Simpan'}
              </button>
              <button
                onClick={cancelAdding}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#666',
                  color: 'pink',
                  border: '1px solid pink',
                  borderRadius: '25px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                ❌ Batal
              </button>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div style={{ 
          overflowX: 'auto',
          maxHeight: '500px',
          overflowY: 'auto',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            color: '#e0e0e0',
            backgroundColor: 'rgba(26, 26, 46, 0.8)'
          }}>
            <thead>
              <tr>
                <th style={{
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '12px',
                  backgroundColor: 'rgba(78, 205, 196, 0.2)',
                  textAlign: 'center',
                  position: 'sticky',
                  top: 0
                }}>
                  No
                </th>
                <th style={{
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '12px',
                  backgroundColor: 'rgba(78, 205, 196, 0.2)',
                  textAlign: 'left',
                  position: 'sticky',
                  top: 0
                }}>
                  Masuk
                </th>
                <th style={{
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '12px',
                  backgroundColor: 'rgba(78, 205, 196, 0.2)',
                  textAlign: 'left',
                  position: 'sticky',
                  top: 0
                }}>
                  Dari
                </th>
                <th style={{
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '12px',
                  backgroundColor: 'rgba(78, 205, 196, 0.2)',
                  textAlign: 'left',
                  position: 'sticky',
                  top: 0
                }}>
                  Keluar
                </th>
                <th style={{
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '12px',
                  backgroundColor: 'rgba(78, 205, 196, 0.2)',
                  textAlign: 'left',
                  position: 'sticky',
                  top: 0
                }}>
                  Keperluan
                </th>
                <th style={{
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '12px',
                  backgroundColor: 'rgba(78, 205, 196, 0.2)',
                  textAlign: 'left',
                  position: 'sticky',
                  top: 0
                }}>
                  Waktu
                </th>
                <th style={{
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '12px',
                  backgroundColor: 'rgba(78, 205, 196, 0.2)',
                  textAlign: 'center',
                  position: 'sticky',
                  top: 0
                }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {formattedData.map((item, index) => (
                <React.Fragment key={index}>
                  <tr 
                    style={{
                      backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <td style={{
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      padding: '10px',
                      textAlign: 'center'
                    }}>
                      {item.No}
                    </td>
                    <td style={{
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      padding: '10px'
                    }}>
                      {Object.keys(item.Masuk)[0] || '0'}
                    </td>
                    <td style={{
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      padding: '10px'
                    }}>
                      {item.Dari}
                    </td>
                    <td style={{
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      padding: '10px'
                    }}>
                      {Object.keys(item.Kluar)[0] || '0'}
                    </td>
                    <td style={{
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      padding: '10px'
                    }}>
                      {item.Keperluan}
                    </td>
                    <td style={{
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      padding: '10px'
                    }}>
                      {item.Waktu}
                    </td>
                    <td style={{
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      padding: '10px',
                      textAlign: 'center'
                    }}>
                      <button
                        onClick={() => startEditing(cuanData[index])}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: 'rgba(78, 205, 196, 0.2)',
                          color: '#4ecdc4',
                          border: '1px solid #4ecdc4',
                          borderRadius: '15px',
                          fontSize: '11px',
                          cursor: 'pointer',
                          marginRight: '5px'
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteRow(cuanData[index].id)}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: 'rgba(255, 107, 107, 0.2)',
                          color: '#ff6b6b',
                          border: '1px solid #ff6b6b',
                          borderRadius: '15px',
                          fontSize: '11px',
                          cursor: 'pointer'
                        }}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>

                  {/* Edit form row - muncul di bawah baris yang diklik */}
                  {editingRow === cuanData[index].id && (
                    <tr>
                      <td 
                        colSpan="7"
                        style={{
                          padding: '0',
                          border: '1px solid rgba(255, 217, 61, 0.5)',
                          backgroundColor: 'rgba(255, 217, 61, 0.1)'
                        }}
                      >
                        <div style={{ 
                          padding: '20px',
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          borderRadius: '0 0 8px 8px'
                        }}>
                          <h3 style={{ 
                            margin: '0 0 15px 0',
                            color: '#ffd93d'
                          }}>
                            🛠️ Edit Record
                          </h3>
                          <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: `repeat(auto-fit, minmax(150px, 1fr))`,
                            gap: '10px',
                            marginBottom: '15px'
                          }}>
                            <div>
                              <label style={{ 
                                display: 'block', 
                                fontSize: '11px', 
                                marginBottom: '3px',
                                color: '#a0a0c0'
                              }}>
                                Masuk (Rp)
                              </label>
                              <input
                                type="text"
                                value={formData.masuk}
                                onChange={(e) => handleInputChange('masuk', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px',
                                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                  color: '#fff',
                                  border: '1px solid rgba(255, 255, 255, 0.2)',
                                  borderRadius: '6px',
                                  fontSize: '12px'
                                }}
                                placeholder="15000"
                              />
                            </div>
                            <div>
                              <label style={{ 
                                display: 'block', 
                                fontSize: '11px', 
                                marginBottom: '3px',
                                color: '#a0a0c0'
                              }}>
                                Dari
                              </label>
                              <input
                                type="text"
                                value={formData.dari}
                                onChange={(e) => handleInputChange('dari', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px',
                                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                  color: '#fff',
                                  border: '1px solid rgba(255, 255, 255, 0.2)',
                                  borderRadius: '6px',
                                  fontSize: '12px'
                                }}
                                placeholder="babe"
                              />
                            </div>
                            <div>
                              <label style={{ 
                                display: 'block', 
                                fontSize: '11px', 
                                marginBottom: '3px',
                                                      color: '#a0a0c0'
                              }}>
                                Keluar (Rp)
                              </label>
                              <input
                                type="text"
                                value={formData.kluar}
                                onChange={(e) => handleInputChange('kluar', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px',
                                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                  color: '#fff',
                                  border: '1px solid rgba(255, 255, 255, 0.2)',
                                  borderRadius: '6px',
                                  fontSize: '12px'
                                }}
                                placeholder="15000"
                              />
                            </div>
                            <div>
                              <label style={{ 
                                display: 'block', 
                                fontSize: '11px', 
                                marginBottom: '3px',
                                color: '#a0a0c0'
                              }}>
                                Keperluan
                              </label>
                              <input
                                type="text"
                                value={formData.keperluan}
                                onChange={(e) => handleInputChange('keperluan', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px',
                                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                  color: '#fff',
                                  border: '1px solid rgba(255, 255, 255, 0.2)',
                                  borderRadius: '6px',
                                  fontSize: '12px'
                                }}
                                placeholder="beli bbm"
                              />
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                              onClick={saveEditedRow}
                              disabled={loading}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: loading ? '#555' : 'green',
                                color: loading ? '#888' : '#4CAF50',
                                border: '1px solid #4CAF50',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                cursor: loading ? 'not-allowed' : 'pointer'
                              }}
                            >
                              {loading ? '💾 Saving...' : '💾 Save'}
                            </button>
                            <button
                              onClick={cancelEditing}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: '#666',
                                color: 'pink',
                                border: '1px solid pink',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                              }}
                            >
                              ❌ Cancel
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
        
        <div style={{ 
          marginTop: '10px', 
          textAlign: 'center', 
          fontSize: '14px', 
          color: '#a0a0c0' 
        }}>
          Menampilkan {formattedData.length} baris data
        </div>
      </div>
    </div>
  );
};

export default Cuan;
