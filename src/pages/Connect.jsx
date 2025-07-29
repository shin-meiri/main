// src/pages/Connect.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Connect = () => {
  const [connectionConfig, setConnectionConfig] = useState({
    host: 'localhost',
    username: '',
    password: '',
    database: ''
  });
  const [isConnected, setIsConnected] = useState(false);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [tableData, setTableData] = useState([]);
  const [tableColumns, setTableColumns] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('');
  const [loading, setLoading] = useState({ 
    connection: false, 
    tables: false, 
     false 
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [addingRow, setAddingRow] = useState(false);
  const [addingData, setAddingData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
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
      console.error('Error fetching ', err);
    }
  };

  // Test connection to MySQL
  const testConnection = async () => {
    if (!connectionConfig.host || !connectionConfig.username || 
        !connectionConfig.password || !connectionConfig.database) {
      setConnectionStatus('❌ All fields are required!');
      return;
    }

    setLoading(prev => ({ ...prev, connection: true }));
    setConnectionStatus('Testing connection...');

    try {
      const response = await axios.post('/api/test-connection.php', {
        host: connectionConfig.host,
        dbname: connectionConfig.database,
        username: connectionConfig.username,
        password: connectionConfig.password
      });

      if (response.data.success) {
        setConnectionStatus('✅ Connection successful!');
        setIsConnected(true);
      } else {
        setConnectionStatus(`❌ Connection failed: ${response.data.error}`);
        setIsConnected(false);
      }
    } catch (err) {
      setConnectionStatus(`❌ Connection error: ${err.response?.data?.error || err.message}`);
      setIsConnected(false);
    } finally {
      setLoading(prev => ({ ...prev, connection: false }));
    }
  };

  // Get tables from database
  const getTables = async () => {
    if (!isConnected) return;
    
    setLoading(prev => ({ ...prev, tables: true }));
    setConnectionStatus('Fetching tables...');

    try {
      const response = await axios.post('/api/get-tables.php', {
        host: connectionConfig.host,
        dbname: connectionConfig.database,
        username: connectionConfig.username,
        password: connectionConfig.password
      });

      if (response.data.success) {
        setTables(response.data.tables || []);
        setConnectionStatus(`✅ Found ${response.data.tables?.length || 0} tables`);
      } else {
        setConnectionStatus(`❌ Failed to fetch tables: ${response.data.error}`);
      }
    } catch (err) {
      setConnectionStatus(`❌ Error fetching tables: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, tables: false }));
    }
  };

  // Get table data
  const getTableData = async (tableName) => {
    if (!isConnected || !tableName) return;

    setLoading(prev => ({ ...prev,  true }));
    setSelectedTable(tableName);
    setConnectionStatus(`Fetching data from ${tableName}...`);

    try {
      const response = await axios.post('/api/get-table-data.php', {
        host: connectionConfig.host,
        dbname: connectionConfig.database,
        username: connectionConfig.username,
        password: connectionConfig.password,
        table: tableName
      });

      if (response.data && response.data.success) {
        setTableData(response.data.data || []);
        setTableColumns(response.data.columns || []);
        setConnectionStatus(`✅ Displaying data from ${tableName}`);
      } else {
        setConnectionStatus(`❌ Failed to fetch  ${response.data.error}`);
      }
    } catch (err) {
      setConnectionStatus(`❌ Error fetching  ${err.response?.data?.error || err.message}`);
      console.error('getTableData error:', err);
    } finally {
      setLoading(prev => ({ ...prev,  false }));
    }
  };

  // Insert new row
  const insertRow = async () => {
    if (!isConnected || !selectedTable) return;

    setLoading(prev => ({ ...prev,  true }));
    setConnectionStatus('Inserting new row...');

    try {
      const response = await axios.post('/api/insert-row.php', {
        host: connectionConfig.host,
        dbname: connectionConfig.database,
        username: connectionConfig.username,
        password: connectionConfig.password,
        table: selectedTable,
         addingData
      });

      if (response.data.success) {
        setConnectionStatus('✅ Row inserted successfully!');
        setAddingRow(false);
        setAddingData({});
        // Refresh table data
        getTableData(selectedTable);
      } else {
        setConnectionStatus(`❌ Failed to insert row: ${response.data.error}`);
      }
    } catch (err) {
      setConnectionStatus(`❌ Error inserting row: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(prev => ({ ...prev,  false }));
    }
  };

  // Update row
  const updateRow = async () => {
    if (!isConnected || !selectedTable || editingRow === null) return;

    setLoading(prev => ({ ...prev,  true }));
    setConnectionStatus('Updating row...');

    try {
      const response = await axios.post('/api/update-row.php', {
        host: connectionConfig.host,
        dbname: connectionConfig.database,
        username: connectionConfig.username,
        password: connectionConfig.password,
        table: selectedTable,
         editingData,
        primaryKey: tableColumns[0]?.Field || Object.keys(editingData)[0],
        primaryKeyValue: tableData[editingRow][tableColumns[0]?.Field || Object.keys(editingData)[0]]
      });

      if (response.data.success) {
        setConnectionStatus('✅ Row updated successfully!');
        setEditingRow(null);
        setEditingData({});
        // Refresh table data
        getTableData(selectedTable);
      } else {
        setConnectionStatus(`❌ Failed to update row: ${response.data.error}`);
      }
    } catch (err) {
      setConnectionStatus(`❌ Error updating row: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(prev => ({ ...prev,  false }));
    }
  };

  // Delete row
  const deleteRow = async (rowIndex) => {
    if (!isConnected || !selectedTable) return;

    if (window.confirm('Are you sure you want to delete this row?')) {
      setLoading(prev => ({ ...prev,  true }));
      setConnectionStatus('Deleting row...');

      try {
        const primaryKey = tableColumns[0]?.Field || Object.keys(tableData[rowIndex])[0];
        const primaryKeyValue = tableData[rowIndex][primaryKey];

        const response = await axios.post('/api/delete-row.php', {
          host: connectionConfig.host,
          dbname: connectionConfig.database,
          username: connectionConfig.username,
          password: connectionConfig.password,
          table: selectedTable,
          primaryKey: primaryKey,
          primaryKeyValue: primaryKeyValue
        });

        if (response.data.success) {
          setConnectionStatus('✅ Row deleted successfully!');
          // Refresh table data
          getTableData(selectedTable);
        } else {
          setConnectionStatus(`❌ Failed to delete row: ${response.data.error}`);
        }
      } catch (err) {
        setConnectionStatus(`❌ Error deleting row: ${err.response?.data?.error || err.message}`);
      } finally {
        setLoading(prev => ({ ...prev,  false }));
      }
    }
  };

  // Start editing row
  const startEditingRow = (rowIndex) => {
    setEditingRow(rowIndex);
    const rowData = tableData[rowIndex] || {};
    setEditingData({ ...rowData });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingRow(null);
    setEditingData({});
  };

  // Start adding new row
  const startAddingRow = () => {
    if (!selectedTable) return;

    const newRowData = {};
    tableColumns.forEach(col => {
      newRowData[col.Field] = '';
    });

    setAddingRow(true);
    setAddingData(newRowData);
  };

  // Cancel adding
  const cancelAdding = () => {
    setAddingRow(false);
    setAddingData({});
  };

  // Handle input changes
  const handleConfigChange = (field, value) => {
    setConnectionConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditingChange = (field, value) => {
    setEditingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddingChange = (field, value) => {
    setAddingData(prev => ({
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
      minHeight: '100vh',
      backgroundColor: '#1a1a2e',
      color: '#e0e0e0',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        zIndex: -1,
        opacity: 0.9
      }}></div>

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
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ 
          fontSize: '2rem',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
        }}>
          🚀 MySQL Database Manager
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '14px', color: '#a0a0c0' }}>
            👤 Welcome, <strong style={{ color: '#4ecdc4' }}>{currentUser.username}</strong>
          </span>
          <button
            onClick={goToMainPage}
            style={{
              padding: '10px 20px',
              backgroundColor: 'rgba(78, 205, 196, 0.2)',
              color: '#4ecdc4',
              border: '1px solid #4ecdc4',
              borderRadius: '25px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(5px)'
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
              padding: '10px 20px',
              backgroundColor: 'rgba(255, 107, 107, 0.2)',
              color: '#ff6b6b',
              border: '1px solid #ff6b6b',
              borderRadius: '25px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(5px)'
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

      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto',
        padding: '20px'
      }}>
        {/* Connection Status */}
        {connectionStatus && (
          <div style={{
            padding: '15px 20px',
            backgroundColor: connectionStatus.includes('✅') ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
            border: `1px solid ${connectionStatus.includes('✅') ? '#4CAF50' : '#f44336'}`,
            borderRadius: '10px',
            marginBottom: '25px',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '16px',
            backdropFilter: 'blur(5px)',
            animation: 'fadeIn 0.5s ease-in'
          }}>
            {connectionStatus}
          </div>
        )}

        {/* Connection Configuration */}
        <div style={{ 
          padding: '25px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          marginBottom: '30px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{ 
            textAlign: 'center', 
            marginBottom: '25px',
            color: '#4ecdc4',
            fontSize: '1.8rem',
            fontWeight: 'bold'
          }}>
            🔌 Database Connection
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '12px', 
                marginBottom: '5px',
                color: '#a0a0c0'
              }}>
                Host
              </label>
              <input
                type="text"
                value={connectionConfig.host}
                onChange={(e) => handleConfigChange('host', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                placeholder="localhost"
              />
            </div>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '12px', 
                marginBottom: '5px',
                color: '#a0a0c0'
              }}>
                Username
              </label>
              <input
                type="text"
                value={connectionConfig.username}
                onChange={(e) => handleConfigChange('username', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                placeholder="root"
              />
            </div>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '12px', 
                marginBottom: '5px',
                color: '#a0a0c0'
              }}>
                Password
              </label>
              <input
                type="password"
                value={connectionConfig.password}
                onChange={(e) => handleConfigChange('password', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                placeholder="password"
              />
            </div>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '12px', 
                marginBottom: '5px',
                color: '#a0a0c0'
              }}>
                Database
              </label>
              <input
                type="text"
                value={connectionConfig.database}
                onChange={(e) => handleConfigChange('database', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                placeholder="my_database"
              />
            </div>
          </div>
          <button
            onClick={testConnection}
            disabled={loading.connection}
            style={{
              padding: '12px 25px',
              backgroundColor: loading.connection ? 'rgba(255, 255, 255, 0.1)' : 'rgba(78, 205, 196, 0.3)',
              color: loading.connection ? '#888' : '#4ecdc4',
              border: '1px solid #4ecdc4',
              borderRadius: '25px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: loading.connection ? 'not-allowed' : 'pointer',
              width: '100%',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              if (!loading.connection) {
                e.target.style.backgroundColor = 'rgba(78, 205, 196, 0.4)';
                e.target.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseOut={(e) => {
              if (!loading.connection) {
                e.target.style.backgroundColor = 'rgba(78, 205, 196, 0.3)';
                e.target.style.transform = 'translateY(0)';
              }
            }}
          >
            {loading.connection ? '🔄 Connecting...' : '🔌 Connect to Database'}
          </button>
        </div>

        {/* Database Content */}
        {isConnected && (
          <div style={{ 
            padding: '25px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            marginBottom: '30px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '25px'
            }}>
              <h2 style={{ 
                margin: 0,
                color: '#ffd93d',
                fontSize: '1.8rem',
                fontWeight: 'bold'
              }}>
                🗄️ {connectionConfig.database}
              </h2>
              <button
                onClick={getTables}
                disabled={loading.tables}
                style={{
                  padding: '10px 20px',
                  backgroundColor: loading.tables ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 217, 61, 0.2)',
                  color: loading.tables ? '#888' : '#ffd93d',
                  border: '1px solid #ffd93d',
                  borderRadius: '25px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: loading.tables ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  if (!loading.tables) {
                    e.target.style.backgroundColor = 'rgba(255, 217, 61, 0.3)';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!loading.tables) {
                    e.target.style.backgroundColor = 'rgba(255, 217, 61, 0.2)';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                {loading.tables ? '🔄 Loading...' : '📋 Refresh Tables'}
              </button>
            </div>

            {/* Tables List */}
            {tables.length > 0 && (
              <div style={{ 
                marginBottom: '30px'
              }}>
                <h3 style={{ 
                  color: '#4ecdc4',
                  marginBottom: '15px'
                }}>
                  📋 Tables ({tables.length})
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
                  gap: '10px' 
                }}>
                  {tables.map((table, index) => (
                    <button
                      key={index}
                      onClick={() => getTableData(table)}
                      disabled={loading.data && selectedTable === table}
                      style={{
                        padding: '10px 15px',
                        backgroundColor: selectedTable === table ? 'rgba(255, 217, 61, 0.3)' : 'rgba(255, 255, 255, 0.08)',
                        color: selectedTable === table ? '#ffd93d' : '#e0e0e0',
                        border: selectedTable === table ? '2px solid #ffd93d' : '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '20px',
                        cursor: loading.data && selectedTable === table ? 'not-allowed' : 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        if (!(loading.data && selectedTable === table)) {
                          e.target.style.transform = 'translateY(-3px)';
                          e.target.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!(loading.data && selectedTable === table)) {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }
                      }}
                    >
                      {loading.data && selectedTable === table ? '🔄 Loading...' : table}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Table Data */}
            {tableData.length > 0 && (
              <div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '20px'
                }}>
                  <h2 style={{ 
                    margin: 0,
                    color: '#ff6b6b',
                    fontSize: '1.8rem',
                    fontWeight: 'bold'
                  }}>
                    📊 Data from {selectedTable}
                  </h2>
                  <button
                    onClick={startAddingRow}
                    disabled={addingRow || editingRow !== null}
                    style={{
                      padding: '8px 15px',
                      backgroundColor: 'rgba(78, 205, 196, 0.2)',
                      color: '#4ecdc4',
                      border: '1px solid #4ecdc4',
                      borderRadius: '25px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: addingRow || editingRow !== null ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                    onMouseOver={(e) => {
                      if (!(addingRow || editingRow !== null)) {
                        e.target.style.backgroundColor = 'rgba(78, 205, 196, 0.3)';
                        e.target.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!(addingRow || editingRow !== null)) {
                        e.target.style.backgroundColor = 'rgba(78, 205, 196, 0.2)';
                        e.target.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    ➕ Add New Row
                  </button>
                </div>

                {/* Add new row form */}
                {addingRow && (
                  <div style={{ 
                    marginBottom: '20px',
                    padding: '15px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(78, 205, 196, 0.3)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(5px)'
                  }}>
                    <h3 style={{ 
                      margin: '0 0 15px 0',
                      color: '#4ecdc4',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      📝 Add New Record
                    </h3>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: `repeat(auto-fit, minmax(150px, 1fr))`,
                      gap: '10px',
                      marginBottom: '15px'
                    }}>
                      {tableColumns.map((column) => (
                        <div key={column.Field}>
                          <label style={{ 
                            display: 'block', 
                            fontSize: '11px', 
                            marginBottom: '5px',
                            color: '#a0a0c0'
                          }}>
                            {column.Field}
                          </label>
                          <input
                            type="text"
                            value={addingData[column.Field] || ''}
                            onChange={(e) => handleAddingChange(column.Field, e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              color: '#fff',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              borderRadius: '6px',
                              fontSize: '12px'
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={insertRow}
                        disabled={loading.data}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: loading.data ? 'rgba(255, 255, 255, 0.1)' : 'rgba(76, 175, 80, 0.3)',
                          color: loading.data ? '#888' : '#4CAF50',
                          border: '1px solid #4CAF50',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          cursor: loading.data ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {loading.data ? '💾 Saving...' : '💾 Save Record'}
                      </button>
                      <button
                        onClick={cancelAdding}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          color: '#ff6b6b',
                          border: '1px solid #ff6b6b',
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
                )}

                {/* Edit row form */}
                {editingRow !== null && (
                  <div style={{ 
                    marginBottom: '20px',
                    padding: '15px',
                    backgroundColor: 'rgba(255, 217, 61, 0.1)',
                    border: '1px solid rgba(255, 217, 61, 0.5)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(5px)'
                  }}>
                    <h3 style={{ 
                      margin: '0 0 15px 0',
                      color: '#ffd93d',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      🛠️ Edit Record
                    </h3>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: `repeat(auto-fit, minmax(150px, 1fr))`,
                      gap: '10px',
                      marginBottom: '15px'
                    }}>
                      {tableColumns.map((column) => (
                        <div key={column.Field}>
                          <label style={{ 
                            display: 'block', 
                            fontSize: '11px', 
                            marginBottom: '5px',
                            color: '#a0a0c0'
                          }}>
                            {column.Field}
                          </label>
                          <input
                            type="text"
                            value={editingData[column.Field] || ''}
                            onChange={(e) => handleEditingChange(column.Field, e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              color: '#fff',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              borderRadius: '6px',
                              fontSize: '12px'
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={updateRow}
                        disabled={loading.data}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: loading.data ? 'rgba(255, 255, 255, 0.1)' : 'rgba(76, 175, 80, 0.3)',
                          color: loading.data ? '#888' : '#4CAF50',
                          border: '1px solid #4CAF50',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          cursor: loading.data ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {loading.data ? '💾 Updating...' : '💾 Update Record'}
                      </button>
                      <button
                        onClick={cancelEditing}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          color: '#ff6b6b',
                          border: '1px solid #ff6b6b',
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
                )}

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
                        {tableColumns.map((column, index) => (
                          <th 
                            key={index}
                            style={{
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              padding: '12px',
                              backgroundColor: 'rgba(78, 205, 196, 0.2)',
                              textAlign: 'left',
                              position: 'sticky',
                              top: 0,
                              backdropFilter: 'blur(5px)'
                            }}
                          >
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '8px' 
                            }}>
                              <span>🏷️</span>
                              <span style={{ fontWeight: 'bold' }}>{column.Field}</span>
                            </div>
                          </th>
                        ))}
                        <th 
                          style={{
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            padding: '12px',
                            backgroundColor: 'rgba(78, 205, 196, 0.2)',
                            textAlign: 'center',
                            position: 'sticky',
                            top: 0,
                            backdropFilter: 'blur(5px)'
                          }}
                        >
                          ⚙️ Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((row, rowIndex) => (
                        <tr 
                          key={rowIndex}
                          style={{
                            backgroundColor: rowIndex % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.05)'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.backgroundColor = 'rgba(78, 205, 196, 0.1)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.backgroundColor = rowIndex % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.05)';
                          }}
                        >
                          {tableColumns.map((column, cellIndex) => (
                            <td 
                              key={cellIndex}
                              style={{
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                padding: '10px',
                                backgroundColor: editingRow === rowIndex ? 'rgba(255, 217, 61, 0.1)' : 'inherit'
                              }}
                            >
                              <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px' 
                              }}>
                                <span>📋</span>
                                <span>{row[column.Field] !== null ? String(row[column.Field]) : 'NULL'}</span>
                              </div>
                            </td>
                          ))}
                          <td 
                            style={{
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              padding: '10px',
                              textAlign: 'center'
                            }}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditingRow(rowIndex);
                              }}
                              disabled={editingRow !== null && editingRow !== rowIndex}
                              style={{
                                padding: '5px 10px',
                                backgroundColor: 'rgba(78, 205, 196, 0.2)',
                                color: '#4ecdc4',
                                border: '1px solid #4ecdc4',
                                borderRadius: '15px',
                                fontSize: '11px',
                                cursor: editingRow !== null && editingRow !== rowIndex ? 'not-allowed' : 'pointer',
                                marginRight: '5px'
                              }}
                            >
                              ✏️
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteRow(rowIndex);
                              }}
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
                  Menampilkan {tableData.length} baris data
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

{/*export default Connect;*/}
            {/* Additional Styles */}
            <style jsx>{`
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
              }
              
              ::-webkit-scrollbar {
                width: 8px;
                height: 8px;
              }
              
              ::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 4px;
              }
              
              ::-webkit-scrollbar-thumb {
                background: rgba(78, 205, 196, 0.5);
                border-radius: 4px;
              }
              
              ::-webkit-scrollbar-thumb:hover {
                background: rgba(78, 205, 196, 0.8);
              }
              
              input:focus, textarea:focus, select:focus {
                outline: none;
                border-color: #4ecdc4 !important;
                box-shadow: 0 0 5px rgba(78, 205, 196, 0.5);
              }
              
              button:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
              }
              
              button:active:not(:disabled) {
                transform: translateY(0);
              }
              
              table {
                border-collapse: separate;
                border-spacing: 0;
              }
              
              th:first-child {
                border-top-left-radius: 8px;
              }
              
              th:last-child {
                border-top-right-radius: 8px;
              }
              
              tr:last-child td:first-child {
                border-bottom-left-radius: 8px;
              }
              
              tr:last-child td:last-child {
                border-bottom-right-radius: 8px;
              }
              
              @media (max-width: 768px) {
                .container {
                  padding: 10px;
                }
                
                .grid-responsive {
                  grid-template-columns: 1fr;
                }
                
                .hide-mobile {
                  display: none;
                }
              }
              
              .pulse {
                animation: pulse 2s infinite;
              }
              
              @keyframes pulse {
                0% {
                  box-shadow: 0 0 0 0 rgba(78, 205, 196, 0.4);
                }
                70% {
                  box-shadow: 0 0 0 10px rgba(78, 205, 196, 0);
                }
                100% {
                  box-shadow: 0 0 0 0 rgba(78, 205, 196, 0);
                }
              }
              
              .bounce {
                animation: bounce 1s infinite;
              }
              
              @keyframes bounce {
                0%, 20%, 50%, 80%, 100% {
                  transform: translateY(0);
                }
                40% {
                  transform: translateY(-10px);
                }
                60% {
                  transform: translateY(-5px);
                }
              }
              
              .slide-in {
                animation: slideIn 0.5s ease-out;
              }
              
              @keyframes slideIn {
                from {
                  transform: translateX(-100%);
                  opacity: 0;
                }
                to {
                  transform: translateX(0);
                  opacity: 1;
                }
              }
              
              .fade-in {
                animation: fadeIn 0.5s ease-in;
              }
              
              @keyframes fadeIn {
                from {
                  opacity: 0;
                  transform: translateY(10px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              
              .rotate {
                animation: rotate 2s linear infinite;
              }
              
              @keyframes rotate {
                from {
                  transform: rotate(0deg);
                }
                to {
                  transform: rotate(360deg);
                }
              }
              
              .glow {
                animation: glow 1.5s ease-in-out infinite alternate;
              }
              
              @keyframes glow {
                from {
                  box-shadow: 0 0 5px #4ecdc4;
                }
                to {
                  box-shadow: 0 0 20px #4ecdc4, 0 0 30px #4ecdc4;
                }
              }
              
              .shake {
                animation: shake 0.5s;
              }
              
              @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
              }
              
              .zoom-in {
                animation: zoomIn 0.3s ease-out;
              }
              
              @keyframes zoomIn {
                from {
                  transform: scale(0.8);
                  opacity: 0;
                }
                to {
                  transform: scale(1);
                  opacity: 1;
                }
              }
              
              .flip {
                animation: flip 0.8s;
              }
              
              @keyframes flip {
                from {
                  transform: perspective(400px) rotateY(90deg);
                  opacity: 0;
                }
                to {
                  transform: perspective(400px) rotateY(0deg);
                  opacity: 1;
                }
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
};

export default Connect;