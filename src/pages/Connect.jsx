// src/pages/Connect.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Connect = () => {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [tableData, setTableData] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('');
  const [loading, setLoading] = useState({ 
    profiles: false, 
    connection: false, 
    tables: false, 
    data: false 
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [editingProfile, setEditingProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({
    name: '',
    host: '',
    username: '',
    password: '',
    dbname: ''
  });
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

  // Fetch profiles dari API
  useEffect(() => {
    if (currentUser) {
      fetchProfiles();
    }
  }, [currentUser]);

  const fetchProfiles = async () => {
    setLoading(prev => ({ ...prev, profiles: true }));
    try {
      const response = await axios.get('/api/dat.json');
      // Filter profiles yang memiliki konfigurasi database lengkap
      const dbProfiles = (response.data.users || []).filter(user => 
        user.host && user.dbname && user.username && user.password
      ).map(user => ({
        id: user.id,
        name: user.username,
        host: user.host,
        username: user.username,
        password: user.password,
        dbname: user.dbname
      }));
      setProfiles(dbProfiles);
    } catch (err) {
      setConnectionStatus(`❌ Error fetching profiles: ${err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, profiles: false }));
    }
  };

  // Test connection to MySQL
  const testConnection = async (profile) => {
    setLoading(prev => ({ ...prev, connection: true }));
    setConnectionStatus(`Testing connection to ${profile.name}...`);

    try {
      const response = await axios.post('/api/test-connection.php', {
        host: profile.host,
        dbname: profile.dbname,
        username: profile.username,
        password: profile.password
      });

      if (response.data.success) {
        setConnectionStatus(`✅ Connection successful to ${profile.name}!`);
        setSelectedProfile(profile);
        // Reset previous data
        setTables([]);
        setSelectedTable('');
        setTableData([]);
      } else {
        setConnectionStatus(`❌ Connection failed: ${response.data.error}`);
      }
    } catch (err) {
      setConnectionStatus(`❌ Connection error: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, connection: false }));
    }
  };

  // Get tables from selected database
  const getTables = async (profile) => {
    if (!profile) return;
    
    setLoading(prev => ({ ...prev, tables: true }));
    setConnectionStatus(`Fetching tables from ${profile.name}...`);

    try {
      const response = await axios.post('/api/get-tables.php', {
        host: profile.host,
        dbname: profile.dbname,
        username: profile.username,
        password: profile.password
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
    if (!selectedProfile || !tableName) return;

    setLoading(prev => ({ ...prev, data: true }));
    setSelectedTable(tableName);
    setConnectionStatus(`Fetching data from ${tableName}...`);

    try {
      const response = await axios.post('/api/get-table-data.php', {
        host: selectedProfile.host,
        dbname: selectedProfile.dbname,
        username: selectedProfile.username,
        password: selectedProfile.password,
        table: tableName
      });

      if (response.data.success) {
        setTableData(response.data.data || []);
        setConnectionStatus(`✅ Displaying data from ${tableName}`);
      } else {
        setConnectionStatus(`❌ Failed to fetch data: ${response.data.error}`);
      }
    } catch (err) {
      setConnectionStatus(`❌ Error fetching data: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, data: false }));
    }
  };
  // CRUD Profile Functions
  const startEditingProfile = (profile) => {
    setEditingProfile(profile);
    setProfileForm({
      name: profile.name,
      host: profile.host,
      username: profile.username,
      password: profile.password,
      dbname: profile.dbname
    });
  };

  const startAddingProfile = () => {
    setEditingProfile(null);
    setProfileForm({
      name: '',
      host: '',
      username: '',
      password: '',
      dbname: ''
    });
  };

  const saveProfile = async () => {
    if (!profileForm.name || !profileForm.host || !profileForm.username || 
        !profileForm.password || !profileForm.dbname) {
      setConnectionStatus('❌ All fields are required!');
      return;
    }

    try {
      // Get current users data
      const response = await axios.get('/api/dat.json');
      let users = response.data.users || [];
      
      if (editingProfile) {
        // Update existing profile
        users = users.map(user => 
          user.id === editingProfile.id 
            ? { 
                ...user,
                username: profileForm.name,
                host: profileForm.host,
                dbname: profileForm.dbname,
                username: profileForm.username,
                password: profileForm.password
              }
            : user
        );
      } else {
        // Add new profile
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        users.push({
          id: newId,
          username: profileForm.name,
          host: profileForm.host,
          dbname: profileForm.dbname,
          username: profileForm.username,
          password: profileForm.password
        });
      }

      // Save to API
      const saveResponse = await axios.post('/api/dat.php', {
        message: response.data.message || 'welcome',
        users: users
      });

      if (saveResponse.data.status === 'success') {
        setConnectionStatus(editingProfile 
          ? '✅ Profile updated successfully!' 
          : '✅ Profile added successfully!'
        );
        fetchProfiles();
        cancelEditing();
      }
    } catch (err) {
      setConnectionStatus(`❌ Error saving profile: ${err.message}`);
    }
  };

  const deleteProfile = async (profileId) => {
    if (window.confirm('Are you sure you want to delete this profile?')) {
      try {
        const response = await axios.get('/api/dat.json');
        const users = (response.data.users || []).filter(user => user.id !== profileId);
        
        const saveResponse = await axios.post('/api/dat.php', {
          message: response.data.message || 'welcome',
          users: users
        });

        if (saveResponse.data.status === 'success') {
          setConnectionStatus('✅ Profile deleted successfully!');
          fetchProfiles();
          if (selectedProfile && selectedProfile.id === profileId) {
            setSelectedProfile(null);
            setTables([]);
            setSelectedTable('');
            setTableData([]);
          }
        }
      } catch (err) {
        setConnectionStatus(`❌ Error deleting profile: ${err.message}`);
      }
    }
  };

  const cancelEditing = () => {
    setEditingProfile(null);
    setProfileForm({
      name: '',
      host: '',
      username: '',
      password: '',
      dbname: ''
    });
  };

  const handleProfileFormChange = (field, value) => {
    setProfileForm(prev => ({
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
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ 
          fontSize: '2rem',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🚀 Database Connection Manager
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
              transition: 'all 0.3s ease'
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
              transition: 'all 0.3s ease'
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
        margin: '0 auto'
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
            fontSize: '16px'
          }}>
            {connectionStatus}
          </div>
        )}

        {/* Profile Management Section */}
        <div style={{ 
          padding: '25px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          marginBottom: '30px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '25px'
          }}>
            <h2 style={{ 
              margin: 0,
              color: '#4ecdc4',
              fontSize: '1.8rem'
            }}>
              📁 Database Profiles
            </h2>
            <button
              onClick={startAddingProfile}
              style={{
                padding: '12px 20px',
                backgroundColor: 'rgba(78, 205, 196, 0.2)',
                color: '#4ecdc4',
                border: '1px solid #4ecdc4',
                borderRadius: '25px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
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
              ➕ Add New Profile
            </button>
          </div>

          {/* Profile Form */}
          {(editingProfile || profileForm.name) && (
            <div style={{ 
              marginBottom: '25px',
              padding: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              border: '1px solid rgba(78, 205, 196, 0.3)'
            }}>
              <h3 style={{ 
                margin: '0 0 20px 0',
                color: '#4ecdc4'
              }}>
                {editingProfile ? '✏️ Edit Profile' : '📝 Add New Profile'}
              </h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px',
                marginBottom: '20px'
              }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '12px', 
                    marginBottom: '5px',
                    color: '#a0a0c0'
                  }}>
                    Profile Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => handleProfileFormChange('name', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                    placeholder="My Database"
                  />
                </div>
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
                    value={profileForm.host}
                    onChange={(e) => handleProfileFormChange('host', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
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
                    value={profileForm.username}
                    onChange={(e) => handleProfileFormChange('username', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                    placeholder="db_user"
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
                    value={profileForm.password}
                    onChange={(e) => handleProfileFormChange('password', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
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
                    Database Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.dbname}
                    onChange={(e) => handleProfileFormChange('dbname', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
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
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={saveProfile}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'rgba(76, 175, 80, 0.3)',
                    color: '#4CAF50',
                    border: '1px solid #4CAF50',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  💾 Save Profile
                </button>
                <button
                  onClick={cancelEditing}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#ff6b6b',
                    border: '1px solid #ff6b6b',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          )}

          {/* Profiles List */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '20px' 
          }}>
            {profiles.map(profile => (
              <div 
                key={profile.id}
                style={{
                  padding: '20px',
                  backgroundColor: selectedProfile?.id === profile.id ? 'rgba(78, 205, 196, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                  border: selectedProfile?.id === profile.id ? '2px solid #4ecdc4' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  position: 'relative',
                  transition: 'all 0.3s ease'
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
                    backgroundColor: '#4ecdc4',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '15px',
                    fontWeight: 'bold'
                  }}>
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ 
                      fontSize: '1.2rem', 
                      fontWeight: 'bold',
                      color: selectedProfile?.id === profile.id ? '#4ecdc4' : '#fff'
                    }}>
                      {profile.name}
                    </div>
                    <div style={{ 
                      fontSize: '0.9rem', 
                      color: '#a0a0c0' 
                    }}>
                      {profile.dbname}
                    </div>
                  </div>
                </div>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  marginBottom: '20px'
                }}>
                  <div>
                    <div style={{ 
                      fontSize: '0.8rem', 
                      color: '#a0a0c0',
                      marginBottom: '3px' 
                    }}>
                      🌐 Host
                    </div>
                    <div style={{ 
                      fontSize: '0.9rem',
                      color: '#fff'
                    }}>
                      {profile.host}
                    </div>
                  </div>
                  <div>
                    <div style={{ 
                      fontSize: '0.8rem', 
                      color: '#a0a0c0',
                      marginBottom: '3px' 
                    }}>
                      👤 User
                    </div>
                    <div style={{ 
                      fontSize: '0.9rem',
                      color: '#fff'
                    }}>
                      {profile.username}
                    </div>
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  gap: '10px' 
                }}>
                  <button
                    onClick={() => testConnection(profile)}
                    disabled={loading.connection}
                    style={{
                      flex: 1,
                      padding: '8px',
                      backgroundColor: loading.connection ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 217, 61, 0.2)',
                      color: loading.connection ? '#888' : '#ffd93d',
                      border: '1px solid #ffd93d',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      cursor: loading.connection ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {loading.connection ? '🔄 Testing...' : '🔁 Test'}
                  </button>
                  <button
                    onClick={() => startEditingProfile(profile)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: 'rgba(78, 205, 196, 0.2)',
                      color: '#4ecdc4',
                      border: '1px solid #4ecdc4',
                      borderRadius: '20px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteProfile(profile.id)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: 'rgba(255, 107, 107, 0.2)',
                      color: '#ff6b6b',
                      border: '1px solid #ff6b6b',
                      borderRadius: '20px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Database Content Section */}
        {selectedProfile && (
          <div style={{ 
            padding: '25px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
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
                fontSize: '1.8rem'
              }}>
                🗄️ {selectedProfile.name} - {selectedProfile.dbname}
              </h2>
              <button
                onClick={() => getTables(selectedProfile)}
                disabled={loading.tables}
                style={{
                  padding: '10px 20px',
                  backgroundColor: loading.tables ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 217, 61, 0.2)',
                  color: loading.tables ? '#888' : '#ffd93d',
                  border: '1px solid #ffd93d',
                  borderRadius: '25px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: loading.tables ? 'not-allowed' : 'pointer'
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
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '10px' 
                }}>
                  {tables.map((table, index) => (
                    <button
                      key={index}
                      onClick={() => getTableData(table)}
                      disabled={loading.data && selectedTable === table}
                      style={{
                        padding: '10px 15px',
                        backgroundColor: selectedTable === table ? 'rgba(255, 217, 61, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                        color: selectedTable === table ? '#ffd93d' : '#e0e0e0',
                        border: selectedTable === table ? '2px solid #ffd93d' : '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '20px',
                        cursor: loading.data && selectedTable === table ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s ease'
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
                <h3 style={{ 
                  color: '#ff6b6b',
                  marginBottom: '15px'
                }}>
                  📊 Data from {selectedTable}
                </h3>
                <div style={{ 
                  overflowX: 'auto',
                  maxHeight: '400px',
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
                        {Object.keys(tableData[0] || {}).map((key, index) => (
                          <th 
                            key={index}
                            style={{
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              padding: '12px',
                              backgroundColor: 'rgba(78, 205, 196, 0.2)',
                              textAlign: 'left',
                              position: 'sticky',
                              top: 0
                            }}
                          >
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((row, rowIndex) => (
                        <tr 
                          key={rowIndex}
                          style={{
                            backgroundColor: rowIndex % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.05)'
                          }}
                        >
                          {Object.values(row).map((cell, cellIndex) => (
                            <td 
                              key={cellIndex}
                              style={{
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                padding: '10px',
                                fontSize: '14px'
                              }}
                            >
                              {cell !== null ? String(cell) : 'NULL'}
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
                  color: '#a0a0c0' 
                }}>
                  Showing {tableData.length} records
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