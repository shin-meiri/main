// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

// Tambahkan Navigate
import { Navigate } from 'react-router-dom';
export default App;