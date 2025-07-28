import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Pages from './pages/Pages';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Pages />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
