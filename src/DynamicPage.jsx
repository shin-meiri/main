// src/DynamicPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function DynamicPage() {
  const { slug } = useParams();
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
          setData({ error: json.error || "Halaman tidak ditemukan" });
        }
      } catch (err) {
        setData({ error: "Gagal memuat halaman. Cek koneksi." });
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug]);

  if (loading) return <Loading />;
  if (data?.error) return <Error message={data.error} />;

  const { page, menu, settings } = data;

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.siteName}>{settings?.site_name || "Website Saya"}</div>
        <div style={styles.navLinks}>
          {menu.map(item => (
            <a
              key={item.slug}
              href={`/#/page/${item.slug}`}
              style={styles.navLink}
            >
              {item.label}
            </a>
          ))}
          <a href="/admin" style={styles.adminLink}>⚙️ Admin</a>
        </div>
      </nav>

      {/* Hero */}
      <header style={styles.hero}>
        <h1>{page.title}</h1>
      </header>

      {/* Konten */}
      <main style={styles.main}>
        <div
          style={styles.content}
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        {settings?.footer_text || "© 2025"}
      </footer>
    </div>
  );
}

// === Komponen Pendukung ===
function Loading() {
  return (
    <div style={styles.loading}>
      <div style={styles.spinner}></div>
      <p>Memuat konten...</p>
    </div>
  );
}

function Error({ message }) {
  return (
    <div style={styles.error}>
      <h2>⚠️ Terjadi Kesalahan</h2>
      <p>{message}</p>
      <button onClick={() => window.location.reload()} style={styles.retry}>
        Coba Lagi
      </button>
    </div>
  );
}

// === STYLES ===
const styles = {
  container: {
    fontFamily: "'Segoe UI', Arial, sans-serif",
    backgroundColor: "#f9fafa",
    color: "#2c3e50",
    minHeight: "100vh",
    margin: 0,
    padding: 0,
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 5%",
    backgroundColor: "#007BFF",
    color: "white",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  siteName: {
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
    fontWeight: "600",
  },
  adminLink: {
    marginLeft: "2rem",
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
  },
  hero: {
    textAlign: "center",
    padding: "4rem 2rem",
    backgroundColor: "linear-gradient(135deg, #007BFF, #0056b3)",
    color: "white",
  },
  main: {
    padding: "3rem 5%",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  content: {
    lineHeight: "1.8",
    fontSize: "1.1rem",
    color: "#34495e",
  },
  footer: {
    marginTop: "auto",
    textAlign: "center",
    padding: "2rem",
    backgroundColor: "#2c3e50",
    color: "white",
    fontSize: "0.9rem",
  },
  loading: {
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
  error: {
    padding: "3rem",
    textAlign: "center",
    color: "#e74c3c",
  },
  retry: {
    marginTop: "1rem",
    padding: "0.7rem 1.5rem",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

// Animasi
const style = document.createElement("style");
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);