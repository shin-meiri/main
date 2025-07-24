import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 

const Header = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch('/api/data.php')
      .then(res => res.json())
      .then(json => setData(json));
  }, []);

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <Link to="/" style={styles.logoLink}>
          <img src={data.logo} alt="Logo" style={styles.logo} />
        </Link>
      </div>
      <div style={styles.right}>
        {data.header?.links?.map((link, index) => (
          <Link key={index} to={link.url} style={styles.link}>
            {link.name}
          </Link>
        ))}
      </div>
    </header>
  );
};


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