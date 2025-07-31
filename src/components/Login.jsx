import { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // ✅ WAJIB di-import

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // ✅ Inisialisasi navigate

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(''); // Reset pesan

    try {
      const response = await fetch('https://bos.free.nf/api/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        console.log('Login sukses, arahkan ke /dashboard'); // 🔍 Debug
        navigate('/dashboard'); // ✅ Ini yang pindahkan halaman
      } else {
        setMessage(data.message || 'Login gagal');
      }
    } catch (err) {
      console.error('Error login:', err); // 🔍 Lihat error
      setMessage('Gagal terhubung ke server. Cek console (F12)');
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
        {message && <p style={styles.error}>{message}</p>}
      </div>
    </div>
  );
}

// ✅ Style tetap sama
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
    margin: '8px 0',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
};

export default Login;