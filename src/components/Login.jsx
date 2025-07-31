// Login.jsx
import React, { useState } from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://bos.free.nf/api/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage('Login berhasil!');
      } else {
        setMessage(result.message || 'Login gagal');
      }
    } catch (error) {
      setMessage('Gagal terhubung ke server.');
      console.error('Error:', error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Login Demo</h2>
      <form onSubmit={handleLogin}>
        <div style={{ margin: '10px 0' }}>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Masukkan username"
            required
          />
        </div>
        <div style={{ margin: '10px 0' }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password"
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p style={{ color: message.includes('berhasil') ? 'green' : 'red' }}>{message}</p>}
    </div>
  );
};

export default Login;