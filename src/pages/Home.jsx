import React, { useState, useEffect } from 'react';

const Home = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch('/api/data.php')
      .then(res => res.json())
      .then(json => setData(json));
  }, []);

  return (
    <div style={styles.container}>
      <h1>{data.home?.title}</h1>
      <p>{data.home?.content}</p>
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