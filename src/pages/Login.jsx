import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  // Cek jika sudah login, redirect ke /
  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      router.push('/');
    }
  }, [router]);

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulasi login sukses (bisa diganti dengan API)
    if (username && password) {
      localStorage.setItem('isLoggedIn', 'true');
      router.push('/');
    } else {
      alert('Username dan password wajib diisi');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;