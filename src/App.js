// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Admin from './Admin';

// Komponen PrivateRoute untuk melindungi rute admin
const PrivateRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Login */}
        <Route path="/login" element={<Login />} />

        {/* Rute Admin yang dilindungi */}
        <Route
          path="/admin/*"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        />

        {/* Redirect default */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Jika halaman tidak ditemukan */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;