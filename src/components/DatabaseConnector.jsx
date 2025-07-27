// frontend/src/components/DatabaseConnector.js
import React, { useState } from 'react';
import axios from 'axios';

const DatabaseConnector = () => {
  // State untuk kredensial database
  const [credentials, setCredentials] = useState({
    host: '',
    username: '',
    password: '',
    database: ''
  });
  
  // State untuk hasil
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [queryResult, setQueryResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('SELECT VERSION() as mysql_version');

  // Handle perubahan input
  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  // Test koneksi database
  const testConnection = async () => {
    setLoading(true);
    setConnectionStatus(null);
    
    try {
      console.log('Testing connection with:', credentials); // Debug log
      
      const response = await axios.post('http://localhost:8000/api/konek.php', {
        action: 'test_connection',
        host: credentials.host,
        username: credentials.username,
        password: credentials.password,
        database: credentials.database
      }, {
        timeout: 10000 // 10 detik timeout
      });
      
      console.log('Response:', response.data); // Debug log
      setConnectionStatus(response.data);
    } catch (error) {
      console.error('Connection error:', error); // Debug log
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Connection failed';
      
      setConnectionStatus({
        status: 'error',
        message: errorMessage,
        debug: {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: './api/konek.php'
        }
      });
    }
    setLoading(false);
  };

  // Jalankan query
  const executeQuery = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setQueryResult(null);
    
    try {
      const response = await axios.post('./api/konek.php', {
        action: 'connect_and_query',
        host: credentials.host,
        username: credentials.username,
        password: credentials.password,
        database: credentials.database,
        query: query
      }, {
        timeout: 15000 // 15 detik timeout
      });
      
      setQueryResult(response.data);
    } catch (error) {
      console.error('Query error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Query failed';
      
      setQueryResult({
        status: 'error',
        message: errorMessage,
        debug: {
          status: error.response?.status,
          statusText: error.response?.statusText
        }
      });
    }
    setLoading(false);
  };

  // Dapatkan struktur database
  const getDatabaseStructure = async () => {
    setLoading(true);
    setQueryResult(null);
    
    try {
      const response = await axios.post('http://localhost:8000/api/konek.php', {
        action: 'get_structure',
        host: credentials.host,
        username: credentials.username,
        password: credentials.password,
        database: credentials.database
      });
      
      setQueryResult(response.data);
    } catch (error) {
      console.error('Structure error:', error);
      
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
      
      {/* Form Kredensial Database */}
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
        
        <button 
          onClick={testConnection} 
          disabled={loading}
          className="btn-test"
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
        
        {connectionStatus && (
          <div className={`status-message ${connectionStatus.status}`}>
            <strong>Status:</strong> {connectionStatus.message}
            {connectionStatus.debug && (
              <div style={{marginTop: '10px', fontSize: '12px'}}>
                <strong>Debug Info:</strong>
                <pre>{JSON.stringify(connectionStatus.debug, null, 2)}</pre>
              </div>
            )}
          </div>
        )}
      </div>

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