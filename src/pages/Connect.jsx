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
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
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

  // Test connection to MySQL
  const testConnection = async () => {
    if (!connectionConfig.host || !connectionConfig.username || 
        !connectionConfig.password || !connectionConfig.database) {
      setConnectionStatus('All fields are required!');
      return;
    }

    setLoading(true);
    setConnectionStatus('Testing connection...');

    try {
      const response = await axios.post('/api/test-connection.php', {
        host: connectionConfig.host,
        dbname: connectionConfig.database,
        username: connectionConfig.username,
        password: connectionConfig.password
      });

      if (response.data.success) {
        setConnectionStatus('Connection successful!');
        setIsConnected(true);
      } else {
        setConnectionStatus(`Connection failed: ${response.data.error}`);
        setIsConnected(false);
      }
    } catch (err) {
      setConnectionStatus(`Connection error: ${err.response?.data?.error || err.message}`);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  // Get tables from database
  const getTables = async () => {
    if (!isConnected) return;

    setLoading(true);
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
        setConnectionStatus(`Found ${response.data.tables?.length || 0} tables`);
      } else {
        setConnectionStatus(`Failed to fetch tables: ${response.data.error}`);
      }
    } catch (err) {
      setConnectionStatus(`Error fetching tables: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Get table data
  const getTableData = async (tableName) => {
    if (!isConnected || !tableName) return;

    setLoading(true);
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
        setConnectionStatus(`Displaying data from ${tableName}`);
      } else {
        setConnectionStatus(`Failed to fetch data: ${response.data.error}`);
      }
    } catch (err) {
      setConnectionStatus(`Error fetching data: ${err.response?.data?.error || err.message}`);
      console.error('getTableData error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Start editing row
  const startEditingRow = (rowIndex) => {
    setEditingRow(rowIndex);
    const rowData = tableData[rowIndex] || {};
    setEditingData({ ...rowData });
  };

  // Save edited row
  const saveEditedRow = async () => {
    if (editingRow === null || !isConnected || !selectedTable) return;

    setLoading(true);
    setConnectionStatus('Updating row...');

    try {
      const response = await axios.post('/api/update-row.php', {
        host: connectionConfig.host,
        dbname: connectionConfig.database,
        username: connectionConfig.username,
        password: connectionConfig.password,
        table: selectedTable,
        data: editingData,
        primaryKey: tableColumns[0]?.Field || Object.keys(editingData)[0],
        primaryKeyValue: tableData[editingRow][tableColumns[0]?.Field || Object.keys(editingData)[0]]
      });

      if (response.data.success) {
        setConnectionStatus('Row updated successfully!');
        getTableData(selectedTable);
        setEditingRow(null);
        setEditingData({});
      } else {
        setConnectionStatus(`Failed to update row: ${response.data.error}`);
      }
    } catch (err) {
      setConnectionStatus(`Error updating row: ${err.response?.data?.error || err.message}`);
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
    setConnectionConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditInputChange = (field, value) => {
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
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '10px',
          borderBottom: '1px solid #eee'
        }}>
          <h1>MySQL Database Manager</h1>
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
            backgroundColor: connectionStatus.includes('successful') ? '#d4edda' : '#f8d7da',
            color: connectionStatus.includes('successful') ? '#155724' : '#721c24',
            border: `1px solid ${connectionStatus.includes('successful') ? '#c3e6cb' : '#f5c6cb'}`,
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            {connectionStatus}
          </div>
        )}

        <div style={{ marginBottom: '30px' }}>
          <h2>Database Connection</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label>Host:</label>
              <input
                type="text"
                value={connectionConfig.host}
                onChange={(e) => handleInputChange('host', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  marginTop: '5px'
                }}
                placeholder="localhost"
              />
            </div>
            <div>
              <label>Username:</label>
              <input
                type="text"
                value={connectionConfig.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  marginTop: '5px'
                }}
                placeholder="root"
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                value={connectionConfig.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  marginTop: '5px'
                }}
                placeholder="password"
              />
            </div>
            <div>
              <label>Database:</label>
              <input
                type="text"
                value={connectionConfig.database}
                onChange={(e) => handleInputChange('database', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  marginTop: '5px'
                }}
                placeholder="my_database"
              />
            </div>
          </div>
          <button
            onClick={testConnection}
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: loading ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Connecting...' : 'Test Connection'}
          </button>
        </div>

        {isConnected && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h2>Tables</h2>
              <button
                onClick={getTables}
                disabled={loading}
                style={{
                  padding: '8px 15px',
                  backgroundColor: loading ? '#6c757d' : '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginRight: '10px'
                }}
              >
                {loading ? 'Loading...' : 'Get Tables'}
              </button>
              <div style={{ marginTop: '10px' }}>
                {tables.map((table, index) => (
                  <button
                    key={index}
                    onClick={() => getTableData(table)}
                    disabled={loading}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: selectedTable === table ? '#ffc107' : '#6c757d',
                      color: selectedTable === table ? '#212529' : 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      marginRight: '5px',
                      marginBottom: '5px'
                    }}
                  >
                    {table}
                  </button>
                ))}
              </div>
            </div>

            {tableData.length > 0 && (
              <div>
                <h2>Data from table: {selectedTable}</h2>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    border: '1px solid #ddd'
                  }}>
                    <thead>
                      <tr>
                        {tableColumns.map((column, index) => (
                          <th 
                            key={index}
                            style={{
                              border: '1px solid #ddd',
                              padding: '10px',
                              backgroundColor: '#f8f9fa',
                              textAlign: 'left'
                            }}
                          >
                            {column.Field || column}
                          </th>
                        ))}
                        <th 
                          style={{
                            border: '1px solid #ddd',
                            padding: '10px',
                            backgroundColor: '#f8f9fa',
                            textAlign: 'center'
                          }}
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((row, rowIndex) => (
                        <React.Fragment key={rowIndex}>
                          <tr>
                            {tableColumns.map((column, cellIndex) => (
                              <td 
                                key={cellIndex}
                                style={{
                                  border: '1px solid #ddd',
                                  padding: '8px',
                                  backgroundColor: rowIndex % 2 === 0 ? '#fff' : '#f8f9fa'
                                }}
                              >
                                {row[column.Field || column] !== null ? 
                                 String(row[column.Field || column]) : 'NULL'}
                              </td>
                            ))}
                            <td 
                              style={{
                                border: '1px solid #ddd',
                                padding: '8px',
                                textAlign: 'center'
                              }}
                            >
                              <button
                                onClick={() => startEditingRow(rowIndex)}
                                style={{
                                  padding: '4px 8px',
                                  backgroundColor: '#007bff',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '3px',
                                  cursor: 'pointer',
                                  fontSize: '12px'
                                }}
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                          
                          {editingRow === rowIndex && (
                            <tr>
                              <td 
                                colSpan={tableColumns.length + 1}
                                style={{
                                  padding: '15px',
                                  backgroundColor: '#e9ecef',
                                  border: '1px solid #ddd'
                                }}
                              >
                                <h3>Edit Row</h3>
                                <div style={{ 
                                  display: 'grid', 
                                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                                  gap: '10px',
                                  marginBottom: '15px'
                                }}>
                                  {tableColumns.map((column) => (
                                    <div key={column.Field}>
                                      <label style={{ 
                                        display: 'block', 
                                        fontSize: '12px', 
                                        marginBottom: '3px' 
                                      }}>
                                        {column.Field}
                                      </label>
                                      <input
                                        type="text"
                                        value={editingData[column.Field] || ''}
                                        onChange={(e) => handleEditInputChange(column.Field, e.target.value)}
                                        style={{
                                          width: '100%',
                                          padding: '6px',
                                          border: '1px solid #ddd',
                                          borderRadius: '3px'
                                        }}
                                      />
                                    </div>
                                  ))}
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
                                      borderRadius: '3px',
                                      cursor: loading ? 'not-allowed' : 'pointer',
                                      fontSize: '12px'
                                    }}
                                  >
                                    {loading ? 'Saving...' : 'Save'}
                                  </button>
                                  <button
                                    onClick={cancelEditing}
                                    style={{
                                      padding: '6px 12px',
                                      backgroundColor: '#dc3545',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '3px',
                                      cursor: 'pointer',
                                      fontSize: '12px'
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Connect;