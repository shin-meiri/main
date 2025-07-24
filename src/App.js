import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Post from './pages/Post';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Dashboard from './pages/Admin/Dashboard'; 
import SettingsForm from './pages/Admin/SettingsForm'; 

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post" element={<Post />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/SettingsForm" element={<SettingsForm />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;