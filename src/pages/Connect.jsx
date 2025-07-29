// src/pages/Connect.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Connect = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tables, setTables] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('');
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
      console.error('Error fetching ', err);
    }
  };

  // Test connection to MySQL
  const testConnection = async (user) => {
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
        setSelectedUser(user);
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
      backgroundColor: '#f5f5f5',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          fontSize: '2rem',
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
            padding: '15px',
            backgroundColor: connectionStatus.includes('✅') ? '#d4edda' : '#f8d7da',
            color: connectionStatus.includes('✅') ? '#155724' : '#721c24',
            border: `1px solid ${connectionStatus.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
            borderRadius: '4px',
            marginBottom: '25px',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            {connectionStatus}
          </div>
        )}

        {/* Section 1: List dat.json */}
        <div style={{ 
          padding: '25px',
          backgroundColor: 'white',
          borderRadius: '8px',
          marginBottom: '30px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ 
            textAlign: 'center', 
            marginBottom: '25px',
            color: '#333'
          }}>
            List dat.json
          </h2>
          
          {users.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666' }}>No database configurations found</p>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '20px' 
            }}>
              {users.map(user => (
                <div 
                  key={user.id}
                  style={{
                    padding: '20px',
                    backgroundColor: selectedUser?.id === user.id ? '#e3f2fd' : '#f8f9fa',
                    border: selectedUser?.id === user.id ? '2px solid #2196f3' : '1px solid #dee2e6',
                    borderRadius: '8px',
                    position: 'relative'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '15px' 
                  }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      backgroundColor: '#2196f3',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '15px',
                      fontWeight: 'bold',
                      color: 'white'
                    }}>
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ 
                        fontSize: '1.2rem', 
                        fontWeight: 'bold', 
                        color: '#333' 
                      }}>
                        {user.username}
                      </div>
                      <div style={{ 
                        fontSize: '0.9rem', 
                        color: '#666' 
                      }}>
                        {user.dbname}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ 
                    marginBottom: '15px',
                    padding: '10px',
                    backgroundColor: '#e9ecef',
                    borderRadius: '4px'
                  }}>
                    <div style={{ 
                      fontSize: '0.8rem', 
                      color: '#495057',
                      marginBottom: '5px' 
                    }}>
                      Host: <strong>{user.host}</strong>
                    </div>
                    <div style={{ 
                      fontSize: '0.8rem', 
                      color: '#495057' 
                    }}>
                      User: <strong>{user.username}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => testConnection(user)}
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: loading ? '#6c757d' : '#2196f3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {loading ? '🔄 Testing...' : '🔁 Test Connection'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: List tabel MySQL */}
        {selectedUser && tables.length > 0 && (
          <div style={{ 
            padding: '25px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ 
              textAlign: 'center', 
              marginBottom: '25px',
              color: '#333'
            }}>
              Tables in {selectedUser.dbname}
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
              gap: '15px' 
            }}>
              {tables.map((table, index) => (
                <div
                  key={index}
                  style={{
                    padding: '15px',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '6px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#e3f2fd';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#f8f9fa';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ 
                    fontSize: '2rem', 
                    marginBottom: '8px' 
                  }}>
                    📋
                  </div>
                  <div style={{ 
                    fontWeight: 'bold',
                    color: '#333'
                  }}>
                    {table}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Connect;