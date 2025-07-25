// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Pages from './pages/Pages';
import Login from './pages/Login';
import Admin from './Admin';

function App() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  return (
    <BrowserRouter>
      <Routes>
        {/* Gunakan Pages sebagai layout, dan di dalamnya tampilkan Login */}
        <Route path="/" element={<Pages />}>
          <Route index element={<Login />} />
        </Route>

        {/* Halaman Admin */}
        <Route
          path="/admin"
          element={isLoggedIn ? <Admin /> : <Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
