import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Login = () => {
  const [input, setInput] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [data, setData] = useState({});

  useEffect(() => {
    axios.get('/api/get-css.php')
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
    } catch {
      setError('Gagal koneksi ke server');
    }
  };

  const style = data.login || {};

  return (
    <div style={style.form}>
      <h2 style={style.title}>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" value={input.username} onChange={handleChange} style={style.input} required />
        <input name="password" type="password" placeholder="Password" value={input.password} onChange={handleChange} style={style.input} required />
        <button type="submit" style={style.button}>Login</button>
      </form>
      <a href="#/" style={style.link}>Kembali ke Beranda</a>
    </div>
  );
};

export default Login;