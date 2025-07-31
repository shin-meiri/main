import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('isLoggedIn')) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <h1>🎉 Selamat Datang di Beranda!</h1>
      <p style={styles.text}>
        Anda telah berhasil login. Ini adalah halaman utama aplikasi Anda.
      </p>
      <button onClick={handleLogout} style={styles.logoutButton}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: '40px 20px',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    minHeight: 'calc(100vh - 120px)',
  },
  text: {
    fontSize: '18px',
    color: '#495057',
    maxWidth: '600px',
    margin: '20px auto',
    lineHeight: '1.6',
  },
  logoutButton: {
    padding: '12px 24px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default Dashboard;