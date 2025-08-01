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

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await axios.post('/api/login.php', input);
      
      if (res.data.success) {
        localStorage.setItem('user', res.data.username);
        window.location.href = '#/';
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError('Gagal koneksi ke server');
    }
  };

  const style = data.login || {};
  const formStyle = { ...style.form };
  const buttonStyle = { ...style.button };

  return (
    <div style={formStyle}>
      <h2 style={style.title}>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={input.username}
          onChange={handleChange}
          style={style.input}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={input.password}
          onChange={handleChange}
          style={style.input}
          required
        />
        <button type="submit" style={buttonStyle}>Login</button>
      </form>
    </div>
  );
};

export default Login;