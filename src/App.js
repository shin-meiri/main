import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TestConnection from './TestConnection';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/test-db" element={<TestConnection />} />
        {/* Rute lain... */}
      </Routes>
    </Router>
  );
}

export default App;