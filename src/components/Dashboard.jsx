import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  // Cek otomatis apakah sudah login
  if (!localStorage.getItem('isLoggedIn')) {
    navigate('/');
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>🎉 Selamat Datang di Beranda!</h1>
      <p>Anda berhasil login.</p>
      <button onClick={handleLogout} style={{ padding: '10px', cursor: 'pointer' }}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;