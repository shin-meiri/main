import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('https://bos.free.nf/api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('isLoggedIn', 'true');
        navigate('/dashboard'); // ← PASTI pindah
      } else {
        setError(data.message || 'Login gagal');
      }
    } catch (err) {
      setError('Gagal koneksi ke server. Cek URL API.');
    }
  };

  return (
    <div style={css.container}>
      <div style={css.box}>
        <h2>Masuk</h2>
        <form onSubmit={handleLogin}>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={css.input}
            required
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={css.input}
            required
          />
          <button type="submit" style={css.btn}>Login</button>
        </form>
        {error && <div style={css.error}>{error}</div>}
      </div>
    </div>
  );
}

// CSS sederhana
const css = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    margin: 0,
    padding: 0,
  },
  box: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    width: '320px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  input: {
    width: '100%',
    padding: '12px',
    margin: '8px 0',
    border: '1px solid #ddd',
    borderRadius: '6px',
    boxSizing: 'border-box',
  },
  btn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#1877f2',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  error: {
    color: 'red',
    fontSize: '14px',
    marginTop: '10px',
  },
};