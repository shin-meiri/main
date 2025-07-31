// Login.jsx
import React, { useState } from 'react';
import axios from 'axios';  // Import axios

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('https://bos.free.nf/api/login.php', {
        username,
        password,
      });

      if (response.data.success) {
        setMessage('✅ Login berhasil!');
      } else {
        setMessage('❌ ' + response.data.message);
      }
    } catch (error) {
      if (error.response) {
        // Server merespons dengan status selain 2xx
        setMessage(`❌ Error: ${error.response.data.message || 'Gagal login'}`);
      } else if (error.request) {
        // Tidak ada respons dari server (timeout, URL salah, dll)
        setMessage('❌ Tidak bisa terhubung ke server. Cek URL atau koneksi.');
      } else {
        // Kesalahan lain
        setMessage('❌ Kesalahan: ' + error.message);
      }
      console.error('Axios error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Login (Axios)</h2>
      <form onSubmit={handleLogin}>
        <div style={{ margin: '10px 0' }}>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="root"
            required
          />
        </div>
        <div style={{ margin: '10px 0' }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="12348765"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
      {message && (
        <p
          style={{
            color: message.includes('berhasil') ? 'green' : 'red',
            marginTop: '10px',
            fontWeight: 'bold',
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Login;