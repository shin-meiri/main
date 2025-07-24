import React, { useState } from 'react';
import userData from '../../data/user.json';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === userData.username && password === userData.password) {
      onLogin(); // simpan status login
    } else {
      setError('Username atau password salah!');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        {error && <p className="error">{error}</p>}
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>

// Di dalam form Login.jsx, tambahkan tombol "Kembali"
<button type="button" onClick={() => (window.location.href = '/')} style={backButtonStyle}>
  Kembali
</button>

// Tambahkan di styles:
const backButtonStyle = {
  backgroundColor: '#6c757d',
  marginRight: '10px'
};

    </div>
  );
};

export default Login;