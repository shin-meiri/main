import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 🔐 Username dan password disimpan di sini (bisa diganti)
  const validUsername = 'admin';
  const validPassword = '1234';

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === validUsername && password === validPassword) {
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/dashboard');
    } else {
      setError('Username atau password salah!');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Masuk</h2>
      <form onSubmit={handleLogin}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '60px',
    fontFamily: 'Arial, sans-serif',
  },
  input: {
    padding: '12px',
    margin: '8px',
    width: '220px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
  },
  button: {
    padding: '12px 24px',
    margin: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default Login;