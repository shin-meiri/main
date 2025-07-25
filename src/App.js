// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Admin from './Admin'; // ✅ Benar: dari src/Admin.jsx

function App() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/admin"
          element={isLoggedIn ? <Admin /> : <Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;