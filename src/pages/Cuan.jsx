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
        password: currentUser.password
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

  // Parse JSON data
  const parseJsonData = (jsonString) => {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      return { "0": jsonString || "N/A" };
    }
  };

  // Format display data
  const formatDisplayData = (data) => {
    return data.map((item, index) => ({
      id: item.id,
      masuk: parseJsonData(item.masuk),
      kluar: parseJsonData(item.kluar),
      time_stamp: item.time_stamp
    }));
  };

  // Start editing row
  const startEditingRow = (row) => {
    setEditingRow(row.id);
    setEditingData({
      id: row.id,
      masuk: JSON.stringify(row.masuk),
      kluar: JSON.stringify(row.kluar),
      time_stamp: row.time_stamp
    });
  };

  // Save edited row
  const saveEditedRow = async () => {
    if (!editingData.id) return;

    setLoading(true);
    setConnectionStatus('Menyimpan perubahan...');

    try {
      const response = await axios.post('/api/update-cuan.php', {
        host: currentUser.host,
        dbname: currentUser.dbname,
        username: currentUser.username,
        password: currentUser.password,
        id: editingData.id,
        masuk: editingData.masuk,
        kluar: editingData.kluar,
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
          <div>
            <span>Welcome, {currentUser.username}</span>
            <button 
              onClick={handleLogout}
              style={{
                marginLeft: '15px',
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

        <div style={{ marginBottom: '20px' }}>
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
        </div>

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
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {Object.keys(row.masuk)[0] || '0'}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {Object.values(row.masuk)[0] || 'N/A'}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {Object.keys(row.kluar)[0] || '0'}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {Object.values(row.kluar)[0] || 'N/A'}
                    </td>
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
                          cursor: 'pointer'
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>

                  {/* Edit form row - muncul di bawah baris yang diklik */}
                  {editingRow === row.id && (
                    <tr>
                      <td colSpan="7" style={{ padding: '0', border: '1px solid #007bff' }}>
                        <div style={{ padding: '15px', backgroundColor: '#e3f2fd' }}>
                          <h3>Edit Record</h3>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '12px', marginBottom: '3px' }}>Masuk (JSON):</label>
                              <textarea
                                value={editingData.masuk || ''}
                                onChange={(e) => handleInputChange('masuk', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  height: '80px'
                                }}
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '12px', marginBottom: '3px' }}>Keluar (JSON):</label>
                              <textarea
                                value={editingData.kluar || ''}
                                onChange={(e) => handleInputChange('kluar', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  height: '80px'
                                }}
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '12px', marginBottom: '3px' }}>Waktu:</label>
                              <input
                                type="text"
                                value={editingData.time_stamp || ''}
                                onChange={(e) => handleInputChange('time_stamp', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px',
                                  border: '1px solid #ddd',
                                  borderRadius: '4px',
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
