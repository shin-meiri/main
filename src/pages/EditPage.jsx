// src/pages/EditPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditPage = () => {
  const [pageData, setPageData] = useState({
    title: '',
    favicon: '',
    nmsite: '',
    header_menu: '[{"title": "Home", "url": "/", "order": 1}]',
    post: '',
    footer: '',
    meta_description: '',
    meta_keywords: '',
    og_image: '',
    og_title: '',
    og_description: '',
    robots: 'index, follow',
    status: 'active',
    template: 'default',
    slug: '',
    canonical_url: '',
    css_custom: '',
    js_custom: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [activeTab, setActiveTab] = useState('basic');
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
      const response = await axios.post('/api/get-page.php', {
        host: currentUser.host,
        dbname: currentUser.dbname,
        username: currentUser.username,
        password: currentUser.password,
        table: 'pages',
        slug: slug || 'beranda'
      });

      if (response.data && response.data.success && response.data.data.length > 0) {
        const data = response.data.data[0];
        setPageData(data);
        
        // Parse menu items
        try {
          const menu = JSON.parse(data.header_menu);
          setMenuItems(Array.isArray(menu) ? menu : []);
        } catch (e) {
          setMenuItems([]);
        }
      } else {
        setError(`Gagal mengambil  ${response.data.error}`);
      }
    } catch (err) {
      setError(`Error: ${err.response?.data?.error || err.message}`);
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

  // Handle input change
  const handleInputChange = (field, value) => {
    setPageData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle menu items
  const addMenuItem = () => {
    setMenuItems(prev => [
      ...prev,
      { title: '', url: '/', order: prev.length + 1 }
    ]);
  };

  const updateMenuItem = (index, field, value) => {
    setMenuItems(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const removeMenuItem = (index) => {
    setMenuItems(prev => prev.filter((_, i) => i !== index));
  };

  // Save edited page
  const savePage = async () => {
    if (!pageData.title || !pageData.nmsite) {
      setError('Judul dan nama situs wajib diisi!');
      return;
    }

    if (!pageData.slug) {
      setError('Slug URL wajib diisi!');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validasi format JSON untuk menu
      let menuJson = '[]';
      try {
        menuJson = JSON.stringify(menuItems);
      } catch (e) {
        setError('Format menu tidak valid!');
        setLoading(false);
        return;
      }

      const response = await axios.post('/api/update-page.php', {
        host: currentUser.host,
        dbname: currentUser.dbname,
        username: currentUser.username,
        password: currentUser.password,
        table: 'pages',
        id: pageData.id,
         {
          ...pageData,
          header_menu: menuJson,
          updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
          updated_by: currentUser.username
        }
      });

      if (response.data.success) {
        setSuccess('✅ Data berhasil disimpan!');
        setTimeout(() => {
          navigate('/post/' + pageData.slug);
        }, 1500);
      } else {
        setError(`❌ Gagal menyimpan: ${response.data.error}`);
      }
    } catch (err) {
      setError(`❌ Error menyimpan: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    navigate('/post/' + (pageData.slug || 'beranda'));
  };

  // Delete page
  const deletePage = async () => {
    if (!pageData.id) return;

    if (window.confirm('Apakah Anda yakin ingin menghapus halaman ini?')) {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.post('/api/delete-page.php', {
          host: currentUser.host,
          dbname: currentUser.dbname,
          username: currentUser.username,
          password: currentUser.password,
          table: 'pages',
          id: pageData.id
        });

        if (response.data.success) {
          setSuccess('✅ Halaman berhasil dihapus!');
          setTimeout(() => {
            navigate('/post');
          }, 1500);
        } else {
          setError(`❌ Gagal menghapus: ${response.data.error}`);
        }
      } catch (err) {
        setError(`❌ Error menghapus: ${err.response?.data?.error || err.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  // Preview page
  const previewPage = () => {
    const previewWindow = window.open('', '_blank');
    previewWindow.document.write(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Preview: ${pageData.title}</title>
        ${pageData.css_custom ? `<style>${pageData.css_custom}</style>` : ''}
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          header { background: white; padding: 20px; border-bottom: 1px solid #ddd; margin-bottom: 30px; }
          .site-title { font-size: 24px; font-weight: bold; color: #333; }
          nav { display: flex; gap: 20px; margin-top: 10px; }
          nav a { text-decoration: none; color: #333; }
          main { line-height: 1.6; color: #555; }
          footer { background: #333; color: white; padding: 30px; margin-top: 40px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <div class="site-title">${pageData.nmsite}</div>
            <nav>
              ${menuItems.map(item => `<a href="${item.url}">${item.title}</a>`).join('')}
            </nav>
          </header>
          <main>
            <h1>${pageData.title}</h1>
            <div>${pageData.post}</div>
          </main>
          <footer>
            <div>${pageData.footer}</div>
          </footer>
        </div>
        ${pageData.js_custom ? `<script>${pageData.js_custom}</script>` : ''}
      </body>
      </html>
    `);
    previewWindow.document.close();
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

  if (loading && !pageData.title) {
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

  // Tabs for different sections
  const tabs = [
    { id: 'basic', label: 'Dasar', icon: '📝' },
    { id: 'content', label: 'Konten', icon: '📄' },
    { id: 'seo', label: 'SEO', icon: '🔍' },
    { id: 'advanced', label: 'Lanjutan', icon: '⚙️' }
  ];

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #ddd',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ margin: 0, color: '#333' }}>
              🛠️ Edit Halaman: {pageData.title || 'Baru'}
            </h1>
            <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
              Slug: <strong>{pageData.slug || 'belum diatur'}</strong>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ 
              fontSize: '14px', 
              color: '#666' 
            }}>
              Welcome, {currentUser.username}
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '6px 12px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              🔐 Logout
            </button>
            <button
              onClick={cancelEditing}
              style={{
                padding: '6px 12px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ← Kembali
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div style={{
            margin: '15px 20px',
            padding: '15px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            margin: '15px 20px',
            padding: '15px',
            backgroundColor: '#d4edda',
            color: '#155724',
            border: '1px solid #c3e6cb',
            borderRadius: '4px'
          }}>
            {success}
          </div>
        )}

        {/* Tabs Navigation */}
        <div style={{
          borderBottom: '1px solid #ddd',
          display: 'flex',
          backgroundColor: '#f8f9fa'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '15px 20px',
                border: 'none',
                backgroundColor: activeTab === tab.id ? 'white' : 'transparent',
                borderBottom: activeTab === tab.id ? '3px solid #007bff' : 'none',
                color: activeTab === tab.id ? '#007bff' : '#666',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ padding: '20px' }}>
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    marginBottom: '5px',
                    color: '#333'
                  }}>
                    Judul Halaman *
                  </label>
                  <input
                    type="text"
                    value={pageData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    placeholder="Masukkan judul halaman"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    marginBottom: '5px',
                    color: '#333'
                  }}>
                    Nama Situs *
                  </label>
                  <input
                    type="text"
                    value={pageData.nmsite}
                    onChange={(e) => handleInputChange('nmsite', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    placeholder="Masukkan nama situs"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    marginBottom: '5px',
                    color: '#333'
                  }}>
                    Favicon URL
                  </label>
                  <input
                    type="url"
                    value={pageData.favicon}
                    onChange={(e) => handleInputChange('favicon', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    marginBottom: '5px',
                    color: '#333'
                  }}>
                    Slug URL *
                  </label>
                  <input
                    type="text"
                    value={pageData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    placeholder="contoh: beranda, tentang-kami"
                  />
                </div>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    marginBottom: '5px',
                    color: '#333'
                  }}>
                    Status
                  </label>
                  <select
                    value={pageData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Tidak Aktif</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    marginBottom: '5px',
                    color: '#333'
                  }}>
                    Template
                  </label>
                  <select
                    value={pageData.template}
                    onChange={(e) => handleInputChange('template', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="default">Default</option>
                    <option value="blog">Blog</option>
                    <option value="landing-page">Landing Page</option>
                    <option value="e-commerce">E-commerce</option>
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    marginBottom: '5px',
                    color: '#333'
                  }}>
                    Canonical URL
                  </label>
                  <input
                    type="url"
                    value={pageData.canonical_url}
                    onChange={(e) => handleInputChange('canonical_url', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    placeholder="https://example.com/page"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    marginBottom: '5px',
                    color: '#333'
                  }}>
                    Robots Meta
                  </label>
                  <select
                    value={pageData.robots}
                    onChange={(e) => handleInputChange('robots', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="index, follow">index, follow</option>
                    <option value="noindex, follow">noindex, follow</option>
                    <option value="index, nofollow">index, nofollow</option>
                    <option value="noindex, nofollow">noindex, nofollow</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  marginBottom: '5px',
                  color: '#333'
                }}>
                  Konten Utama (Post)
                </label>
                <textarea
                  value={pageData.post}
                  onChange={(e) => handleInputChange('post', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    minHeight: '300px',
                    fontFamily: 'monospace'
                  }}
                  placeholder="Masukkan konten halaman dalam format HTML"
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  marginBottom: '5px',
                  color: '#333'
                }}>
                  Footer
                </label>
                <textarea
                  value={pageData.footer}
                  onChange={(e) => handleInputChange('footer', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    minHeight: '300px',
                    fontFamily: 'monospace'
                  }}
                  placeholder="Masukkan konten footer dalam format HTML"
                />
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    marginBottom: '5px',
                    color: '#333'
                  }}>
                    Meta Description
                  </label>
                  <textarea
                    value={pageData.meta_description}
                    onChange={(e) => handleInputChange('meta_description', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      minHeight: '100px'
                    }}
                    placeholder="Deskripsi singkat tentang halaman ini"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    marginBottom: '5px',
                    color: '#333'
                  }}>
                    Meta Keywords
                  </label>
                  <input
                    type="text"
                    value={pageData.meta_keywords}
                    onChange={(e) => handleInputChange('meta_keywords', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    marginBottom: '5px',
                    color: '#333'
                  }}>
                    Open Graph Title
                  </label>
                  <input
                    type="text"
                    value={pageData.og_title}
                    onChange={(e) => handleInputChange('og_title', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    placeholder="Judul untuk social media"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    marginBottom: '5px',
                    color: '#333'
                  }}>
                    Open Graph Description
                  </label>
                  <textarea
                    value={pageData.og_description}
                    onChange={(e) => handleInputChange('og_description', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      minHeight: '100px'
                    }}
                    placeholder="Deskripsi untuk social media"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    marginBottom: '5px',
                    color: '#333'
                  }}>
                    Open Graph Image URL
                  </label>
                  <input
                    type="url"
                    value={pageData.og_image}
                    onChange={(e) => handleInputChange('og_image', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    placeholder="https://example.com/og-image.jpg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Advanced Tab */}
          {activeTab === 'advanced' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px'
            }}>
              {/* Menu Items */}
              <div style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '15px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px'
                }}>
                  <h3 style={{
                    margin: 0,
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#333'
                  }}>
                    🍽️ Menu Header
                  </h3>
                  <button
                    onClick={addMenuItem}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    ➕ Tambah Item
                  </button>
                </div>

                {menuItems.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '20px',
                    color: '#666',
                    fontSize: '14px'
                  }}>
                    Belum ada menu item. Klik "Tambah Item" untuk menambahkan.
                  </div>
                ) : (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    {menuItems.map((item, index) => (
                      <div key={index} style={{
                        border: '1px solid #eee',
                        borderRadius: '4px',
                        padding: '10px',
                        backgroundColor: '#f8f9fa'
                      }}>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr auto',
                          gap: '10px',
                          marginBottom: '10px'
                        }}>
                          <div>
                            <label style={{
                              display: 'block',
                              fontSize: '12px',
                              marginBottom: '3px',
                              color: '#666'
                            }}>
                              Judul
                            </label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => updateMenuItem(index, 'title', e.target.value)}
                              style={{
                                width: '100%',
                                padding: '5px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '12px'
                              }}
                              placeholder="Home"
                            />
                          </div>
                          <div>
                            <label style={{
                              display: 'block',
                              fontSize: '12px',
                              marginBottom: '3px',
                              color: '#666'
                            }}>
                              URL
                            </label>
                            <input
                              type="text"
                              value={item.url}
                              onChange={(e) => updateMenuItem(index, 'url', e.target.value)}
                              style={{
                                width: '100%',
                                padding: '5px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '12px'
                              }}
                              placeholder="/"
                            />
                          </div>
                          <div>
                            <label style={{
                              display: 'block',
                              fontSize: '12px',
                              marginBottom: '3px',
                              color: '#666'
                            }}>
                              Urutan
                            </label>
                            <input
                              type="number"
                              value={item.order}
                              onChange={(e) => updateMenuItem(index, 'order', parseInt(e.target.value) || 0)}
                              style={{
                                width: '100%',
                                padding: '5px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '12px'
                              }}
                              min="1"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => removeMenuItem(index)}
                          style={{
                            width: '100%',
                            padding: '5px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          ❌ Hapus
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom Code */}
              <div>
                <div style={{
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  padding: '15px',
                  marginBottom: '20px'
                }}>
                  <h3 style={{
                    margin: '0 0 10px 0',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#333'
                  }}>
                    💻 Custom CSS
                  </h3>
                  <textarea
                    value={pageData.css_custom}
                    onChange={(e) => handleInputChange('css_custom', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      minHeight: '200px',
                      fontFamily: 'monospace',
                      backgroundColor: '#f8f9fa'
                    }}
                    placeholder="/* Custom CSS */\nbody {\n  background-color: #f5f5f5;\n}"
                  />
                </div>

                <div style={{
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  padding: '15px'
                }}>
                  <h3 style={{
                    margin: '0 0 10px 0',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#333'
                  }}>
                    💻 Custom JavaScript
                  </h3>
                  <textarea
                    value={pageData.js_custom}
                    onChange={(e) => handleInputChange('js_custom', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      minHeight: '200px',
                      fontFamily: 'monospace',
                      backgroundColor: '#f8f9fa'
                    }}
                    placeholder="// Custom JavaScript\nconsole.log('Hello World');"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{
          padding: '20px',
          borderTop: '1px solid #ddd',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={previewPage}
              style={{
                padding: '10px 20px',
                backgroundColor: '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              👁️ Preview
            </button>
            
            {pageData.id && (
              <button
                onClick={deletePage}
                disabled={loading}
                style={{
                  padding: '10px 20px',
                  backgroundColor: loading ? '#6c757d' : '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? '🔄 Menghapus...' : '🗑️ Hapus'}
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={cancelEditing}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Batal
            </button>
            <button
              onClick={savePage}
              disabled={loading}
              style={{
                padding: '10px 20px',
                backgroundColor: loading ? '#6c757d' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? '🔄 Menyimpan...' : '💾 Simpan Perubahan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPage;
