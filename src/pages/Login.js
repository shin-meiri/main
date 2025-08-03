// src/pages/Login.js
import React, { useState } from 'react';
import axios from '../services/api';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post('/api/login.php', { username, password });
    if (res.data.success) {
      onLogin();
    } else {
      setError(res.data.message);
    }
  } catch (err) {
    console.error("Error login:", err.response?.data || err.message);
    setError('Gagal terhubung ke server. Cek konsol.');
  }
};

  return (
    <div className="container">
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
