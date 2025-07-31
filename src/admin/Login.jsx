import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [input, setInput] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const url = isLogin ? '/api/login.php' : '/api/register.php';
    try {
      const res = await axios.post(url, input);
      if (res.data.success) {
        setSuccess(res.data.message);
        if (isLogin) {
          localStorage.setItem('user', res.data.username);
          window.location.href = '/';
        } else {
          setIsLogin(true);
        }
      } else {
        setError(res.data.message);
      }
    } catch {
      setError('Gagal koneksi');
    }
  };

  return (
    <div style={{ padding: '40px' }}>
      <h2>{isLogin ? 'Masuk' : 'Daftar'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" value={input.username} onChange={handleChange} required style={{ padding: '8px', margin: '5px 0', width: '200px' }} />
        <br />
        <input name="password" type="password" placeholder="Password" value={input.password} onChange={handleChange} required style={{ padding: '8px', margin: '5px 0', width: '200px' }} />
        <br />
        <button type="submit" style={{ padding: '10px 20px', margin: '10px 0' }}>{isLogin ? 'Login' : 'Daftar'}</button>
      </form>
      <p>
        {isLogin ? (
          <>Belum daftar? <span onClick={() => setIsLogin(false)} style={{ color: 'blue', cursor: 'pointer' }}>Daftar</span></>
        ) : (
          <>Sudah punya akun? <span onClick={() => setIsLogin(true)} style={{ color: 'blue', cursor: 'pointer' }}>Login</span></>
        )}
      </p>
    </div>
  );
};

export default Login;