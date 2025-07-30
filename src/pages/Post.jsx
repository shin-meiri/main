// src/pages/Post.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Post = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

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
        slug: 'beranda' // Untuk halaman beranda
      });

      if (response.data && response.data.success) {
        const page = response.data.data[0];
        setPageData(page);
        
        // Update favicon jika ada
        if (page?.favicon) {
          const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
          link.type = 'image/x-icon';
          link.rel = 'shortcut icon';
          link.href = page.favicon;
          document.getElementsByTagName('head')[0].appendChild(link);
        }

        // Update title
        if (page?.title) {
          document.title = page.title;
        }
      } else {
        setError(`Gagal mengambil  ${response.data.error}`);
      }
    } catch (err) {
      setError(`Error: ${err.response?.data?.error || err.message}`);
      console.error('fetchPageData error:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Fetch data ketika user berubah
  useEffect(() => {
    if (currentUser) {
      fetchPageData();
    }
  }, [currentUser, fetchPageData]);

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
    navigate('/edit-page');
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
          <p>Halaman beranda tidak ditemukan. Silakan periksa konfigurasi database.</p>
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

      {/* Custom CSS */}
      {pageData.css_custom && (
        <style dangerouslySetInnerHTML={{__html: pageData.css_custom}} />
      )}

      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #ddd',
        padding: '15px 20px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo/Nama Situs */}
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#333'
          }}>
            {pageData.nmsite}
          </div>

          {/* Navigation Menu */}
          <nav style={{
            display: 'flex',
            gap: '20px',
            alignItems: 'center'
          }}>
            {headerMenu.length > 0 ? (
              headerMenu
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((item, index) => (
                  <a
                    key={index}
                    href={item.url}
                    style={{
                      textDecoration: 'none',
                      color: '#333',
                      fontSize: '16px',
                      fontWeight: '500',
                      transition: 'color 0.2s ease',
                      padding: '5px 10px',
                      borderRadius: '4px'
                    }}
                    onMouseOver={(e) => e.target.style.color = '#007bff'}
                    onMouseOut={(e) => e.target.style.color = '#333'}
                  >
                    {item.title}
                  </a>
                ))
            ) : (
              <a href="/" style={{ textDecoration: 'none', color: '#333', fontSize: '16px' }}>
                Home
              </a>
            )}

            {/* User Actions */}
            <div style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center'
            }}>
              <span style={{ 
                fontSize: '14px', 
                color: '#666' 
              }}>
                Welcome, {currentUser.username}
              </span>
              <button
                onClick={handleEditPage}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                ✏️ Edit
              </button>
              <button
                onClick={handleLogout}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                🔐 Logout
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1200px',
        margin: '20px auto',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        minHeight: 'calc(100vh - 200px)'
      }}>
        {/* Page Title */}
        {pageData.title && (
          <h1 style={{
            color: '#333',
            marginBottom: '20px',
            borderBottom: '2px solid #007bff',
            paddingBottom: '10px'
          }}>
            {pageData.title}
          </h1>
        )}

        {/* Post Content */}
        <div 
          style={{
            lineHeight: '1.6',
            color: '#555',
            fontSize: '16px'
          }}
          dangerouslySetInnerHTML={{__html: pageData.post || '<p>Belum ada konten yang tersedia.</p>'}}
        />

        {/* View Counter */}
        <div style={{
          marginTop: '20px',
          fontSize: '14px',
          color: '#888',
          textAlign: 'right',
          borderTop: '1px solid #eee',
          paddingTop: '10px'
        }}>
          Dilihat: {pageData.view_count || 0} kali
        </div>

        {/* Last Updated */}
        {pageData.updated_at && (
          <div style={{
            marginTop: '10px',
            fontSize: '12px',
            color: '#aaa',
            textAlign: 'right'
          }}>
            Diperbarui: {new Date(pageData.updated_at).toLocaleString('id-ID')}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#333',
        color: 'white',
        padding: '30px 20px',
        marginTop: '40px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '30px'
          }}>
            {/* Footer Content */}
            <div style={{
              gridColumn: 'span 3'
            }}>
              <div 
                style={{
                  lineHeight: '1.8',
                  fontSize: '14px'
                }}
                dangerouslySetInnerHTML={{__html: pageData.footer || '&copy; 2025 My Site. All rights reserved.'}}
              />
            </div>

            {/* Social Media Links */}
            <div>
              <h4 style={{
                color: '#fff',
                marginBottom: '15px',
                fontSize: '16px'
              }}>
                Ikuti Kami
              </h4>
              <div style={{
                display: 'flex',
                gap: '10px'
              }}>
                <a href="https://facebook.com" style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '24px'
                }}>
                  📘
                </a>
                <a href="https://twitter.com" style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '24px'
                }}>
                  🐦
                </a>
                <a href="https://instagram.com" style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '24px'
                }}>
                  📸
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{
                color: '#fff',
                marginBottom: '15px',
                fontSize: '16px'
              }}>
                Tautan Cepat
              </h4>
              {headerMenu.length > 0 ? (
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  {headerMenu
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((item, index) => (
                      <li key={index} style={{ marginBottom: '8px' }}>
                        <a
                          href={item.url}
                          style={{
                            color: '#ddd',
                            textDecoration: 'none',
                            fontSize: '14px'
                          }}
                          onMouseOver={(e) => e.target.style.color = '#fff'}
                          onMouseOut={(e) => e.target.style.color = '#ddd'}
                        >
                          {item.title}
                        </a>
                      </li>
                    ))
                  }
                </ul>
              ) : (
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  <li style={{ marginBottom: '8px' }}>
                    <a href="/" style={{
                      color: '#ddd',
                      textDecoration: 'none',
                      fontSize: '14px'
                    }}>
                      Home
                    </a>
                  </li>
                </ul>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <h4 style={{
                color: '#fff',
                marginBottom: '15px',
                fontSize: '16px'
              }}>
                Kontak
              </h4>
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
          <div style={{
            borderTop: '1px solid #555',
            marginTop: '30px',
            paddingTop: '20px',
            textAlign: 'center',
            fontSize: '12px',
            color: '#aaa'
          }}>
            <div style={{ marginBottom: '10px' }}>
              Status: <span style={{
                color: pageData.status === 'active' ? '#28a745' : '#dc3545'
              }}>
                {pageData.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
              </span>
            </div>
            <div>
              © {new Date().getFullYear()} {pageData.nmsite}. Template: {pageData.template || 'default'}
            </div>
          </div>
        </div>
      </footer>

      {/* Custom JavaScript */}
      {pageData.js_custom && (
        <script dangerouslySetInnerHTML={{__html: pageData.js_custom}} />
      )}
    </div>
  );
};

export default Post;