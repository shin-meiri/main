import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DatabaseTestForm from './components/DatabaseTestForm';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<DatabaseTestForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;