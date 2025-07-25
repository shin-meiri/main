// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TestConnection from './TestConnection'; // Pastikan path benar

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/test-db" element={<TestConnection />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;