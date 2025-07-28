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
      setConnectionStatus(`❌ Error mengambil  ${errorMessage}`);
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
      setConnectionStatus(`❌ Error mengupdate  ${err.response?.data?.error || err.message}`);
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

  // Filter table data based on search term
  const filteredTableData = tableData.filter(row => {
    if (!searchTerm) return true;
    return Object.values(row).some(value => 
      value !== null && String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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
      color: '#e0e0e0', 
      backgroundColor: '#1a1a2e',
      minHeight: '100vh',
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
          fontSize: '2.5rem',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
        }}>
          🚀 MySQL Database Manager
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '16px', color: '#a0a0c0' }}>
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

        {/* Dashboard Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            padding: '20px',
            borderRadius: '15px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>👥</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#4ecdc4' }}>{users.length}</div>
            <div style={{ color: '#a0a0c0' }}>Database Users</div>
          </div>
          
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            padding: '20px',
            borderRadius: '15px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🗄️</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#ff6b6b' }}>{tables.length}</div>
            <div style={{ color: '#a0a0c0' }}>Tables</div>
          </div>
          
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            padding: '20px',
            borderRadius: '15px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📊</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#ffd93d' }}>{tableData.length}</div>
            <div style={{ color: '#a0a0c0' }}>Data Rows</div>
          </div>
        </div>

        {/* Section 1: List dat.json with test connection */}
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
            📋 Database Connections
          </h2>
          
          {users.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              color: '#a0a0c0',
              padding: '40px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '10px'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📭</div>
              <div style={{ fontSize: '1.2rem' }}>Tidak ada user dengan konfigurasi database</div>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
              gap: '20px' 
            }}>
              {users.map(user => (
                <div 
                  key={user.id}
                  style={{
                    padding: '20px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(5px)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-5px)';
                    e.target.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      marginBottom: '10px' 
                    }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        backgroundColor: '#4ecdc4',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '15px',
                        fontWeight: 'bold'
                      }}>
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}>
                          {user.username}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#a0a0c0' }}>
                          Database User
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr',
                      gap: '10px',
                      marginTop: '15px'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#a0a0c0', marginBottom: '3px' }}>
                          🌐 Host
                        </div>
                        <div style={{ color: '#fff', fontSize: '0.9rem' }}>{user.host}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#a0a0c0', marginBottom: '3px' }}>
                          🗄️ Database
                        </div>
                        <div style={{ color: '#fff', fontSize: '0.9rem' }}>{user.dbname}</div>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => testConnection(user)}
                    disabled={loading.connection}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: loading.connection ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                      color: loading.connection ? '#888' : '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: loading.connection ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      background: loading.connection ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(45deg, #ff6b6b, #4ecdc4)'
                    }}
                    onMouseOver={(e) => {
                      if (!loading.connection) {
                        e.target.style.transform = 'scale(1.02)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!loading.connection) {
                        e.target.style.transform = 'scale(1)';
                      }
                    }}
                  >
                  