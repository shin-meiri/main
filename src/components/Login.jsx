import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true); // true = login, false = register
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/auth.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, action: isLogin ? 'login' : 'register' })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        if (isLogin) {
          // Simpan login state
          localStorage.setItem('user', data.username);
          onLogin(data.username);
        } else {
          setIsLogin(true); // auto pindah ke login setelah daftar
        }
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal terhubung ke server' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          {isLogin ? '🔐 Masuk' : '📝 Daftar'}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>👤 Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Masukkan username"
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

          {message && (
            <div style={
              message.type === 'success' ? styles.alertSuccess : styles.alertError
            }>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading ? 'Sedang proses...' : isLogin ? 'Masuk' : 'Daftar'}
          </button>
        </form>

        {/* Switch Mode */}
        <div style={styles.footer}>
          {isLogin ? (
            <p>
              Belum punya akun?{' '}
              <span onClick={() => setIsLogin(false)} style={styles.link}>
                Daftar di sini
              </span>
            </p>
          ) : (
            <p>
              Sudah punya akun?{' '}
              <span onClick={() => setIsLogin(true)} style={styles.link}>
                Masuk di sini
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// === STYLES ===
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    padding: '20px'
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  },
  header: {
    backgroundColor: '#4a6fa5',
    color: 'white',
    fontSize: '1.5em',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: '20px',
  },
  form: {
    padding: '25px'
  },
  field: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#2c3e50'
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border 0.3s'
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.3s'
  },
  alertSuccess: {
    padding: '12px',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '6px',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '15px'
  },
  alertError: {
    padding: '12px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '6px',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '15px'
  },
  footer: {
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    borderTop: '1px solid #eee',
    fontSize: '14px',
    color: '#555'
  },
  link: {
    color: '#3498db',
    fontWeight: 'bold',
    cursor: 'pointer',
    textDecoration: 'underline'
  }
};

export default Login;
