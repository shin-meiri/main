// src/pages/Connect.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Connect = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tables, setTables] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('');
  const [connectionResult, setConnectionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
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

  // Fetch data users dari API
  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/dat.json');
      const usersWithDb = (response.data.users || []).filter(user => 
        user.host && user.dbname && user.username && user.password
      );
      setUsers(usersWithDb);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  // Handle user selection
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setTables([]);
    setConnectionResult(null);
    setConnectionStatus('');
  };

  // Test connection to MySQL
  const testConnection = async () => {
    if (!selectedUser) {
      setConnectionStatus('Pilih user terlebih dahulu');
      return;
    }

    setLoading(true);
    setConnectionStatus('Menghubungkan...');

    try {
      // Di sini kita akan membuat API endpoint untuk test koneksi
      const response = await axios.post('/api/test-connection.php', {
        host: selectedUser.host,
        dbname: selectedUser.dbname,
        username: selectedUser.username,
        password: selectedUser.password
      });

      if (response.data.success) {
        setConnectionResult(response.data);
        setConnectionStatus('✅ Koneksi berhasil!');
        setTables(response.data.tables || []);
      } else {
        setConnectionStatus(`❌ ${response.data.error || 'Koneksi gagal'}`);
      }
    } catch (err) {
      setConnectionStatus(`❌ Error: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Get tables from selected database
  const getTables = async () => {
    if (!selectedUser) {
      setConnectionStatus('Pilih user terlebih dahulu');
      return;
    }

    setLoading(true);
    setConnectionStatus('Mengambil tabel...');

    try {
      const response = await axios.post('/api/get-tables.php', {
        host: selectedUser.host,
        dbname: selectedUser.dbname,
        username: selectedUser.username,
        password: selectedUser.password
      });

      if (response.data.success) {
        setTables(response.data.tables || []);
        setConnectionStatus('✅ Tabel berhasil diambil!');
      } else {
        setConnectionStatus(`❌ ${response.data.error || 'Gagal mengambil tabel'}`);
      }
    } catch (err) {
      setConnectionStatus(`❌ Error: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
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
          MySQL Connection
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '14px', color: '#aaa' }}>
            Welcome, {currentUser.username}
          </span>
          <button
            onClick={goToMainPage}
            style={{
              padding: '8px 15px',
              backgroundColor: '#444',
              color: 'pink',
              border: '1px solid pink',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Main Page
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

      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        padding: '20px'
      }}>
        {/* Connection Form */}
        <div style={{ 
          padding: '20px',
          border: '1px solid pink',
          borderRadius: '8px',
          marginBottom: '30px'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Database Connection</h2>
          
          {/* User Selection */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Pilih User Database:</label>
            <select
              value={selectedUser?.id || ''}
              onChange={(e) => {
                const user = users.find(u => u.id === parseInt(e.target.value));
                handleUserSelect(user);
              }}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#333',
                color: 'pink',
                border: '1px solid #555',
                borderRadius: '4px'
              }}
            >
              <option value="">-- Pilih User --</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.username} - {user.host} ({user.dbname})
                </option>
              ))}
            </select>
          </div>

          {/* Connection Details */}
          {selectedUser && (
            <div style={{ 
              backgroundColor: '#222',
              padding: '15px',
              borderRadius: '6px',
              marginBottom: '20px'
            }}>
              <h3 style={{ margin: '0 0 15px 0' }}>Connection Details:</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <div><strong>Host:</strong> {selectedUser.host}</div>
                <div><strong>Database:</strong> {selectedUser.dbname}</div>
                <div><strong>Username:</strong> {selectedUser.username}</div>
                <div><strong>Password:</strong> {'•'.repeat(selectedUser.password.length)}</div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button
              onClick={testConnection}
              disabled={!selectedUser || loading}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: loading ? '#555' : 'pink',
                color: loading ? '#888' : 'black',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading || !selectedUser ? 'not-allowed' : 'pointer'
              }}
            >
              🔁 Test Connection
            </button>
            
            <button
              onClick={getTables}
              disabled={!selectedUser || loading}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: loading ? '#555' : '#444',
                color: loading ? '#888' : 'pink',
                border: '1px solid pink',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading || !selectedUser ? 'not-allowed' : 'pointer'
              }}
            >
              📋 Get Tables
            </button>
          </div>

          {/* Connection Status */}
          {connectionStatus && (
            <div style={{
              padding: '10px',
              backgroundColor: connectionStatus.includes('✅') ? '#2d5a2d' : '#5a2d2d',
              border: `1px solid ${connectionStatus.includes('✅') ? '#4CAF50' : '#f44336'}`,
              borderRadius: '4px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {connectionStatus}
            </div>
          )}

          {/* Connection Result Details */}
          {connectionResult && (
            <div style={{ 
              backgroundColor: '#222',
              padding: '15px',
              borderRadius: '6px',
              marginBottom: '20px'
            }}>
              <h3 style={{ margin: '0 0 15px 0' }}>Connection Info:</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <div><strong>Host Info:</strong> {connectionResult.hostInfo}</div>
                <div><strong>Server Version:</strong> {connectionResult.serverVersion}</div>
                <div><strong>Database:</strong> {connectionResult.database}</div>
                <div><strong>Connected:</strong> {connectionResult.connected ? 'Yes' : 'No'}</div>
              </div>
            </div>
          )}

          {/* Tables List */}
          {tables.length > 0 && (
            <div>
              <h3 style={{ margin: '0 0 15px 0' }}>Tables ({tables.length}):</h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
                gap: '10px' 
              }}>
                {tables.map((table, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '10px',
                      backgroundColor: '#333',
                      border: '1px solid #555',
                      borderRadius: '4px',
                      textAlign: 'center'
                    }}
                  >
                    {table}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Users List */}
        <div style={{ 
          padding: '20px',
          border: '1px solid pink',
          borderRadius: '8px'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Users with Database Config ({users.length})</h2>
          {users.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#aaa' }}>Tidak ada user dengan konfigurasi database</p>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '15px' 
            }}>
              {users.map(user => (
                <div 
                  key={user.id}
                  onClick={() => handleUserSelect(user)}
                  style={{
                    padding: '15px',
                    backgroundColor: selectedUser?.id === user.id ? '#444' : '#222',
                    border: selectedUser?.id === user.id ? '2px solid pink' : '1px solid #444',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div><strong>Username:</strong> {user.username}</div>
                  <div><strong>Host:</strong> {user.host}</div>
                  <div><strong>Database:</strong> {user.dbname}</div>
                  {user.tabel && <div><strong>Tabel:</strong> {user.tabel}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Connect;