// src/App.js
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DynamicPage from './DynamicPage';
import AdminPanel from './AdminPanel';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/page/:slug" element={<DynamicPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/" element={<Navigate to="/page/home" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
