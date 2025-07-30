// src/pages/Cuan.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cuan = () => {
  const [cuanData, setCuanData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('');
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
      const response = await axios.post('/api/get-cuan-data.php', {
        host: currentUser.host,
        dbname: currentUser.dbname,
        username: currentUser.username,
        password: currentUser.password,
        table: 'cuan'
      });

      if (response.data && response.data.success) {
        setCuanData(response.data.data || []);
        setConnectionStatus(`✅ Menampilkan ${response.data.data?.length || 0} data cuan`);
      } else {
        setConnectionStatus(`❌ Gagal mengambil  ${response.data.error}`);
      }
    } catch (err) {
      setConnectionStatus(`❌ Error: ${err.response?.data?.error || err.message}`);
      console.error('fetchData error:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Fetch data users dari API - menggunakan useCallback
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
        masukData = { [item.masuk || '0']: 'N/A' };
      }
      
      try {
        kluarData = item.kluar ? JSON.parse(item.kluar) : {};
      } catch (e) {
        kluarData = { [item.kluar || '0']: 'N/A' };
      }

      return {
        No: index + 1,
        Dari: masukData,
        Keperluan: kluarData,
        Waktu: item.time_stamp || ''
      };
    });
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
            onMouseOver={(e) => {
              e.target.style.backgroundColor = 'rgba(78, 205, 196, 0.3)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'rgba(78, 205, 196, 0.2)';
              e.target.style.transform = 'translateY(0)';
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
            onMouseOver={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 107, 107, 0.3)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 107, 107, 0.2)';
              e.target.style.transform = 'translateY(0)';
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
          onMouseOver={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.3)';
            }
          }}
          onMouseOut={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }
          }}
        >
          {loading ? '🔄 Loading...' : '🔄 Refresh Data'}
        </button>
      </div>

      {/* Data Table */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        padding: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '15px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '25px',
          color: '#4ecdc4',
          fontSize: '1.8rem',
          fontWeight: 'bold'
        }}>
          📈 Data Cuan ({formattedData.length} records)
        </h2>
        
        {formattedData.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '50px',
            backgroundColor: '#f8f9fa',
            borderRadius: '10px',
            border: '2px dashed #e1e5e9'
          }}>
            <div style={{ 
              fontSize: '3rem',
              marginBottom: '15px',
              color: '#ccc'
            }}>📭</div>
            <div style={{ 
              fontSize: '1.2rem',
              color: '#666'
            }}>Belum ada data cuan</div>
          </div>
        ) : (
          <div style={{ 
            overflowX: 'auto',
            maxHeight: '600px',
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
                    padding: '15px',
                    backgroundColor: 'rgba(78, 205, 196, 0.2)',
                    textAlign: 'center',
                    position: 'sticky',
                    top: 0,
                    backdropFilter: 'blur(5px)'
                  }}>
                    No
                  </th>
                  <th style={{
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '15px',
                    backgroundColor: 'rgba(78, 205, 196, 0.2)',
                    textAlign: 'left',
                    position: 'sticky',
                    top: 0,
                    backdropFilter: 'blur(5px)'
                  }}>
                    Dari
                  </th>
                  <th style={{
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '15px',
                    backgroundColor: 'rgba(78, 205, 196, 0.2)',
                    textAlign: 'left',
                    position: 'sticky',
                    top: 0,
                    backdropFilter: 'blur(5px)'
                  }}>
                    Keperluan
                  </th>
                  <th style={{
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '15px',
                    backgroundColor: 'rgba(78, 205, 196, 0.2)',
                    textAlign: 'left',
                    position: 'sticky',
                    top: 0,
                    backdropFilter: 'blur(5px)'
                  }}>
                    Waktu
                  </th>
                </tr>
              </thead>
              <tbody>
                {formattedData.map((item, index) => (
                  <tr 
                    key={index}
                    style={{
                      backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.05)'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = 'rgba(78, 205, 196, 0.1)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = index % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.05)';
                    }}
                  >
                    <td style={{
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      padding: '12px',
                      textAlign: 'center'
                    }}>
                      {item.No}
                    </td>
                    <td style={{
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      padding: '12px'
                    }}>
                      {Object.entries(item.Dari).map(([amount, source], i) => (
                        <div key={i} style={{ marginBottom: '5px' }}>
                          <span style={{ fontWeight: 'bold', color: '#4ecdc4' }}>
                            {amount}:
                          </span>{' '}
                          <span style={{ color: '#a0a0c0' }}>
                            {source}
                          </span>
                        </div>
                      ))}
                    </td>
                    <td style={{
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      padding: '12px'
                    }}>
                      {Object.entries(item.Keperluan).map(([amount, purpose], i) => (
                        <div key={i} style={{ marginBottom: '5px' }}>
                          <span style={{ fontWeight: 'bold', color: '#ff6b6b' }}>
                            {amount}:
                          </span>{' '}
                          <span style={{ color: '#a0a0c0' }}>
                            {purpose}
                          </span>
                        </div>
                      ))}
                    </td>
                    <td style={{
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      padding: '12px'
                    }}>
                      {item.Waktu}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Section */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '30px auto 0 auto',
        padding: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '15px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '20px',
          color: '#4ecdc4',
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          📊 Summary
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px' 
        }}>
          <div style={{ 
            padding: '15px',
            backgroundColor: 'rgba(78, 205, 196, 0.1)',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>📥</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#4ecdc4' }}>
              Total Masuk
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {formattedData.reduce((total, item) => {
                const masukAmount = Object.keys(item.Dari)[0] || '0';
                return total + parseFloat(masukAmount.replace(/[^0-9.-]+/g, '')) || 0;
              }, 0).toLocaleString()}
            </div>
          </div>
          <div style={{ 
            padding: '15px',
            backgroundColor: 'rgba(255, 107, 107, 0.1)',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>📤</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#ff6b6b' }}>
              Total Keluar
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {formattedData.reduce((total, item) => {
                const kluarAmount = Object.keys(item.Keperluan)[0] || '0';
                return total + parseFloat(kluarAmount.replace(/[^0-9.-]+/g, '')) || 0;
              }, 0).toLocaleString()}
            </div>
          </div>
          <div style={{ 
            padding: '15px',
            backgroundColor: 'rgba(255, 217, 61, 0.1)',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>💰</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#ffd93d' }}>
              Saldo Akhir
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {(formattedData.reduce((total, item) => {
                const masukAmount = Object.keys(item.Dari)[0] || '0';
                const kluarAmount = Object.keys(item.Keperluan)[0] || '0';
                return total + 
                  (parseFloat(masukAmount.replace(/[^0-9.-]+/g, '')) || 0) - 
                  (parseFloat(kluarAmount.replace(/[^0-9.-]+/g, '')) || 0);
              }, 0)).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cuan;