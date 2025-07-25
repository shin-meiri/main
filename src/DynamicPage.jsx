// src/DynamicPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function DynamicPage() {
  const { slug } = useParams(); // /page/:slug
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await fetch(`https://bos.free.nf/api/getPage.php?page=${slug}`);
        const json = await res.json();
        if (json.success) {
          setData(json);
        } else {
          setData({ error: json.error });
        }
      } catch (err) {
        setData({ error: "Gagal memuat data" });
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  if (loading) return <div style={styles.loading}>Memuat...</div>;
  if (!data) return <div style={styles.error}>Data kosong.</div>;
  if (data.error) return <div style={styles.error}>{data.error}</div>;

  const { page, menu, settings } = data;

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1>{settings.site_name}</h1>
        <p>{settings.site_description}</p>

        {/* Menu Dinamis */}
        <nav style={styles.nav}>
          {menu.map(item => (
            <a
              key={item.slug}
              href={`/#/page/${item.slug}`}
              style={styles.navLink}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      {/* Konten Halaman */}
      <main style={styles.main}>
        <h2>{page.title}</h2>
        <div
          style={styles.content}
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        {settings.footer_text}
      </footer>
    </div>
  );
}

const styles = {
  container: { padding: '20px', fontFamily: 'Arial, sans-serif' },
  header: { marginBottom: '30px', borderBottom: '2px solid #007bff', paddingBottom: '10px' },
  nav: { marginTop: '10px' },
  navLink: { margin: '0 15px', textDecoration: 'none', color: '#007bff', fontSize: '18px' },
  main: { maxWidth: '800px', margin: '0 auto' },
  content: { lineHeight: '1.6', fontSize: '16px' },
  footer: { marginTop: '50px', textAlign: 'center', color: '#666', fontSize: '14px' },
  loading: { textAlign: 'center', fontSize: '20px', margin: '50px 0' },
  error: { color: 'red', textAlign: 'center', margin: '30px' }
};