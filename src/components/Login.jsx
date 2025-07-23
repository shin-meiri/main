// src/components/Login.jsx
import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [form, setForm] = useState({ nama: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    fetch('/user.json')
      .then(res => res.json())
      .then(users => {
        const user = users.find(u => u.nama === form.nama && u.password === form.password);
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          onLogin(user);
        } else {
          setError('Nama atau password salah!');
        }
      })
      .catch(() => {
        setError('Gagal memuat data pengguna. Cek user.json!');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Masuk ke Akun</h2>
        <p style={styles.subtitle}>Silakan login untuk melanjutkan</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>👤 Nama</label>
            <input
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              placeholder="Masukkan nama kamu"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>🔑 Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Sedang masuk...' : 'Masuk 🚀'}
          </button>
        </form>

        <div style={styles.footer}>
          Belum punya akun?{' '}
          <a href="#register" onClick={() => onLogin(null, 'register')} style={styles.link}>
            Daftar di sini
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
