// src/pages/Connect.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Connect = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('');
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

  // Fetch data users dari API
  useEffect(() => {
    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/dat.json');
      const userData = response.data.users || [];
      setUsers(userData);
      
      // Jika hanya ada satu user, pilih otomatis
      if (userData.length === 1) {
        setSelectedUser(userData[0].id.toString());
        handleUserSelect({ target: { value: userData[0].id.toString() } });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Handle user selection
  const handleUserSelect = async (e) => {
    const userId = e.target.value;
    setSelectedUser(userId);
    setSelectedTable('');
    setTables([]);
    setTestResult('');
    
    if (userId) {
      const user = users.find(u => u.id === parseInt(userId));
      if (user && user.host && user.dbname) {
        // Test connection saat user dipilih
        await testConnection(user);
        // Fetch tables
        await fetchTables(user);
      }
    }
  };

  // Test connection to MySQL
  const testConnection = async (user = null) => {
    const userData = user || users.find(u => u.id === parseInt(selectedUser));
    
    if (!userData || !userData.host || !userData.dbname) {
      setTestResult('❌ Host dan Database Name harus diisi!');
      return;
    }

    setLoading(true);
    setTestResult('');
    setConnectionStatus('Testing...');

    try {
      // Di sini biasanya akan ada API endpoint untuk test koneksi
      // Karena ini simulasi, kita akan membuat response dummy
      // Dalam implementasi nyata, ini akan menghubungi backend PHP untuk test koneksi MySQL
      
      // Simulasi delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulasi response sukses
      setTestResult(`✅ Connected to ${userData.host}:${userData.dbname}`);
      setConnectionStatus('connected');
    } catch (error) {
      setTestResult(`❌ Connection failed: ${error.message}`);
      setConnectionStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  // Fetch tables from database
  const fetchTables = async (user = null) => {
    const userData = user || users.find(u => u.id === parseInt(selectedUser));
    
    if (!userData || !userData.host || !userData.dbname) {
      return;
    }

    try {
      // Di sini biasanya akan ada API endpoint untuk fetch tables
      // Karena ini simulasi, kita akan membuat data dummy
      
      // Simulasi tabel-tabel umum
      const dummyTables = [
        'users', 'products', 'orders', 'customers', 
        'categories', 'settings', 'logs', 'sessions'
      ];
      
      setTables(dummyTables);
      
      // Pilih tabel pertama secara otomatis jika hanya ada satu
      if (dummyTables.length === 1) {
        setSelectedTable(dummyTables[0]);
      }
    } catch (error) {
      console.error('Error fetching tables:', error);
      setTables([]);
    }
  };

  // Handle table selection
  const handleTableSelect = (e) => {
    setSelectedTable(e.target.value);
  };

  // Handle refresh/test connection
  const handleRefresh = () => {
    if (selectedUser) {
      const user = users.find(u => u.id === parseInt(selectedUser));
      if (user) {
        testConnection(user);
        fetchTables(user);
      }
    }
  };

  // Handle back to main page
  const handleBack = () => {
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
            onClick={handleBack}
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
            Back to Main
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
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
          Database Connection
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* User Selection */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>
              Select User Configuration:
            </label>
            <select
              value={selectedUser}
              onChange={handleUserSelect}
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
              <option value="">-- Pilih User --</option>
              {users
                .filter(user => user.host && user.dbname) // Hanya user dengan host dan dbname
                .map(user => (
                  <option key={user.id} value={user.id}>
                    {user.username} - {user.host}/{user.dbname}
                  </option>
                ))}
            </select>
          </div>

          {/* Connection Info */}
          {selectedUser && (() => {
            const user = users.find(u => u.id === parseInt(selectedUser));
            return user ? (
              <div style={{
                backgroundColor: '#222',
                padding: '15px',
                borderRadius: '6px',
                border: '1px solid #444'
              }}>
                <h3 style={{ margin: '0 0 10px 0' }}>Connection Details:</h3>
                <div><strong>Username:</strong> {user.username}</div>
                <div><strong>Host:</strong> {user.host || 'Not set'}</div>
                <div><strong>Database:</strong> {user.dbname || 'Not set'}</div>
                {user.tabel && <div><strong>Default Table:</strong> {user.tabel}</div>}
              </div>
            ) : null;
          })()}

          {/* Table Selection */}
          {selectedUser && tables.length > 0 && (
            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>
                Select Table:
              </label>
              <select
                value={selectedTable}
                onChange={handleTableSelect}
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
                <option value="">-- Pilih Tabel --</option>
                {tables.map((table, index) => (
                  <option key={index} value={table}>
                    {table}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Test Connection Button */}
          {selectedUser && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleRefresh}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: loading ? '#555' : 'pink',
                  color: loading ? '#888' : 'black',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {loading ? 'Testing...' : '🔁 Test Connection'}
              </button>
            </div>
          )}

          {/* Test Result */}
          {testResult && (
            <div style={{
              padding: '15px',
              backgroundColor: testResult.includes('✅') ? '#2d5a2d' : '#5a2d2d',
              border: '1px solid',
              borderColor: testResult.includes('✅') ? '#4caf50' : '#f44336',
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              {testResult}
            </div>
          )}

          {/* Info Message */}
          {!selectedUser && (
            <div style={{
              padding: '15px',
              backgroundColor: '#333',
              border: '1px solid #555',
              borderRadius: '6px',
              textAlign: 'center',
              fontSize: '14px'
            }}>
              <p>💡 Pilih user configuration yang memiliki Host dan Database Name untuk menguji koneksi MySQL.</p>
              <p>📝 Pastikan user yang dipilih memiliki informasi koneksi database yang lengkap.</p>
            </div>
          )}
        </div>
      </div>

      {/* User List */}
      <div style={{ 
        maxWidth: '1000px', 
        margin: '0 auto',
        padding: '20px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
          User Configurations ({users.length})
        </h2>
        
        {users.length === 0 ? (
          <p style={{ textAlign: 'center' }}>Belum ada user configuration</p>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '15px' 
          }}>
            {users.map(user => (
              <div 
                key={user.id}
                style={{
                  padding: '15px',
                  backgroundColor: selectedUser === user.id.toString() ? '#444' : '#222',
                  border: selectedUser === user.id.toString() ? '2px solid pink' : '1px solid #444',
                  borderRadius: '6px',
                  position: 'relative'
                }}
              >
                <div><strong>ID:</strong> {user.id}</div>
                <div><strong>Username:</strong> {user.username}</div>
                <div><strong>Password:</strong> {'•'.repeat(user.password.length)}</div>
                <div><strong>Host:</strong> {user.host || 'Not set'}</div>
                <div><strong>DB Name:</strong> {user.dbname || 'Not set'}</div>
                {user.tabel && <div><strong>Tabel:</strong> {user.tabel}</div>}
                
                {!user.host && !user.dbname && (
                  <div style={{ 
                    marginTop: '10px',
                    padding: '8px',
                    backgroundColor: '#5a2d2d',
                    border: '1px solid #f44336',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    ⚠️ Incomplete configuration
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Connect;