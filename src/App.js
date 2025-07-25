// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DynamicPage from './DynamicPage';
import AdminPanel from './AdminPanel'; // Tambahkan ini

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/page/:slug" element={<DynamicPage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/" element={<Navigate to="/page/home" />} />
      </Routes>
    </Router>
  );
}
