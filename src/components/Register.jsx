// src/components/Register.jsx
import React, { useState } from 'react';

const Register = ({ onLogin }) => {
  const [form, setForm] = useState({ nama: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Password tidak cocok!');
      return;
    }

    setLoading(true);

    fetch('/user.json')
      .then(res => res.json())
      .then(users => {
        if (users.some(u => u.nama === form.nama)) {
          setError('Nama sudah digunakan!');
          setLoading(false);
          return;
        }

        const newUser = { nama: form.nama, email: form.email, password: form.password };
        alert(
          'Fitur daftar hanya simulasi.\n\n' +
          'Untuk menyimpan permanen:\n' +
          '1. Tambahkan user baru ke user.json\n' +
          '2. Upload ulang file ke server\n\n' +
          'Nama: ' + form.nama + '\nEmail: ' + form.email
        );

        localStorage.setItem('user', JSON.stringify(newUser));
        onLogin(newUser);
      })
      .catch(err => {
        setError('Gagal memuat user.json. Pastikan file ada!');
        console.error(err);
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
      maxWidth: '450px'
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
      backgroundColor: '#27ae60',
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
        <h2 style={styles.title}>📝 Daftar Akun</h2>
        <p style={styles.subtitle}>Isi data untuk membuat akun baru</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>👤 Nama</label>
            <input
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              placeholder="Pilih nama unik"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>📧 Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="anda@example.com"
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

          <div style={styles.field}>
            <label style={styles.label}>🔁 Konfirmasi Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Mendaftar...' : 'Daftar Sekarang ✨'}
          </button>
        </form>

        <div style={styles.footer}>
          Sudah punya akun?{' '}
          <a href="#login" onClick={() => onLogin(null, 'login')} style={styles.link}>
            Masuk di sini
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
