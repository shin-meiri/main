// frontend/src/components/AdminPanel.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AdminPanel = ({ onConnectionSuccess }) => {
  const [apiUrl, setApiUrl] = useState('http://localhost:8000/api/konek.php');
  const [credentials, setCredentials] = useState({
    host: 'localhost',
    username: '',
    password: '',
    database: ''
  });
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load saved connection
  useEffect(() => {
    const loadSavedConnection = async () => {
      try {
        const response = await axios.post(apiUrl, {
          action: 'get_current'
        });
        
        if (response.data.status === 'success' && response.data.current) {
          setCredentials(response.data.current);
          onConnectionSuccess(apiUrl, response.data.current);
        }
      } catch (error) {
        console.error('Error loading connection:', error);
      }
    };
    
    loadSavedConnection();
  }, [apiUrl, onConnectionSuccess]);

  // Auto-save API URL
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      if (apiUrl && apiUrl !== 'http://localhost:8000/api/konek.php') {
        // Simpan API URL ke localStorage atau file
        localStorage.setItem('cms_api_url', apiUrl);
      }
    }, 1000);

    return () => clearTimeout(saveTimer);
  }, [apiUrl]);

  const handleApiUrlChange = (e) => {
    setApiUrl(e.target.value);
  };

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await axios.post(apiUrl, {
        action: 'test_connection',
        host: credentials.host,
        username: credentials.username,
        password: credentials.password,
        database: credentials.database
      });
      
      setConnectionStatus(response.data);
      
      if (response.data.status === 'success') {
        // Save connection
        await axios.post(apiUrl, {
          action: 'save_current',
          host: credentials.host,
          username: credentials.username,
          password: credentials.password,
          database: credentials.database
        });
        onConnectionSuccess(apiUrl, credentials);
      }
    } catch (error) {
      setConnectionStatus({
        status: 'error',
        message: error.response?.data?.message || error.message
      });
    }
    setLoading(false);
  };

  return (
    <div className="admin-panel">
      <h2>CMS Admin Panel</h2>
      
      <div className="api-url-section">
        <label>API URL:</label>
        <input
          type="url"
          value={apiUrl}
          onChange={handleApiUrlChange}
          placeholder="http://your-server.com/api/konek.php"
          style={{width: '100%', maxWidth: '500px'}}
        />
      </div>
      
      <div className="credentials-form">
        <h3>Database Connection</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Host:</label>
          </div>
          
          <div className="form-group">
            <label>Username:</label>
          </div>
          
          <div className="form-group">
            <label>Password:</label>
          </div>
          
          <div className="form-group">
            <label>Database:</label>
          </div>
        </div>
        
        <button 
          onClick={testConnection} 
          disabled={loading}
          className="btn-test"
        >
          {loading ? 'Testing...' : 'Test & Connect'}
        </button>
        
        {connectionStatus && (
          <div className={`status-message ${connectionStatus.status}`}>
            <strong>Status:</strong> {connectionStatus.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;