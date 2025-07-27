import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Pages from './pages/Pages';

function App() {
  const isAuthenticated = localStorage.getItem('isAuthenticated');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/pages" 
          element={isAuthenticated ? <Pages /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
