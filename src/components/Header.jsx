import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch('/api/data.php')
      .then((res) => {
        if (!res.ok) throw new Error('Gagal muat data');
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => console.error(err));
  }, []);

  // Tunggu data selesai dimuat
  if (!data.logo) {
    return <header style={styles.header}>Loading...</header>;
  }

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <Link to="/" style={styles.logoLink}>
          <img src={data.logo} alt="Logo" style={styles.logo} />
        </Link>
      </div>
      <div style={styles.right}>
        {Array.isArray(data.header?.links) &&
          data.header.links.map((link, index) => (
            <Link key={index} to={link.url} style={styles.link}>
              {link.name}
            </Link>
          ))}
      </div>
    </header>
  );
};

// ... styles tetap sama
const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#fff',
    borderBottom: '1px solid #ddd',
  },
  left: { display: 'flex', alignItems: 'center' },
  right: { display: 'flex', gap: '1.5rem' },
  logo: { height: '40px' },
  logoLink: { textDecoration: 'none' },
  link: {
    textDecoration: 'none',
    color: '#333',
    fontWeight: '500',
    fontSize: '1rem',
  },
};

export default Header;