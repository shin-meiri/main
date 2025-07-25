// src/DynamicPage.js
import React, { useState, useEffect } from 'react'; // Pastikan useEffect di-import
import { useParams } from 'react-router-dom';

export default function DynamicPage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ useEffect ditaruh DI DALAM komponen
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      // Cleanup style
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Ambil data dari API
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
        setData({ error: "Gagal memuat halaman." });
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  if (loading) return <Loading />;
  if (data?.error) return <ErrorPage message={data.error} />;

  const { page, menu, settings } = data;

  return (
    <div style={styles.container}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet" />

      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>{settings?.site_name || "My Site"}</div>
        <div style={styles.navLinks}>
          {menu.map((item) => (
            <a
              key={item.slug}
              href={`/#/page/${item.slug}`}
              style={styles.navLink}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <header style={styles.hero}>
        <h1 style={styles.heroTitle}>{page.title}</h1>
        <p style={styles.heroSubtitle}>
          {settings?.site_description || "Website dinamis dengan React & database"}
        </p>
      </header>

      {/* Konten */}
      <main style={styles.main}>
        <article style={styles.article}>
          <div
            style={styles.content}
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </article>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        &copy; {new Date().getFullYear()} {settings?.footer_text || "All rights reserved."}
      </footer>
    </div>
  );
}

// === Komponen Pendukung (Loading & Error) ===
function Loading() {
  return (
    <div style={styles.loadingContainer}>
      <div style={styles.spinner}></div>
      <p style={styles.loadingText}>Memuat konten...</p>
    </div>
  );
}

function ErrorPage({ message }) {
  return (
    <div style={styles.errorContainer}>
      <h2 style={styles.errorTitle}>⚠️ Terjadi Kesalahan</h2>
      <p>{message}</p>
      <button onClick={() => window.location.reload()} style={styles.retryButton}>
        Coba Lagi
      </button>
    </div>
  );
}

// === STYLES ===
const styles = {
  // ... (sama seperti sebelumnya, gak usah diubah)
  // Biarkan styles tetap di bawah
  container: {
    fontFamily: "'Nunito', sans-serif",
    backgroundColor: "#f9fafa",
    color: "#2c3e50",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#007BFF",
    padding: "1rem 5%",
    color: "white",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  navLinks: {
    display: "flex",
    gap: "1.5rem",
  },
  navLink: {
    color: "white",
    textDecoration: "none",
    fontSize: "1.1rem",
    fontWeight: "600",
  },
  hero: {
    textAlign: "center",
    padding: "4rem 2rem",
    backgroundColor: "linear-gradient(135deg, #007BFF, #0056b3)",
    color: "white",
  },
  heroTitle: {
    fontSize: "2.8rem",
    margin: "0 0 1rem 0",
  },
  heroSubtitle: {
    fontSize: "1.2rem",
    opacity: 0.9,
  },
  main: {
    flex: 1,
    padding: "2rem 5%",
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
  },
  article: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "2rem",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  content: {
    lineHeight: "1.8",
    fontSize: "1.1rem",
    color: "#34495e",
  },
  footer: {
    marginTop: "auto",
    textAlign: "center",
    padding: "1.5rem",
    backgroundColor: "#2c3e50",
    color: "white",
    fontSize: "0.9rem",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
  spinner: {
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #007BFF",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "1rem",
    fontSize: "1.1rem",
    color: "#555",
  },
  errorContainer: {
    padding: "3rem",
    textAlign: "center",
    color: "#e74c3c",
  },
  errorTitle: {
    color: "#c0392b",
  },
  retryButton: {
    marginTop: "1rem",
    padding: "0.7rem 1.5rem",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
