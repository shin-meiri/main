import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const DynamicPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);

  useEffect(() => {
    fetch('/api/data.php')
      .then((res) => res.json())
      .then((data) => {
        const found = data.pages?.find((p) => p.slug === slug);
        setPage(found || null);
      })
      .catch(() => setPage(null));
  }, [slug]);

  if (!page) {
    return (
      <div style={styles.notFound}>
        <h2>404</h2>
        <p>Halaman <code>{slug}</code> tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1>{page.title}</h1>
      <div style={styles.content} dangerouslySetInnerHTML={{ __html: page.content }} />
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
  },
  content: {
    lineHeight: '1.8',
    fontSize: '1.1rem',
  },
  notFound: {
    textAlign: 'center',
    padding: '4rem 1rem',
    color: '#666',
  },
};

export default DynamicPage;