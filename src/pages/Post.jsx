// src/pages/Post.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const Post = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const { slug } = useParams();

  // Cek apakah user sudah login
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch data page dari API - menggunakan useCallback
  const fetchPageData = useCallback(async () => {
    if (!currentUser) return;
    
    setLoading(true);
    setError(null);

    try {
      // Mengambil data dari database MySQL
      const response = await axios.post('/api/get-page.php', {
        host: currentUser.host,
        dbname: currentUser.dbname,
        username: currentUser.username,
        password: currentUser.password,
        table: 'pages',
        slug: slug || 'beranda' // Gunakan slug dari URL atau default ke 'beranda'
      });

      if (response.data && response.data.success && response.data.data.length > 0) {
        const page = response.data.data[0];
        setPageData(page);
        
        // Update favicon jika ada
        if (page.favicon) {
          const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
          link.type = 'image/x-icon';
          link.rel = 'shortcut icon';
          link.href = page.favicon;
          document.getElementsByTagName('head')[0].appendChild(link);
        }

        // Update title
        if (page.title) {
          document.title = page.title;
        }
      } else {
        setError(`Halaman tidak ditemukan`);
      }
    } catch (err) {
      setError(`Error: ${err.response?.data?.error || err.message}`);
      console.error('fetchPageData error:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser, slug]);

  // Fetch data ketika user atau slug berubah
  useEffect(() => {
    if (currentUser) {
      fetchPageData();
    }
  }, [currentUser, slug, fetchPageData]);

  // Parse JSON untuk header menu
  const parseHeaderMenu = (menuJson) => {
    try {
      return JSON.parse(menuJson) || [];
    } catch (e) {
      console.error('Error parsing menu JSON:', e);
      return [];
    }
  };

  // Handle edit page
  const handleEditPage = () => {
    navigate('/edit-page/' + (pageData?.slug || 'beranda'));
  };

  // Handle navigation
  const handleNavigation = (url) => {
    // Cek apakah URL adalah internal
    if (url.startsWith('/') || url.includes(window.location.hostname)) {
      // Cek apakah URL mengarah ke halaman yang sama
      const currentSlug = slug || 'beranda';
      const targetSlug = url.replace('/', '') || 'beranda';
      
      if (currentSlug !== targetSlug) {
        navigate(url);
      }
    } else {
      // External URL, buka di tab baru
      window.open(url, '_blank');
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    navigate('/login');
  };

  // Jika belum login, jangan tampilkan konten
  if (!currentUser) {
    return null;
  }

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '48px',
            marginBottom: '20px'
          }}>
            🔄
          </div>
          <div style={{ 
            fontSize: '18px',
            color: '#666'
          }}>
            Memuat data...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ 
          padding: '20px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          <h3>❌ Error</h3>
          <p>{error}</p>
          <button
            onClick={fetchPageData}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ 
          padding: '20px',
          backgroundColor: '#fff3cd',
          color: '#856404',
          border: '1px solid #ffeaa7',
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          <h3>⚠️ Data Tidak Ditemukan</h3>
          <p>Halaman tidak ditemukan. Silakan periksa URL atau konfigurasi database.</p>
        </div>
      </div>
    );
  }

  const headerMenu = parseHeaderMenu(pageData.header_menu);

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Meta Tags dinamis */}
      {pageData.meta_description && (
        <meta name="description" content={pageData.meta_description} />
      )}
      {pageData.meta_keywords && (
        <meta name="keywords" content={pageData.meta_keywords} />
      )}
      {pageData.robots && (
        <meta name="robots" content={pageData.robots} />
      )}
      {pageData.canonical_url && (
        <link rel="canonical" href={pageData.canonical_url} />
      )}

      {/* Open Graph Meta Tags */}
      {pageData.og_title && (
        <meta property="og:title" content={pageData.og_title} />
      )}
      {pageData.og_description && (
        <meta property="og:description" content={pageData.og_description} />
      )}
      {pageData.og_image && (
        <meta property="og:image" content={pageData.og_image} />
      )}
      <meta property="og:type" content="website" />

      {/* Custom CSS dari database */}
      {pageData.css_custom && (
        <style dangerouslySetInnerHTML={{__html: pageData.css_custom}} />
      )}

      {/* Custom CSS bawaan untuk tampilan konsisten */}
      <style>
        {`
          .page-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            min-height: calc(100vh - 200px);
          }
          
          .page-title {
            color: #333;
            margin-bottom: 20px;
            border-bottom: 2px solid #007bff;
            padding-bottom: 10px;
          }
          
          .post-content {
            line-height: 1.6;
            color: #555;
            font-size: 16px;
          }
          
          .view-counter {
            margin-top: 20px;
            font-size: 14px;
            color: #888;
            text-align: right;
            border-top: 1px solid #eee;
            padding-top: 10px;
          }
          
          .last-updated {
            margin-top: 10px;
            font-size: 12px;
            color: #aaa;
            text-align: right;
          }
          
          .header {
            background-color: white;
            border-bottom: 1px solid #ddd;
            padding: 15px 20px;
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .header-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .site-title {
            font-size: 24px;
            font-weight: bold;
            color: #333;
          }
          
          .navigation {
            display: flex;
            gap: 20px;
            align-items: center;
          }
          
          .nav-link {
            text-decoration: none;
            color: #333;
            font-size: 16px;
            font-weight: 500;
            transition: color 0.2s ease;
            padding: 5px 10px;
            border-radius: 4px;
          }
          
          .nav-link:hover {
            color: #007bff;
          }
          
          .user-actions {
            display: flex;
            gap: 10px;
            align-items: center;
          }
          
          .user-actions span {
            font-size: 14px;
            color: #666;
          }
          
          .btn {
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
          }
          
          .btn-edit {
            background-color: #28a745;
            color: white;
          }
          
          .btn-logout {
            background-color: #dc3545;
            color: white;
          }
          
          .footer {
            background-color: #333;
            color: white;
            padding: 30px 20px;
            margin-top: 40px;
          }
          
          .footer-content {
            max-width: 1200px;
            margin: 0 auto;
          }
          
          .footer-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 30px;
          }
          
          .footer-title {
            color: #fff;
            margin-bottom: 15px;
            font-size: 16px;
          }
          
          .footer-links {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          
          .footer-link {
            margin-bottom: 8px;
          }
          
          .footer-link a {
            color: #ddd;
            text-decoration: none;
            font-size: 14px;
          }
          
          .footer-link a:hover {
            color: #fff;
          }
          
          .social-links {
            display: flex;
            gap: 10px;
          }
          
          .social-link {
            color: white;
            text-decoration: none;
            font-size: 24px;
          }
          
          .footer-bottom {
            border-top: 1px solid #555;
            margin-top: 30px;
            padding-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #aaa;
          }
          
          .status-badge {
            color: ${pageData.status === 'active' ? '#28a745' : '#dc3545'};
          }
        `}
      </style>

      {/* Header */}
      <header className="header">
        <div className="header-content">
          {/* Logo/Nama Situs */}
          <div className="site-title">
            {pageData.nmsite}
          </div>

          {/* Navigation Menu */}
          <nav className="navigation">
            {headerMenu.length > 0 ? (
              headerMenu
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((item, index) => (
                  <a
                    key={index}
                    href={item.url}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation(item.url);
                    }}
                    className="nav-link"
                  >
                    {item.title}
                  </a>
                ))
            ) : (
              <a href="/" onClick={(e) => {
                e.preventDefault();
                handleNavigation('/');
              }} className="nav-link">
                Home
              </a>
            )}

            {/* User Actions */}
            <div className="user-actions">
              <span>Welcome, {currentUser.username}</span>
              <button
                onClick={handleEditPage}
                className="btn btn-edit"
              >
                ✏️ Edit
              </button>
              <button
                onClick={handleLogout}
                className="btn btn-logout"
              >
                🔐 Logout
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <div className="page-container">
          {/* Page Title */}
          {pageData.title && (
            <h1 className="page-title">
              {pageData.title}
            </h1>
          )}

          {/* Post Content */}
          <div 
            className="post-content"
            dangerouslySetInnerHTML={{__html: pageData.post || '<p>Belum ada konten yang tersedia.</p>'}}
          />

          {/* View Counter */}
          <div className="view-counter">
            Dilihat: {pageData.view_count || 0} kali
          </div>

          {/* Last Updated */}
          {pageData.updated_at && (
            <div className="last-updated">
              Diperbarui: {new Date(pageData.updated_at).toLocaleString('id-ID')}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-grid">
            {/* Footer Content */}
            <div style={{ gridColumn: 'span 3' }}>
              <div 
                className="post-content"
                dangerouslySetInnerHTML={{__html: pageData.footer || '&copy; 2025 My Site. All rights reserved.'}}
              />
            </div>

            {/* Social Media Links */}
            <div>
              <h4 className="footer-title">Ikuti Kami</h4>
              <div className="social-links">
                <a href="https://facebook.com" className="social-link">📘</a>
                <a href="https://twitter.com" className="social-link">🐦</a>
                <a href="https://instagram.com" className="social-link">📸</a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="footer-title">Tautan Cepat</h4>
              {headerMenu.length > 0 ? (
                <ul className="footer-links">
                  {headerMenu
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((item, index) => (
                      <li key={index} className="footer-link">
                        <a
                          href={item.url}
                          onClick={(e) => {
                            e.preventDefault();
                            handleNavigation(item.url);
                          }}
                        >
                          {item.title}
                        </a>
                      </li>
                    ))
                  }
                </ul>
              ) : (
                <ul className="footer-links">
                  <li className="footer-link">
                    <a href="/" onClick={(e) => {
                      e.preventDefault();
                      handleNavigation('/');
                    }}>
                      Home
                    </a>
                  </li>
                </ul>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="footer-title">Kontak</h4>
              <div style={{
                fontSize: '14px',
                color: '#ddd',
                lineHeight: '1.6'
              }}>
                <div style={{ marginBottom: '8px' }}>📧 email@contoh.com</div>
                <div style={{ marginBottom: '8px' }}>📞 +62 123 4567 890</div>
                <div>📍 Jakarta, Indonesia</div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer-bottom">
            <div style={{ marginBottom: '10px' }}>
              Status: <span className="status-badge">
                {pageData.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
              </span>
            </div>
            <div>
              © {new Date().getFullYear()} {pageData.nmsite}. Template: {pageData.template || 'default'}
            </div>
          </div>
        </div>
      </footer>

      {/* Custom JavaScript dari database */}
      {pageData.js_custom && (
        <script dangerouslySetInnerHTML={{__html: pageData.js_custom}} />
      )}
    </div>
  );
};

export default Post;