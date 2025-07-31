import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      <div style={styles.formBox}>
        <h2>Masuk ke Akun</h2>
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
        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 120px)',
    backgroundColor: '#f4f6f9',
    padding: '20px',
  },
  formBox: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    width: '300px',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  button: {
    padding: '12px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    width: '100%',
    marginTop: '10px',
  },
  error: {
    color: 'red',
    marginTop: '10px',
    fontSize: '14px',
  },
};

export default Login;