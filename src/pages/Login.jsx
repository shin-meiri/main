// pages/Login.jsx
import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Auth from './Auth';

const Login = () => {
  const router = useRouter();

  // Cek jika sudah login, redirect ke dashboard
  if (Auth.isAuthenticated()) {
    router.push('/');
    return <p>Redirecting...</p>;
  }

  const handleLogin = () => {
    // Simulasi login (simpan ke localStorage)
    localStorage.setItem('isLoggedIn', 'true');
    router.push('/');
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Login</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;