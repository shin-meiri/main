// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Pages from './pages/Pages';
import Login from './pages/Login';
import Connect from './pages/Connect';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Pages />} />
        <Route path="/login" element={<Login />} />
        <Route path="/connect" element={<Connect />} />
      </Routes>
    </Router>
  );
};

export default App;