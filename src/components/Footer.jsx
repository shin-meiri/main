import React, { useState, useEffect } from 'react';

const Footer = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch('/api/data.php')
      .then(res => res.json())
      .then(json => setData(json));
  }, []);

  return (
    <footer style={styles.footer}>
      <p>{data.footer?.text}</p>
    </footer>
  );
};

const styles = {
  footer: {
    textAlign: 'center',
    padding: '1rem',
    backgroundColor: '#f1f1f1',
    borderTop: '1px solid #ddd',
    marginTop: 'auto',
  },
};

export default Footer;