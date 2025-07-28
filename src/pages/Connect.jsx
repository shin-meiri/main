// src/pages/Connect.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Connect = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState({});
  const [selectedTables, setSelectedTables] = useState({});
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

  // Fungsi untuk mengambil data dari API
  const fetchData = async () => {
    try {
      const response = await axios.get('/api/dat.json');
      setData(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Load data saat komponen pertama kali dimuat
  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  // Fungsi untuk logout
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    navigate('/login');
  };

  // Fungsi untuk kembali ke halaman utama
  const handleBackToHome = () => {
    navigate('/');
  };

  // Fungsi untuk test koneksi database
  const testConnection = (user) => {
    // Simulasi test koneksi
    setConnectionStatus(prev => ({
      ...prev,
      [user.id]: 'Testing...'
    }));

    // Simulasi delay untuk test koneksi
    setTimeout(() => {
      // Simulasi hasil test koneksi (acak berhasil/gagal)
      const isSuccess = Math.random() > 0.3; // 70% success rate
      setConnectionStatus(prev => ({
        ...prev,
        [user.id]: isSuccess ? 'Connected ✅' : 'Failed ❌'
      }));

      // Reset status setelah beberapa detik
      setTimeout(() => {
        setConnectionStatus(prev => ({
          ...prev,
          [user.id]: ''
        }));
      }, 5000);
    }, 1500);
  };

  // Fungsi untuk handle perubahan tabel dropdown
  const handleTableChange = (userId, value) => {
    setSelectedTables(prev => ({
      ...prev,
      [userId]: value
    }));
  };

  // Fungsi untuk mendapatkan daftar tabel (simulasi)
  const getTableList = (userId) => {
    // Simulasi daftar tabel
    const tables = [
      'users', 'products', 'orders', 'customers', 
      'categories', 'suppliers', 'employees', 'invoices'
    ];
    return tables;
  };

  // Jika belum login, jangan tampilkan konten
  if (!currentUser) {
    return null;
  }

  if (loading) return (
    <div style={{ 
      color: 'pink', 
      backgroundColor: 'black', 
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      Loading...
    </div>
  );

  if (error) return (
    <div style={{ 
      color: 'pink', 
      backgroundColor: 'black', 
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      Error: {error}
    </div>
  );

  // Filter user yang memiliki data database
  const dbUsers = data?.users?.filter(user => user.host && user.dbname) || [];

  return (
    <div style={{ 
      color: 'pink', 
      backgroundColor: 'black', 
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '10px 0',
        borderBottom: '1px solid #444'
      }}>
        <div style={{ 
          fontSize: '2rem' 
        }}>
          Database Connections
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '14px', color: '#aaa' }}>
            Welcome, {currentUser.username}
          </span>
          <button
            onClick={handleBackToHome}
            style={{
              padding: '8px 15px',
              backgroundColor: 'pink',
              color: 'black',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Back to Home
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 15px',
              backgroundColor: '#555',
              color: 'pink',
              border: '1px solid pink',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Database Connections */}
      <div>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '20px',
          fontSize: '1.8rem'
        }}>
          MySQL Database Connections ({dbUsers.length} connections)
        </h2>
        
        {dbUsers.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', 
            gap: '20px' 
          }}>
            {dbUsers.map(user => (
              <div 
                key={user.id}
                style={{
                  padding: '20px',
                  backgroundColor: '#222',
                  border: '1px solid #444',
                  borderRadius: '8px'
                }}
              >
                {/* Connection Header */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '15px',
                  paddingBottom: '10px',
                  borderBottom: '1px solid #444'
                }}>
                  <h3 style={{ margin: 0, color: 'pink' }}>Connection #{user.id}</h3>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => testConnection(user)}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#444',
                        color: 'pink',
                        border: '1px solid pink',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      🔁 Test Connection
                    </button>
                  </div>
                </div>

                {/* Connection Status */}
                {connectionStatus[user.id] && (
                  <div style={{
                    padding: '10px',
                    marginBottom: '15px',
                    backgroundColor: connectionStatus[user.id].includes('Connected') ? '#2d5a2d' : 
                                   connectionStatus[user.id].includes('Failed') ? '#7a2d2d' : '#2d4a7a',
                    border: '1px solid',
                    borderColor: connectionStatus[user.id].includes('Connected') ? '#4caf50' : 
                                connectionStatus[user.id].includes('Failed') ? '#f44336' : '#2196f3',
                    borderRadius: '4px',
                    textAlign: 'center',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    {connectionStatus[user.id]}
                  </div>
                )}

                {/* Connection Details */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '100px 1fr', 
                  gap: '10px',
                  marginBottom: '15px'
                }}>
                  <div><strong>Username:</strong></div>
                  <div>{user.username}</div>
                  
                  <div><strong>Host:</strong></div>
                  <div>{user.host}</div>
                  
                  <div><strong>Database:</strong></div>
                  <div>{user.dbname}</div>
                </div>

                {/* Table Selection */}
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>
                    <strong>Select Table:</strong>
                  </label>
                  <select
                    value={selectedTables[user.id] || (user.tabel || '')}
                    onChange={(e) => handleTableChange(user.id, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      backgroundColor: '#333',
                      color: 'pink',
                      border: '1px solid #555',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">-- Select a table --</option>
                    {getTableList(user.id).map((table, index) => (
                      <option key={index} value={table}>{table}</option>
                    ))}
                  </select>
                </div>

                {/* MySQL Connection String */}
                <div style={{
                  padding: '10px',
                  backgroundColor: '#111',
                  border: '1px solid #444',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  wordBreak: 'break-all'
                }}>
                  <div><strong>MySQL Connection:</strong></div>
                  <div style={{ marginTop: '5px' }}>
                    mysql -h {user.host} -u {user.username} -p {user.dbname}
                  </div>
                  {selectedTables[user.id] && (
                    <div style={{ marginTop: '5px' }}>
                      Selected Table: {selectedTables[user.id]}
                    </div>
                  )}
                </div>

                {/* Table Information */}
                {selectedTables[user.id] && (
                  <div style={{ 
                    marginTop: '15px',
                    padding: '10px',
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #444',
                    borderRadius: '4px'
                  }}>
                    <h4 style={{ margin: '0 0 10px 0', color: 'pink' }}>
                      Table: {selectedTables[user.id]}
                    </h4>
                    <div style={{ fontSize: '12px' }}>
                      <div><strong>Engine:</strong> InnoDB</div>
                      <div><strong>Rows:</strong> ~{(Math.floor(Math.random() * 1000) + 100).toLocaleString()}</div>
                      <div><strong>Size:</strong> {(Math.random() * 10 + 1).toFixed(2)} MB</div>
                      <div><strong>Collation:</strong> utf8_general_ci</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            backgroundColor: '#222',
            border: '1px solid #444',
            borderRadius: '8px'
          }}>
            <p>No database connections found</p>
            <p style={{ fontSize: '14px', color: '#aaa', marginTop: '10px' }}>
              Add users with database information in the main page to see connections here
            </p>
          </div>
        )}
      </div>

      {/* Users Without Database Info */}
      {data?.users && data.users.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h2 style={{ 
            textAlign: 'center', 
            marginBottom: '20px',
            fontSize: '1.5rem'
          }}>
            Other Users ({data.users.length - dbUsers.length})
          </h2>
          
          {data.users.length > dbUsers.length ? (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '15px' 
            }}>
              {data.users
                .filter(user => !user.host || !user.dbname)
                .map(user => (
                  <div 
                    key={user.id}
                    style={{
                      padding: '15px',
                      backgroundColor: '#222',
                      border: '1px solid #444',
                      borderRadius: '6px'
                    }}
                  >
                    <div><strong>ID:</strong> {user.id}</div>
                    <div><strong>Username:</strong> {user.username}</div>
                    <div style={{ 
                      marginTop: '10px', 
                      fontSize: '12px', 
                      color: '#aaa' 
                    }}>
                      No database connection information
                    </div>
                  </div>
                ))
              }
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#aaa' }}>
              All users have database connection information
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Connect;