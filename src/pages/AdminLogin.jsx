import React, { useState } from 'react';
import { login } from '../utils/auth';

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(username, password);
    if (result.success) {
      onLogin(result.user);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div style={loginStyle.container}>
      <form onSubmit={handleSubmit} style={loginStyle.form}>
        <h2>Admin Login</h2>
        {error && <p style={loginStyle.error}>{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={loginStyle.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={loginStyle.input}
          required
        />
        <button type="submit" disabled={loading} style={loginStyle.button}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

const loginStyle = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
  },
  form: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    width: '300px',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: '0.8rem',
    margin: '0.5rem 0',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  button: {
    width: '100%',
    padding: '0.8rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    fontSize: '0.9rem',
  },
};

export default AdminLogin;
