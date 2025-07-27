// /pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [credentials, setCredentials] = useState({
    user: '',
    password: ''
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  // Load users data from API
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/dat.php');
      setUsers(response.data);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Gagal memuat data users');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
    // Clear error when user types
    if (loginError) setLoginError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!credentials.user || !credentials.password) {
      setLoginError('Username dan password harus diisi!');
      return;
    }

    try {
      // Cari user yang cocok
      const user = users.find(u => 
        u.user === credentials.user && u.password === credentials.password
      );

      if (user) {
        // Login berhasil
        // Simpan info user di sessionStorage
        sessionStorage.setItem('loggedInUser', JSON.stringify({
          id: user.id,
          user: user.user
        }));
        
        // Redirect ke halaman dashboard atau home
        navigate('/dashboard');
      } else {
        setLoginError('Username atau password salah!');
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoginError('Terjadi kesalahan saat login');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('loggedInUser');
    setCredentials({ user: '', password: '' });
  };

  // Cek apakah user sudah login
  const loggedInUser = sessionStorage.getItem('loggedInUser');
  
  if (loggedInUser) {
    const user = JSON.parse(loggedInUser);
    return (
      <div style={{
        backgroundColor: 'black',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white'
      }}>
        <div style={{
          backgroundColor: '#222',
          padding: '30px',
          borderRadius: '10px',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%'
        }}>
          <h1 style={{ color: 'pink', marginBottom: '20px' }}>Welcome</h1>
          <p>Anda sudah login sebagai:</p>
          <h3 style={{ color: 'cyan', margin: '15px 0' }}>{user.user}</h3>
          <p>ID User: {user.id}</p>
          
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div style={{ 
      backgroundColor: 'black', 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      color: 'white'
    }}>
      Loading users data...
    </div>
  );

  if (error) return (
    <div style={{ 
      backgroundColor: 'black', 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      color: 'red'
    }}>
      Error: {error}
    </div>
  );

  return (
    <div style={{
      backgroundColor: 'black',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        backgroundColor: '#222',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 0 20px rgba(255, 192, 203, 0.3)',
        maxWidth: '400px',
        width: '100%'
      }}>
        {/* Header Welcome */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{
            color: 'pink',
            fontSize: '2.5rem',
            margin: '0'
          }}>
            Welcome
          </h1>
          <p style={{ color: '#ccc', marginTop: '10px' }}>
            Silahkan Login
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: 'white' 
            }}>
              Username:
            </label>
            <input
              type="text"
              name="user"
              value={credentials.user}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#444',
                border: '1px solid #666',
                borderRadius: '5px',
                color: 'white',
                fontSize: '16px'
              }}
              placeholder="Masukkan username"
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: 'white' 
            }}>
              Password:
            </label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#444',
                border: '1px solid #666',
                borderRadius: '5px',
                color: 'white',
                fontSize: '16px'
              }}
              placeholder="Masukkan password"
            />
          </div>

          {loginError && (
            <div style={{ 
              color: '#ff6b6b', 
              marginBottom: '15px',
              padding: '10px',
              backgroundColor: 'rgba(255, 107, 107, 0.1)',
              borderRadius: '5px',
              border: '1px solid #ff6b6b'
            }}>
              {loginError}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: 'pink',
              color: 'black',
              border: 'none',
              padding: '12px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#ff8e8e'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'pink'}
          >
            Login
          </button>
        </form>

        {/* Info Users untuk testing */}
        <div style={{ 
          marginTop: '25px', 
          padding: '15px', 
          backgroundColor: '#333', 
          borderRadius: '5px',
          fontSize: '12px'
        }}>
          <h4 style={{ color: 'cyan', margin: '0 0 10px 0' }}>Users Tersedia:</h4>
          {users.slice(0, 3).map((user, index) => (
            <div key={user.id} style={{ 
              marginBottom: '5px',
              color: '#ccc'
            }}>
              <span style={{ color: 'pink' }}>{user.user}</span> / {user.password}
            </div>
          ))}
          {users.length > 3 && (
            <div style={{ color: '#999', fontStyle: 'italic' }}>
              ... dan {users.length - 3} user lainnya
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;