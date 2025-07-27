import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect jika sudah login
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/pages';
      navigate(from, { replace: true });
    }
  }, [navigate, location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    if (serverError) {
      setServerError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username tidak boleh kosong';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password tidak boleh kosong';
    } else if (formData.password.length < 4) {
      newErrors.password = 'Password minimal 4 karakter';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setLoading(true);
    setServerError('');

    try {
      // Membaca file room.json
      const response = await axios.get('/api/rom.json');
      const { user, pass } = response.data;

      // Validasi kredensial
      if (formData.username === user && formData.password === pass) {
        // Simpan status login di localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify({ username: user }));
        
        // Redirect ke halaman sebelumnya atau pages
        const from = location.state?.from?.pathname || '/pages';
        navigate(from, { replace: true });
      } else {
        setServerError('Username atau password salah!');
      }
    } catch (err) {
      setServerError('Terjadi kesalahan saat login. Silakan coba lagi.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">Login Sistem</h2>
          <p className="login-subtitle">Silakan masukkan kredensial Anda</p>
        </div>
        
        {serverError && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className={`form-input ${errors.username ? 'input-error' : ''}`}
              placeholder="Masukkan username"
              autoComplete="username"
            />
            {errors.username && (
              <span className="error-message">{errors.username}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="password-input-container">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? 'input-error' : ''}`}
                placeholder="Masukkan password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Memproses...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="login-info">
            <strong>Kredensial default:</strong><br />
            Username: admin<br />
            Password: 1234admin
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;