// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    sessionStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  useEffect(() => {
    if (sessionStorage.getItem('isLoggedIn')) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/login"
          element={<Login onLogin={handleLogin} />}
        />
      </Routes>
    </Router>
  );
}

export default App;