// Contoh di App.js
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Admin from './Admin';

function App() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  return (
    <Routes>
     <Route path="/login" element={<Login />} />
<Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;