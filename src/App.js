// App.js
import React, { useEffect } from 'react'; // 🔴 Tambahkan { useEffect }
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

// Komponen untuk redirect ke /page/home
function HomeRedirect() {
  useEffect(() => {
    window.location.href = '/page/home';
  }, []); // [] artinya jalan sekali saat mount

  return <div>Memuat halaman utama...</div>;
}

export default App;
