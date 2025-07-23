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

  // === STYLES ===
  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f2f5',
      padding: '20px'
    },
    card: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      width: '100%',
      maxWidth: '400px'
    },
    title: {
      textAlign: 'center',
      color: '#2c3e50',
      fontSize: '1.8em',
      marginBottom: '10px'
    },
    subtitle: {
      textAlign: 'center',
      color: '#7f8c8d',
      marginBottom: '20px',
      fontSize: '14px'
    },
    error: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      padding: '10px',
      borderRadius: '6px',
      marginBottom: '15px',
      fontSize: '14px',
      textAlign: 'center'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    field: {
      display: 'flex',
      flexDirection: 'column'
    },
    label: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#2c3e50',
      marginBottom: '6px'
    },
    input: {
      padding: '12px',
      fontSize: '16px',
      border: '1px solid #bdc3c7',
      borderRadius: '6px',
      outline: 'none'
    },
    button: {
      padding: '12px',
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginTop: '10px'
    },
    footer: {
      textAlign: 'center',
      marginTop: '20px',
      fontSize: '14px',
      color: '#7f8c8d'
    },
    link: {
      color: '#3498db',
      textDecoration: 'none',
      fontWeight: 'bold',
      cursor: 'pointer'
    }
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
};

export default Login;
