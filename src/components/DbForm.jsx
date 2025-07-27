// frontend/src/components/DatabaseConnector.js
import React, { useState } from 'react';
import axios from 'axios';

const DatabaseConnector = () => {
  // State untuk kredensial database
  const [credentials, setCredentials] = useState({
    host: 'localhost',
    username: '',
    password: '',
    database: ''
  });
  
  // State untuk hasil
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [queryResult, setQueryResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('SELECT * FROM users LIMIT 10');

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
    try {
      const response = await axios.post('http://localhost/backend/api/konek.php', {
        action: 'test_connection',
        host: credentials.host,
        username: credentials.username,
        password: credentials.password,
        database: credentials.database
      });
      
      setConnectionStatus(response.data);
    } catch (error) {
      setConnectionStatus({
        status: 'error',
        message: error.response?.data?.message || 'Connection failed'
      });
    }
    setLoading(false);
  };

  // Jalankan query
  const executeQuery = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.post('http://localhost/backend/api/konek.php', {
        action: 'connect_and_query',
        host: credentials.host,
        username: credentials.username,
        password: credentials.password,
        database: credentials.database,
        query: query
      });
      
      setQueryResult(response.data);
    } catch (error) {
      setQueryResult({
        status: 'error',
        message: error.response?.data?.message || 'Query failed'
      });
    }
    setLoading(false);
  };

  // Dapatkan struktur database
  const getDatabaseStructure = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost/backend/api/konek.php', {
        action: 'get_structure',
        host: credentials.host,
        username: credentials.username,
        password: credentials.password,
        database: credentials.database
      });
      
      setQueryResult(response.data);
    } catch (error) {
      setQueryResult({
        status: 'error',
        message: error.response?.data?.message || 'Failed to get structure'
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