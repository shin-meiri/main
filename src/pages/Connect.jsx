// src/pages/Connect.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Connect = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [testResult, setTestResult] = useState('');
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

  // Load data user dari API
  const loadUserData = useCallback(async () => {
    try {
      const response = await axios.get('/api/dat.json');
      const validUsers = (response.data.users || []).filter(user => 
        user.host && user.dbname && user.username && user.password
      );
      setUsers(validUsers);
      
      // Set user pertama sebagai default jika ada
      if (validUsers.length > 0 && !selectedUser) {
        setSelectedUser(validUsers[0].id.toString());
      }
    } catch (err) {
      console.error('Error loading user data:', err);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (currentUser) {
      loadUserData();
    }
  }, [currentUser, loadUserData]);

  // Handle perubahan user selection
  const handleUserChange = (userId) => {
    setSelectedUser(userId);
    setSelectedTable('');
    setTables([]);
    setTestResult('');
  };

  // Test connection ke database
  const testConnection = async () => {
    if (!selectedUser) {
      setTestResult('Please select a user first');
      return;
    }

    setLoading(true);
    setTestResult('');
    
    try {
      const selectedUserData = users.find(user => user.id.toString() === selectedUser);
      
      if (!selectedUserData) {
        throw new Error('User data not found');
      }

      // Simulasi test connection (dalam aplikasi nyata, ini akan menghubungi backend API)
      // Untuk demo, kita akan menggunakan fetch API ke endpoint khusus
      const response = await fetch('/api/test-connection.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          host: selectedUserData.host,
          username: selectedUserData.username,
          password: selectedUserData.password,
          dbname: selectedUserData.dbname
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setTestResult('✅ Connection successful!');
        // Jika berhasil, load tables
        loadTables(selectedUserData);
      } else {
        setTestResult(`❌ Connection failed: ${result.message}`);
      }
    } catch (err) {
      setTestResult(`❌ Connection failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Load tables dari database
  const loadTables = async (userData) => {
    try {
      // Simulasi load tables (dalam aplikasi nyata, ini akan menghubungi backend API)
      const response = await fetch('/api/get-tables.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          host: userData.host,
          username: userData.username,
          password: userData.password,
          dbname: userData.dbname
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setTables(result.tables || []);
        if (result.tables && result.tables.length > 0) {
          setSelectedTable(result.tables[0]);
        }
      } else {
        setTables([]);
        setSelectedTable('');
      }
    } catch (err) {
      console.error('Error loading tables:', err);
      setTables([]);
      setSelectedTable('');
    }
  };

  // Handle test connection button click
  const handleTestConnection = () => {
    testConnection();
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    navigate('/login');
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
      {/* Header dengan tombol logout */}
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
          Database Connection
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '14px', color: '#aaa' }}>
            Welcome, {currentUser.username}
          </span>
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

      {/* Connection Form */}
      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto 30px auto',
        padding: '20px',
        border: '1px solid pink',
        borderRadius: '8px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>MySQL Connection</h2>
        
        {/* User Selection */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>Select Database Connection:</label>
          <select
            value={selectedUser}
            onChange={(e) => handleUserChange(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#333',
              color: 'pink',
              border: '1px solid #555',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          >
            <option value="">-- Select Connection --</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.username}@{user.host}/{user.dbname}
              </option>
            ))}
          </select>
        </div>

        {/* Connection Info */}
        {selectedUser && (
          <div style={{ 
            backgroundColor: '#333', 
            padding: '15px', 
            borderRadius: '6px', 
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            <div><strong>Host:</strong> {users.find(u => u.id.toString() === selectedUser)?.host}</div>
            <div><strong>Database:</strong> {users.find(u => u.id.toString() === selectedUser)?.dbname}</div>
            <div><strong>Username:</strong> {users.find(u => u.id.toString() === selectedUser)?.username}</div>
          </div>
        )}

        {/* Test Connection Button */}
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={handleTestConnection}
            disabled={!selectedUser || loading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: (!selectedUser || loading) ? '#555' : 'pink',
              color: (!selectedUser || loading) ? '#888' : 'black',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: (!selectedUser || loading) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            {loading ? (
              <>
                <span>Testing...</span>
              </>
            ) : (
              <>
                <span>🔁 Test Connection</span>
              </>
            )}
          </button>
        </div>

        {/* Test Result */}
        {testResult && (
          <div style={{ 
            padding: '15px', 
            borderRadius: '6px', 
            marginBottom: '20px',
            backgroundColor: testResult.includes('✅') ? '#2d5a2d' : '#7a2d2d',
            border: `1px solid ${testResult.includes('✅') ? '#4caf50' : '#f44336'}`,
            textAlign: 'center'
          }}>
            {testResult}
          </div>
        )}

        {/* Table Selection (hanya muncul jika koneksi berhasil) */}
        {tables.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Select Table:</label>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#333',
                color: 'pink',
                border: '1px solid #555',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            >
              {tables.map((table, index) => (
                <option key={index} value={table}>
                  {table}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Daftar Koneksi yang Tersedia */}
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        padding: '20px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
          Available Database Connections ({users.length})
        </h2>
        {users.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#aaa' }}>
            No database connections found. Please add users with database information in the main page.
          </p>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '15px' 
          }}>
            {users.map(user => (
              <div 
                key={user.id}
                onClick={() => handleUserChange(user.id.toString())}
                style={{
                  padding: '15px',
                  backgroundColor: selectedUser === user.id.toString() ? '#444' : '#222',
                  border: selectedUser === user.id.toString() ? '2px solid pink' : '1px solid #444',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  marginBottom: '10px',
                  color: selectedUser === user.id.toString() ? 'pink' : 'inherit'
                }}>
                  {user.username}@{user.host}
                </div>
                <div><strong>Database:</strong> {user.dbname}</div>
                {user.tabel && <div><strong>Table:</strong> {user.tabel}</div>}
                <div style={{ 
                  fontSize: '12px', 
                  color: '#888', 
                  marginTop: '10px' 
                }}>
                  ID: {user.id}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Connect;