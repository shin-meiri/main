// Contoh di App.js
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from 'Login';
import Admin from 'Admin';

function App() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/admin"
        element={isLoggedIn ? <Admin /> : <Navigate to="/" />}
      />
    </Routes>
  );
}