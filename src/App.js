// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Admin from './Admin';

function App() {
  // Selalu baca dari localStorage saat render
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman Login */}
        <Route path="/" element={<Login />} />

        {/* Halaman Admin - hanya bisa masuk jika sudah login */}
        <Route
          path="/admin"
          element={isLoggedIn ? <Admin /> : <Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;