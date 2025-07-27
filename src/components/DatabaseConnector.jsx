// frontend/src/components/DatabaseConnector.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DatabaseConnector = () => {
  // State untuk kredensial database
  const [credentials, setCredentials] = useState({
    host: '',
    username: '',
    password: '',
    database: ''
  });
  
  // State untuk profil
  const [profileName, setProfileName] = useState('');
  const [profiles, setProfiles] = useState([]);
  
  // State untuk hasil
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [queryResult, setQueryResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('SELECT VERSION() as mysql_version');
  const [activeTab, setActiveTab] = useState('connection');

  // Load profiles saat component mount
  useEffect(() => {
    loadProfiles();
  }, []);

  // Handle perubahan input
  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  // Handle profile name change
  const handleProfileNameChange = (e) => {
    setProfileName(e.target.value);
  };

  // Load connection profiles
  const loadProfiles = async () => {
    try {
      const response = await axios.post('/api/konek.php', {
        action: 'get_profiles'
      });
      
      if (response.data.status === 'success') {
        setProfiles(Object.entries(response.data.profiles).map(([name, data]) => ({
          name,
          ...data
        })));
      }
    } catch (error) {
      console.error('Error loading profiles:', error);
    }
  };

  // Test koneksi database
  const testConnection = async () => {
    setLoading(true);
    setConnectionStatus(null);
    
    try {
      const response = await axios.post('/api/konek.php', {
        action: 'test_connection',
        host: credentials.host,
        username: credentials.username,
        password: credentials.password,
        database: credentials.database
      }, {
        timeout: 10000
      });
      
      setConnectionStatus(response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Connection failed';
      
      setConnectionStatus({
        status: 'error',
        message: errorMessage
      });
    }
    setLoading(false);
  };

  // Simpan profil koneksi
  const saveProfile = async () => {
    if (!profileName.trim()) {
      alert('Please enter a profile name');
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post('/api/konek.php', {
        action: 'save_profile',
        profile_name: profileName,
        host: credentials.host,
        username: credentials.username,
        password: credentials.password,
        database: credentials.database
      });
      
      if (response.data.status === 'success') {
        alert('Profile saved successfully!');
        setProfileName('');
        loadProfiles(); // Refresh profiles list
      } else {
        alert('Error saving profile: ' + response.data.message);
      }
    } catch (error) {
      alert('Error saving profile: ' + (error.response?.data?.message || error.message));
    }
    
    setLoading(false);
  };

  // Load profile
  const loadProfile = (profile) => {
    setCredentials({
      host: profile.host,
      username: profile.username,
      password: profile.password,
      database: profile.database
    });
    setProfileName(profile.name);
  };

  // Delete profile
  const deleteProfile = async (profileName) => {
    if (window.confirm('Are you sure you want to delete this profile?')) {
      try {
        const response = await axios.post('/api/konek.php', {
          action: 'delete_profile',
          profile_name: profileName
        });
        
        if (response.data.status === 'success') {
          alert('Profile deleted successfully!');
          loadProfiles(); // Refresh profiles list
        } else {
          alert('Error deleting profile: ' + response.data.message);
        }
      } catch (error) {
        alert('Error deleting profile: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  // Jalankan query
  const executeQuery = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setQueryResult(null);
    
    try {
      const response = await axios.post('/api/konek.php', {
        action: 'connect_and_query',
        host: credentials.host,
        username: credentials.username,
        password: credentials.password,
        database: credentials.database,
        query: query
      }, {
        timeout: 15000
      });
      
      setQueryResult(response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Query failed';
      
      setQueryResult({
        status: 'error',
        message: errorMessage
      });
    }
    setLoading(false);
  };

  // Dapatkan struktur database
  const getDatabaseStructure = async () => {
    setLoading(true);
    setQueryResult(null);
    
    try {
      const response = await axios.post('/api/konek.php', {
        action: 'get_structure',
        host: credentials.host,
        username: credentials.username,
        password: credentials.password,
        database: credentials.database
      });
      
      setQueryResult(response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to get structure';
      
      setQueryResult({
        status: 'error',
        message: errorMessage
      });
    }
    setLoading(false);
  };

  return (
    <div className="database-connector">
      <h2>Database Connection Toolkit</h2>
      
      {/* Tabs */}
      <div className="tabs">
        <button 
          className={activeTab === 'connection' ? 'tab-active' : ''}
          onClick={() => setActiveTab('connection')}
        >
          Connection
        </button>
        <button 
          className={activeTab === 'profiles' ? 'tab-active' : ''}
          onClick={() => setActiveTab('profiles')}
        >
          Saved Profiles ({profiles.length})
        </button>
      </div>

      {/* Connection Tab */}
      {activeTab === 'connection' && (
        <div className="credentials-form">
          <h3>Database Credentials</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Host:</label>
              <input
                type="text"
                name="host"
                value={credentials.host}
                onChange={handleInputChange}
                placeholder="localhost"
              />
            </div>
            
            <div className="form-group">
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                placeholder="database username"
              />
            </div>
            
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                placeholder="database password"
              />
            </div>
            
            <div className="form-group">
              <label>Database:</label>
              <input
                type="text"
                name="database"
                value={credentials.database}
                onChange={handleInputChange}
                placeholder="database name"
              />
            </div>
          </div>
          
          {/* Profile Name Input */}
          <div className="form-group">
            <label>Profile Name:</label>
            <input
              type="text"
              value={profileName}
              onChange={handleProfileNameChange}
              placeholder="Enter profile name to save"
              style={{width: '300px'}}
            />
          </div>
          
          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              onClick={testConnection} 
              disabled={loading}
              className="btn-test"
            >
              {loading ? 'Testing...' : 'Test Connection'}
            </button>
            
            <button 
              onClick={saveProfile} 
              disabled={loading || !profileName.trim()}
              className="btn-save"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
          
          {connectionStatus && (
            <div className={`status-message ${connectionStatus.status}`}>
              <strong>Status:</strong> {connectionStatus.message}
            </div>
          )}
        </div>
      )}

      {/* Profiles Tab */}
      {activeTab === 'profiles' && (
        <div className="profiles-tab">
          <h3>Saved Connection Profiles</h3>
          
          {profiles.length === 0 ? (
            <p>No saved profiles found.</p>
          ) : (
            <div className="profiles-list">
              {profiles.map((profile, index) => (
                <div key={index} className="profile-item">
                  <div className="profile-info">
                    <h4>{profile.name}</h4>
                    <p><strong>Host:</strong> {profile.host}</p>
                    <p><strong>Database:</strong> {profile.database}</p>
                    <p><strong>Username:</strong> {profile.username}</p>
                    <small>Created: {profile.created_at}</small>
                  </div>
                  <div className="profile-actions">
                    <button 
                      onClick={() => loadProfile(profile)}
                      className="btn-load"
                    >
                      Load
                    </button>
                    <button 
                      onClick={() => deleteProfile(profile.name)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Query Executor */}
      <div className="query-executor">
        <h3>Query Executor</h3>
        <div className="query-input">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your SQL query here..."
            rows="4"
          />
        </div>
        
        <div className="query-buttons">
          <button 
            onClick={executeQuery} 
            disabled={loading}
            className="btn-execute"
          >
            Execute Query
          </button>
          <button 
            onClick={getDatabaseStructure} 
            disabled={loading}
            className="btn-structure"
          >
            Get Database Structure
          </button>
        </div>
        
        {queryResult && (
          <div className="query-result">
            <h4>Result:</h4>
            <pre>{JSON.stringify(queryResult, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseConnector;