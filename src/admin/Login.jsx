import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Login = () => {
  const [input, setInput] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [style, setStyle] = useState({});
  const [hover, setHover] = useState(false);

  useEffect(() => {
    axios.get('/api/get-css.php')
      .then(res => setStyle(res.data.login || {}))
      .catch(() => setStyle({}));
  }, []);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Proses login
  };

  if (!style.form) return <div>Memuat...</div>;

  return (
    <div style={style.form}>
      <h2 style={style.title}>Masuk</h2>
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
        <button
          type="submit"
          style={hover ? { ...style.button, ...style.buttonHover } : style.button}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          Login
        </button>
      </form>
      <a href="#/" style={style.link}>Kembali ke Beranda</a>
    </div>
  );
};

export default Login;