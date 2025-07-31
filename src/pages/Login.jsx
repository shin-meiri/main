// Login.jsx
import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // 🔁 GANTI INI DENGAN DOMAIN KAMU YANG BENAR
    const API_URL = 'https://bos.free.nf/api/login.php';

    try {
      const response = await axios.post(API_URL, {
        username,
        password,
      });

      if (response.data.success) {
        setMessage('✅ Login berhasil!');
      } else {
        setMessage('❌ ' + (response.data.message || 'Login gagal'));
      }
    } catch (error) {
      // 🔍 Debug error secara detail
      if (error.response) {
        // Server merespons tapi error (4xx, 5xx)
        setMessage(`❌ Server error: ${error.response.status} - ${error.response.data.message || 'Gagal login'}`);
      } else if (error.request) {
        // Tidak ada respons sama sekali (timeout, network)
        setMessage('❌ Tidak bisa terhubung ke server. Cek URL atau koneksi internet.');
        console.log('Request:', error.request);
      } else {
        // Kesalahan lain
        setMessage('❌ Error: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Login dengan Axios</h2>
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
          {loading ? 'Mengirim...' : 'Login'}
        </button>
      </form>
      {message && (
        <p
          style={{
            marginTop: '10px',
            color: message.includes('berhasil') ? 'green' : 'red',
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
