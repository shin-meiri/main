import React from 'react';

const Header = ({ logo, menu }) => {
  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <img src={logo} alt="Logo" style={styles.logo} />
      </div>
      <nav style={styles.right}>
        <a href="/" style={styles.navLink}>
          {menu.home}
        </a>
        <a href="/login" style={styles.navLink}>
          {menu.login}
        </a>
      </nav>
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #ddd',
  },
  left: { display: 'flex', alignItems: 'center' },
  logo: { height: 40 },
  right: { display: 'flex', gap: '1.5rem' },
  navLink: {
    textDecoration: 'none',
    color: '#333',
    fontWeight: '500',
    fontSize: '1rem',
  },
};

export default Header;