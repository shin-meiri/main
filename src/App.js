// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Pages from './pages/Pages';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Pages />} />
      </Routes>
    </Router>
  );
};

export default App;