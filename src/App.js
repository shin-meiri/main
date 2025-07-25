// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TestConnection from './components/TestConnection'; // Sesuaikan path

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/test-db" element={<TestConnection />} />
          {/* Rute lain... */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;