import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Login = () => {
  const [input, setInput] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [data, setData] = useState({});

  useEffect(() => {
    axios.get('/api/theme.php')
      .then(res => setData(res.data))
      .catch(() => setData({}));
  }, []);

  const formStyle = {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '30px',
    background: data.login?.formBg || 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
  };

  const buttonStyle = {
    background: data.login?.buttonBg || '#007BFF',
    color: 'white',
    border: 'none',
    padding: '12px',
    width: '100%',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    border: `1px solid ${data.login?.inputBorder || '#ddd'}`,
    borderRadius: '8px',
    fontSize: '16px'
  };

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (input.username && input.password) {
      localStorage.setItem('user', input.username);
      window.location.href = '#/';
    } else {
      setError('Isi semua field');
    }
  };

  return (
    <div style={formStyle}>
      <h2 style={{ textAlign: 'center' }}>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={input.username}
          onChange={handleChange}
          style={inputStyle}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={input.password}
          onChange={handleChange}
          style={inputStyle}
          required
        />
        <button type="submit" style={buttonStyle}>Login</button>
      </form>
    </div>
  );
};

export default Login;