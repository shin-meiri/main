import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userData from '../data/user.json';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === userData.username && password === userData.password) {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Username atau password salah!');
    }
  };

  return (
    <div style={loginStyle.container}>
      <form onSubmit={handleSubmit} style={loginStyle.form}>
        <h2>Admin Login</h2>
        {error && <p style={loginStyle.error}>{error}</p>}
        <div style={loginStyle.inputGroup}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={loginStyle.input}
          />
        </div>
        <div style={loginStyle.inputGroup}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={loginStyle.input}
          />
        </div>
        <button type="submit" style={loginStyle.button}>
          Login
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
  inputGroup: {
    marginBottom: '1rem',
    textAlign: 'left',
  },
  input: {
    width: '100%',
    padding: '8px',
    margin: '4px 0',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    fontSize: '0.9rem',
    marginBottom: '1rem',
  },
};

export default Login;