import React, { useState, useEffect } from 'react';

const Home = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch('/api/data.php')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={styles.container}>
      <h1>{data.home?.title || 'Loading...'}</h1>
      <p>{data.home?.content || 'Memuat konten...'}</p>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    textAlign: 'center',
  },
};

export default Home;