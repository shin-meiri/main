// frontend/src/App.js
import React from 'react';
import DatabaseConnector from './components/DatabaseConnector';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Multi-Database Manager</h1>
        <p>Connect to any database with your credentials</p>
      </header>
      
      <main>
        <DatabaseConnector />
      </main>
    </div>
  );
}

export default App;
