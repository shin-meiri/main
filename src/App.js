// Di App.js
function App() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/admin/*"
        element={isLoggedIn ? <Admin /> : <Navigate to="/" />}
      />
    </Routes>
  );
}