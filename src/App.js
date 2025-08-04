import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://your-infinityfree-site.000webhostapp.com/login.php', {
        username,
        password,
      });
      if (res.data.success) {
        localStorage.setItem('auth', 'true');
        setMessage('');
        window.location.href = '/dashboard'; // redirect
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      setMessage('Kesalahan koneksi ke server');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

const Dashboard = () => {
  const handleLogout = () => {
    localStorage.removeItem('auth');
    window.location.href = '/login';
  };
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Selamat datang! Anda sudah login.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

const App = () => {
  const isAuthenticated = () => !!localStorage.getItem('auth');

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
