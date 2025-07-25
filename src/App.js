import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TestConnection from './TestConnection';

function App() {
  return (
    <Router>
      <div>
        <nav style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>
          <Link to="/test">Tes Koneksi DB</Link>
        </nav>

        <Routes>
          <Route path="/test" element={<TestConnection />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;