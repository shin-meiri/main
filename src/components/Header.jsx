function Header() {
  return (
    <header style={styles.header}>
      <h1>🔐 SecureApp</h1>
      <nav>
        <a href="#/" style={styles.navLink}>Home</a>
        <a href="#/dashboard" style={styles.navLink}>Beranda</a>
      </nav>
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: '#0056b3',
    color: 'white',
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  },
  navLink: {
    color: 'white',
    margin: '0 15px',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

export default Header;