// src/pages/Login.js
import React, { useState } from 'react';
import axios from '../services/api';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Cegah reload
    setError(''); // Reset error

    try {
      const res = await axios.post('/api/login.php', { username, password });
      if (res.data.success) {
        onLogin();
      } else {
        setError(res.data.message || 'Login gagal');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Gagal terhubung ke server. Coba lagi.');
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
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
        {/* 🔥 Pastikan type="submit" */}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;        <input
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
