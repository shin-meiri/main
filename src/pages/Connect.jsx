// src/pages/Connect.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Connect = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [tableData, setTableData] = useState([]);
  const [tableColumns, setTableColumns] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('');
  const [loading, setLoading] = useState({ connection: false, tables: false, data: false });
  const [currentUser, setCurrentUser] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [addingRow, setAddingRow] = useState(false);
  const [addingData, setAddingData] = useState({});
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

  // Test connection to MySQL
  const testConnection = async (user) => {
    setLoading(prev => ({ ...prev, connection: true }));
    setConnectionStatus(`Menguji koneksi untuk ${user.username}...`);

    try {
      const response = await axios.post('/api/test-connection.php', {
        host: user.host,
        dbname: user.dbname,
        username: user.username,
        password: user.password
      });

      if (response.data.success) {
        setConnectionStatus(`✅ Koneksi berhasil untuk ${user.username}!`);
        getTables(user);
      } else {
        setConnectionStatus(`❌ Koneksi gagal untuk ${user.username}: ${response.data.error}`);
      }
    } catch (err) {
      setConnectionStatus(`❌ Error untuk ${user.username}: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, connection: false }));
    }
  };

  // Get tables from selected database
  const getTables = async (user) => {
    setLoading(prev => ({ ...prev, tables: true }));

    try {
      const response = await axios.post('/api/get-tables.php', {
        host: user.host,
        dbname: user.dbname,
        username: user.username,
        password: user.password
      });

      if (response.data.success) {
        setTables(response.data.tables || []);
        setSelectedUser(user);
        setConnectionStatus(`✅ Ditemukan ${response.data.tables?.length || 0} tabel`);
        setTableData([]);
        setSelectedTable('');
        setTableColumns([]);
      } else {
        setConnectionStatus(`❌ Gagal mengambil tabel: ${response.data.error}`);
      }
    } catch (err) {
      setConnectionStatus(`❌ Error mengambil tabel: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, tables: false }));
    }
  };

  // Get table data
  const getTableData = async (tableName) => {
    if (!selectedUser || !tableName) return;

    setLoading(prev => ({ ...prev, data: true }));
    setSelectedTable(tableName);
    setEditingCell(null);
    setAddingRow(false);

    try {
      const response = await axios.post('/api/get-table-data.php', {
        host: selectedUser.host,
        dbname: selectedUser.dbname,
        username: selectedUser.username,
        password: selectedUser.password,
        table: tableName
      });

      if (response.data && response.data.success) {
        setTableData(response.data.data || []);
        setTableColumns(response.data.columns || []);
        setConnectionStatus(`✅ Menampilkan data dari tabel ${tableName}`);
      } else {
        const errorMessage = response.data?.error || 'Unknown error';
        setConnectionStatus(`❌ Gagal mengambil data: ${errorMessage}`);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Unknown error';
      setConnectionStatus(`❌ Error mengambil data: ${errorMessage}`);
      console.error('getTableData error:', err);
    } finally {
      setLoading(prev => ({ ...prev, data: false }));
    }
  };

  // Start editing cell
  const startEditingCell = (rowIndex, columnName, currentValue) => {
    setEditingCell({ rowIndex, columnName });
    setEditingValue(currentValue !== null ? String(currentValue) : '');
  };

  // Save edited cell
  const saveEditedCell = async () => {
    if (!editingCell || !selectedUser || !selectedTable) return;

    setLoading(prev => ({ ...prev, data: true }));

    try {
      const response = await axios.post('/api/update-cell.php', {
        host: selectedUser.host,
        dbname: selectedUser.dbname,
        username: selectedUser.username,
        password: selectedUser.password,
        table: selectedTable,
        rowIndex: editingCell.rowIndex,
        columnName: editingCell.columnName,
        value: editingValue,
        primaryKey: tableColumns[0],
        primaryKeyValue: tableData[editingCell.rowIndex][tableColumns[0]]
      });

      if (response.data.success) {
        setConnectionStatus('✅ Data berhasil diupdate!');
        getTableData(selectedTable);
        setEditingCell(null);
        setEditingValue('');
      } else {
        setConnectionStatus(`❌ Gagal mengupdate data: ${response.data.error}`);
      }
    } catch (err) {
      setConnectionStatus(`❌ Error mengupdate data: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, data: false }));
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingCell(null);
    setEditingValue('');
  };

  // Start adding new row
  const startAdding = () => {
    if (!selectedTable) return;

    const newRowData = {};
    tableColumns.forEach(col => {
      newRowData[col] = '';
    });

    setAddingRow(true);
    setAddingData(newRowData);
  };

  // Save new row
  const saveNewRow = async () => {
    if (!selectedUser || !selectedTable) return;

    setLoading(prev => ({ ...prev, data: true }));

    try {
      const response = await axios.post('/api/insert-row.php', {
        host: selectedUser.host,
        dbname: selectedUser.dbname,
        username: selectedUser.username,
        password: selectedUser.password,
        table: selectedTable,
        data: addingData
      });

      if (response.data.success) {
        setConnectionStatus('✅ Data berhasil ditambahkan!');
        getTableData(selectedTable);
        setAddingRow(false);
        setAddingData({});
      } else {
        setConnectionStatus(`❌ Gagal menambahkan data: ${response.data.error}`);
      }
    } catch (err) {
      setConnectionStatus(`❌ Error menambahkan data: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, data: false }));
    }
  };

  // Cancel adding
  const cancelAdd = () => {
    setAddingRow(false);
    setAddingData({});
  };

  // Handle input change for adding
  const handleAddInputChange = (field, value) => {
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
          MySQL Database Manager
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
        maxWidth: '1200px', 
        margin: '0 auto',
        padding: '20px'
      }}>
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

        {/* Section 1: List dat.json with test connection */}
        <div style={{ 
          padding: '20px',
          border: '1px solid pink',
          borderRadius: '8px',
          marginBottom: '30px'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>List dat.json</h2>
          
          {users.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#aaa' }}>Tidak ada user dengan konfigurasi database</p>
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
                    backgroundColor: '#222',
                    border: '1px solid #444',
                    borderRadius: '6px',
                    position: 'relative'
                  }}
                >
                  <div><strong>Username:</strong> {user.username}</div>
                  <div><strong>Host:</strong> {user.host}</div>
                  <div><strong>Database:</strong> {user.dbname}</div>
                  <button
                    onClick={() => testConnection(user)}
                    disabled={loading.connection}
                    style={{
                      marginTop: '10px',
                      padding: '8px 15px',
                      backgroundColor: loading.connection ? '#555' : 'pink',
                      color: loading.connection ? '#888' : 'black',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '14px',
                      cursor: loading.connection ? 'not-allowed' : 'pointer',
                      width: '100%'
                    }}
                  >
                    {loading.connection ? '🔁 Testing...' : '🔁 Test Connection'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: List tables */}
        {selectedUser && tables.length > 0 && (
          <div style={{ 
            padding: '20px',
            border: '1px solid pink',
            borderRadius: '8px',
            marginBottom: '30px'
          }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
              Tables in {selectedUser.dbname}
            </h2>
            
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
                    padding: '10px',
                    backgroundColor: selectedTable === table ? '#444' : '#333',
                    color: 'pink',
                    border: selectedTable === table ? '2px solid pink' : '1px solid #555',
                    borderRadius: '4px',
                    cursor: loading.data && selectedTable === table ? 'not-allowed' : 'pointer',
                    textAlign: 'center'
                  }}
                >
                  {loading.data && selectedTable === table ? 'Loading...' : table}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Table Data */}
        {tableData.length > 0 && (
          <div style={{ 
            padding: '20px',
            border: '1px solid pink',
            borderRadius: '8px'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ margin: 0 }}>
                Data from table: {selectedTable}
              </h2>
              <button
                onClick={startAdding}
                disabled={addingRow || editingCell !== null}
                style={{
                  padding: '8px 15px',
                  backgroundColor: 'pink',
                  color: 'black',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  cursor: addingRow || editingCell !== null ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
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
                backgroundColor: '#333',
                border: '1px solid pink',
                borderRadius: '6px'
              }}>
                <h3 style={{ margin: '0 0 15px 0' }}>Add New Row</h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: `repeat(auto-fit, minmax(150px, 1fr))`,
                  gap: '10px',
                  marginBottom: '15px'
                }}>
                  {Object.keys(addingData).map((field) => (
                    <div key={field}>
                      <label style={{ display: 'block', fontSize: '12px', marginBottom: '3px' }}>
                        {field}
                      </label>
                      <input
                        type="text"
                        value={addingData[field]}
                        onChange={(e) => handleAddInputChange(field, e.target.value)}
                        style={{
                          width: '100%',
                          padding: '6px',
                          backgroundColor: '#444',
                          color: 'pink',
                          border: '1px solid #555',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={saveNewRow}
                    disabled={loading.data}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: loading.data ? '#555' : 'green',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: loading.data ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {loading.data ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={cancelAdd}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#666',
                      color: 'pink',
                      border: '1px solid pink',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
            <div style={{ 
              overflowX: 'auto',
              maxHeight: '500px',
              overflowY: 'auto'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                color: 'pink',
                backgroundColor: '#222'
              }}>
                <thead>
                  <tr>
                    {tableColumns.map((column, index) => (
                      <th 
                        key={index}
                        style={{
                          border: '1px solid #444',
                          padding: '10px',
                          backgroundColor: '#333',
                          textAlign: 'left',
                          position: 'sticky',
                          top: 0
                        }}
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {tableColumns.map((column, cellIndex) => (
                        <td 
                          key={cellIndex}
                          onClick={() => startEditingCell(rowIndex, column, row[column])}
                          style={{
                            border: '1px solid #444',
                            padding: '8px',
                            backgroundColor: rowIndex % 2 === 0 ? '#222' : '#2a2a2a',
                            cursor: 'pointer'
                          }}
                        >
                          {editingCell && 
                           editingCell.rowIndex === rowIndex && 
                           editingCell.columnName === column ? (
                            <div style={{ display: 'flex', gap: '5px' }}>
                              <input
                                type="text"
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                autoFocus
                                style={{
                                  flex: 1,
                                  padding: '4px',
                                  backgroundColor: '#444',
                                  color: 'pink',
                                  border: '1px solid pink',
                                  borderRadius: '3px',
                                  fontSize: '12px'
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    saveEditedCell();
                                  } else if (e.key === 'Escape') {
                                    cancelEditing();
                                  }
                                }}
                              />
                              <button
                                onClick={saveEditedCell}
                                disabled={loading.data}
                                style={{
                                  padding: '2px 6px',
                                  backgroundColor: loading.data ? '#555' : 'green',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '3px',
                                  fontSize: '10px',
                                  cursor: loading.data ? 'not-allowed' : 'pointer'
                                }}
                              >
                                ✓
                              </button>
                              <button
                                onClick={cancelEditing}
                                style={{
                                  padding: '2px 6px',
                                  backgroundColor: '#666',
                                  color: 'pink',
                                  border: '1px solid pink',
                                  borderRadius: '3px',
                                  fontSize: '10px',
                                  cursor: 'pointer'
                                }}
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            row[column] !== null ? String(row[column]) : 'NULL'
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div style={{ 
              marginTop: '10px', 
              textAlign: 'center', 
              fontSize: '14px', 
              color: '#aaa' 
            }}>
              Menampilkan {tableData.length} baris data
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Connect;