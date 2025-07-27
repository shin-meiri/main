import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import DynamicRenderer from './components/DynamicRenderer';

const AppContent = () => {
  const location = useLocation();
  const pageSlug = location.pathname === '/' ? 'home' : location.pathname.substring(1);

  return (
    <Routes>
      <Route path="*" element={<DynamicRenderer pageSlug={pageSlug} />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;