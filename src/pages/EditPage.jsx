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
  const navigate = useNavigate();
  const { id } = useParams();

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
        slug: id || 'beranda'
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
  }, [currentUser, id]);

  // Fetch data ketika user berubah
  useEffect(() => {
    if (currentUser) {
      fetchPageData();
    }
  }, [currentUser, fetchPageData]);

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

      // Siapkan data untuk dikirim
      const pageDataToSend = {
        ...pageData,
        header_menu: menuJson,
        updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updated_by: currentUser.username
      };

      console.log('Sending data:', {
        host: currentUser.host,
        dbname: currentUser.dbname,
        username: currentUser.username,
        password: currentUser.password,
        table: 'pages',
        id: pageData.id || 1, // Gunakan ID dari data atau default ke 1
        data: pageDataToSend
      });

      const response = await axios.post('/api/update-page.php', {
        host: currentUser.host,
        dbname: currentUser.dbname,
        username: currentUser.username,
        password: currentUser.password,
        table: 'pages',
        id: pageData.id || 1, // Pastikan ID dikirim
        data: pageDataToSend
      });

      console.log('Response:', response.data);

      if (response.data.success) {
        setSuccess('✅ Data berhasil disimpan!');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setError(`❌ Gagal menyimpan: ${response.data.error}`);
      }
    } catch (err) {
      console.error('Save error:', err);
      setError(`❌ Error menyimpan: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    navigate('/');
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
          <h1 style={{ margin: 0, color: '#333' }}>
            🛠️ Edit Halaman
          </h1>
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

        {/* Main Form */}
        <div style={{
          padding: '20px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px'
        }}>
          {/* Left Column - Basic Info */}
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
                Slug URL
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

          {/* Right Column - Advanced Settings */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
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

            {/* SEO Settings */}
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
                🔍 SEO Settings
              </h3>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  marginBottom: '3px',
                  color: '#666'
                }}>
                  Meta Description
                </label>
                <textarea
                  value={pageData.meta_description}
                  onChange={(e) => handleInputChange('meta_description', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '12px',
                    minHeight: '60px'
                  }}
                  placeholder="Deskripsi singkat tentang halaman ini"
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  marginBottom: '3px',
                  color: '#666'
                }}>
                  Meta Keywords
                </label>
                <input
                  type="text"
                  value={pageData.meta_keywords}
                  onChange={(e) => handleInputChange('meta_keywords', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  marginBottom: '3px',
                  color: '#666'
                }}>
                  Open Graph Title
                </label>
                <input
                  type="text"
                  value={pageData.og_title}
                  onChange={(e) => handleInputChange('og_title', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                  placeholder="Judul untuk social media"
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  marginBottom: '3px',
                  color: '#666'
                }}>
                  Open Graph Description
                </label>
                <textarea
                  value={pageData.og_description}
                  onChange={(e) => handleInputChange('og_description', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '12px',
                    minHeight: '60px'
                  }}
                  placeholder="Deskripsi untuk social media"
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  marginBottom: '3px',
                  color: '#666'
                }}>
                  Open Graph Image URL
                </label>
                <input
                  type="url"
                  value={pageData.og_image}
                  onChange={(e) => handleInputChange('og_image', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                  placeholder="https://example.com/og-image.jpg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Editor */}
        <div style={{
          padding: '20px',
          borderTop: '1px solid #ddd'
        }}>
          <h3 style={{
            margin: '0 0 10px 0',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#333'
          }}>
            📝 Konten Halaman
          </h3>
          
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
                  minHeight: '200px',
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
                  minHeight: '200px',
                  fontFamily: 'monospace'
                }}
                placeholder="Masukkan konten footer dalam format HTML"
              />
            </div>
          </div>
        </div>

        {/* Custom Code */}
        <div style={{
          padding: '20px',
          borderTop: '1px solid #ddd'
        }}>
          <h3 style={{
            margin: '0 0 10px 0',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#333'
          }}>
            💻 Custom Code
          </h3>
          
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
                Custom CSS
              </label>
              <textarea
                value={pageData.css_custom}
                onChange={(e) => handleInputChange('css_custom', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  minHeight: '150px',
                  fontFamily: 'monospace',
                  backgroundColor: '#f8f9fa'
                }}
                placeholder="/* Custom CSS */\nbody {\n  background-color: #f5f5f5;\n}"
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
                Custom JavaScript
              </label>
              <textarea
                value={pageData.js_custom}
                onChange={(e) => handleInputChange('js_custom', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  minHeight: '150px',
                  fontFamily: 'monospace',
                  backgroundColor: '#f8f9fa'
                }}
                placeholder="// Custom JavaScript\nconsole.log('Hello World');"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div style={{
          padding: '20px',
          borderTop: '1px solid #ddd',
          textAlign: 'right'
        }}>
          <button
            onClick={cancelEditing}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              marginRight: '10px',
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
  );
};

export default EditPage;
