import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [input, setInput] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await axios.post('/api/login.php', input);
      if (res.data.success) {
        setSuccess('Login berhasil!');
        localStorage.setItem('user', res.data.username);
        setTimeout(() => { window.location.href = '#/'; }, 1000);
      } else {
        setError(res.data.message);
      }
    } catch {
      setError('Gagal koneksi ke server');
    }
  };

  return (
    <div style={{ padding: '40px' }}>
      <h2>Masuk</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={input.username}
          onChange={handleChange}
          required
          style={{ padding: '8px', margin: '5px 0', display: 'block', width: '200px' }}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={input.password}
          onChange={handleChange}
          required
          style={{ padding: '8px', margin: '5px 0', display: 'block', width: '200px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', marginTop: '10px' }}>
          Login
        </button>
      </form>
      <p>
        <a href="#/">Kembali ke Beranda</a>
      </p>
    </div>
  );
};

export default Login;