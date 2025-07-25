// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DynamicPage from './DynamicPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/page/:slug" element={<DynamicPage />} />
          <Route path="/" element={<HomeRedirect />} />
        </Routes>
      </div>
    </Router>
  );
}

function HomeRedirect() {
  // Redirect ke /page/home
  useEffect(() => {
    window.location.href = '/page/home';
  }, []);
  return <div>Memuat...</div>;
}

export default App;