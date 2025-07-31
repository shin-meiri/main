import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <div style={styles.app}>
        <Header />
        <main style={styles.main}>
          <Routes>
            {/* Jika sudah login, / langsung ke dashboard */}
            <Route
              path="/"
              element={
                localStorage.getItem('isLoggedIn') ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Login />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

const styles = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  },
  main: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
};

export default App;