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

    // Ambil user.json
    fetch('/user.json')
      .then(res => res.json())
      .then(users => {
        if (users.some(u => u.nama === form.nama)) {
          setError('Nama sudah digunakan!');
          setLoading(false);
          return;
        }

        // Simpan user baru
        const newUser = { nama: form.nama, email: form.email, password: form.password };
        const updatedUsers = [...users, newUser];

        // Di sini kita tidak bisa langsung tulis ke file di InfinityFree
        // Jadi kita beri pesan: "Simpan manual" atau gunakan backend
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
