// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Pages from './pages/Pages';
import Login from './pages/Login';
import Connect from './pages/Connect';
import Cuan from './pages/Cuan';
import Post from './pages/Post';
import EditPage from './pages/EditPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Pages />} />
        <Route path="/login" element={<Login />} />
        <Route path="/connect" element={<Connect />} />
        <Route path="/cuan" element={<Cuan />} />
        <Route path="/" element={<Post />} />
        <Route path="/edit" element={<EditPage />} />
      </Routes>
    </Router>
  );
};

export default App;
