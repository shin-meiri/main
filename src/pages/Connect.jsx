// src/pages/Connect.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Connect = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
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
    if (!selectedUser) {
      setConnectionStatus('❌ Please select a user first!');
      return;
    }

    const user = users.find(u => u.id === parseInt(selectedUser));
    if (!user) {
      setConnectionStatus('❌ User not found!');
      return;
    }

    setLoading(true);
    setConnectionStatus(`Testing connection to ${user.username}...`);

    try {
      const response = await axios.post('/api/test-connection.php', {
        host: user.host,
        dbname: user.dbname,
        username: user.username,
        password: user.password
      });

      if (response.data.success) {
        setConnectionStatus(`✅ Connection successful to ${user.username}!`);
        getTables(user);
      } else {
        setConnectionStatus(`❌ Connection failed: ${response.data.error}`);
      }
    } catch (err) {
      setConnectionStatus(`❌ Connection error: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Get tables from selected database
  const getTables = async (user) => {
    if (!user) return;

    setLoading(true);
    setConnectionStatus(`Fetching tables from ${user.username}...`);

    try {
      const response = await axios.post('/api/get-tables.php', {
        host: user.host,
        dbname: user.dbname,
        username: user.username,
        password: user.password
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
      setLoading(false);
    }
  };

  // Get table data
  const getTableData = async () => {
    if (!selectedTable) {
      setConnectionStatus('❌ Please select a table first!');
      return;
    }

    const user = users.find(u => u.id === parseInt(selectedUser));
    if (!user) {
      setConnectionStatus('❌ User not found!');
      return;
    }

    setLoading(true);
    setConnectionStatus(`Fetching data from ${selectedTable}...`);

    try {
      const response = await axios.post('/api/get-table-data.php', {
        host: user.host,
        dbname: user.dbname,
        username: user.username,
        password: user.password,
        table: selectedTable
      });

      if (response.data && response.data.success) {
        setTableData(response.data.data || []);
        setTableColumns(response.data.columns || []);
        setConnectionStatus(`✅ Displaying data from ${selectedTable}`);
      } else {
        setConnectionStatus(`❌ Failed to fetch  ${response.data.error}`);
      }
    } catch (err) {
      setConnectionStatus(`❌ Error fetching data: ${err.response?.data?.error || err.message}`);
      console.error('getTableData error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Save edited row
  const saveEditedRow = async () => {
    if (editingRow === null) return;

    const user = users.find(u => u.id === parseInt(selectedUser));
    if (!user) {
      setConnectionStatus('❌ User not found!');
      return;
    }

    setLoading(true);
    setConnectionStatus('Updating row...');

    try {
      const response = await axios.post('/api/update-row.php', {
        host: user.host,
        dbname: user.dbname,
        username: user.username,
        password: user.password,
        table: selectedTable,
         editingData,
        primaryKey: tableColumns[0]?.Field || Object.keys(editingData)[0],
        primaryKeyValue: tableData[editingRow][tableColumns[0]?.Field || Object.keys(editingData)[0]]
      });

      if (response.data.success) {
        setConnectionStatus('✅ Row updated successfully!');
        getTableData();
        setEditingRow(null);
        setEditingData({});
      } else {
        setConnectionStatus(`❌ Failed to update row: ${response.data.error}`);
      }
    } catch (err) {
      setConnectionStatus(`❌ Error updating row: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingRow(null);
    setEditingData({});
  };

  // Handle edit input change
  const handleEditInputChange = (field, value) => {
    setEditingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Start editing row
  const startEditingRow = (rowIndex) => {
    setEditingRow(rowIndex);
    const rowData = tableData[rowIndex];
    setEditingData({ ...rowData });
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
      backgroundColor: '#f0f0f0',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#333'
        }}>
          MySQL Database Manager
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '14px', color: '#666' }}>
            Welcome, <strong>{currentUser.username}</strong>
          </span>
          <button
            onClick={goToMainPage}
            style={{
              padding: '8px 15px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Main Page
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 15px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto'
      }}>
        {/* Connection Status */}
        {connectionStatus && (
          <div style={{
            padding: '10px',
            backgroundColor: connectionStatus.includes('✅') ? '#d4edda' : '#f8d7da',
            color: connectionStatus.includes('✅') ? '#155724' : '#721c24',
            border: `1px solid ${connectionStatus.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
            borderRadius: '4px',
            marginBottom: '20px',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            {connectionStatus}
          </div>
        )}

        {/* Dropdown Section */}
        <div style={{ 
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            {/* Dropdown User */}
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '12px', 
                marginBottom: '5px',
                color: '#666'
              }}>
                Select User:
              </label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="">-- Select User --</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.username} ({user.dbname})
                  </option>
                ))}
              </select>
            </div>

            {/* Test Connection Button */}
            <button
              onClick={testConnection}
              disabled={loading || !selectedUser}
              style={{
                padding: '10px 20px',
                backgroundColor: loading || !selectedUser ? '#6c757d' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: loading || !selectedUser ? 'not-allowed' : 'pointer',
                height: '38px'
              }}
            >
              {loading ? '🔄 Testing...' : '🔁 Test Connection'}
            </button>

            {/* Dropdown Table */}
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '12px', 
                marginBottom: '5px',
                color: '#666'
              }}>
                Select Table:
              </label>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="">-- Select Table --</option>
                {tables.map((table, index) => (
                  <option key={index} value={table}>
                    {table}
                  </option>
                ))}
              </select>
            </div>

            {/* Get Data Button */}
            <button
              onClick={getTableData}
              disabled={loading || !selectedTable}
              style={{
                padding: '10px 20px',
                backgroundColor: loading || !selectedTable ? '#6c757d' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: loading || !selectedTable ? 'not-allowed' : 'pointer',
                height: '38px'
              }}
            >
              {loading ? '🔄 Loading...' : '📋 Get Data'}
            </button>
          </div>
        </div>

        {/* Table Data */}
        {tableData.length > 0 && (
          <div style={{ 
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ 
                margin: 0,
                color: '#333',
                fontSize: '1.5rem'
              }}>
                Data from table: {selectedTable}
              </h2>
              <div style={{ fontSize: '14px', color: '#666' }}>
                {tableData.length} rows
              </div>
            </div>

            <div style={{ 
              overflowX: 'auto',
              maxHeight: '600px',
              overflowY: 'auto',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '14px'
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
                          textAlign: 'left',
                          position: 'sticky',
                          top: 0
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
                        textAlign: 'center',
                        position: 'sticky',
                        top: 0
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, rowIndex) => (
                    <React.Fragment key={rowIndex}>
                      <tr 
                        style={{
                          backgroundColor: rowIndex % 2 === 0 ? '#fff' : '#f8f9fa',
                          cursor: 'pointer'
                        }}
                        onClick={() => startEditingRow(rowIndex)}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = '#e3f2fd';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = rowIndex % 2 === 0 ? '#fff' : '#f8f9fa';
                        }}
                      >
                        {tableColumns.map((column, cellIndex) => (
                          <td 
                            key={cellIndex}
                            style={{
                              border: '1px solid #ddd',
                              padding: '8px',
                              whiteSpace: 'nowrap'
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
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditingRow(rowIndex);
                            }}
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
                      {editingRow === rowIndex && (
                        <tr>
                          <td 
                            colSpan={tableColumns.length + 1}
                            style={{
                              padding: '0',
                              border: '1px solid #007bff',
                              backgroundColor: '#e3f2fd'
                            }}
                          >
                            <div style={{ 
                              padding: '15px',
                              backgroundColor: 'white'
                            }}>
                              <h3 style={{ 
                                margin: '0 0 15px 0',
                                color: '#007bff'
                              }}>
                                Edit Row
                              </h3>
                              <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: `repeat(auto-fit, minmax(150px, 1fr))`,
                                gap: '10px',
                                marginBottom: '15px'
                              }}>
                                {tableColumns.map((column) => (
                                  <div key={column.Field || column}>
                                    <label style={{ 
                                      display: 'block', 
                                      fontSize: '11px', 
                                      marginBottom: '3px',
                                      color: '#666'
                                    }}>
                                      {column.Field || column}
                                    </label>
                                    <input
                                      type="text"
                                      value={editingData[column.Field || column] || ''}
                                      onChange={(e) => handleEditInputChange(column.Field || column, e.target.value)}
                                      style={{
                                        width: '100%',
                                        padding: '6px',
                                        border: '1px solid #ddd',
                                        borderRadius: '3px',
                                        fontSize: '13px'
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
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '3px',
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Connect;