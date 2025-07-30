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

  // Cek login
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch data
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
        
        try {
          const menu = JSON.parse(data.header_menu);
          setMenuItems(Array.isArray(menu) ? menu : []);
        } catch (e) {
          setMenuItems([]);
        }
      } else {
        setError('Gagal mengambil data');
      }
    } catch (err) {
      setError('Error: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  }, [currentUser, slug]);

  // Load data
  useEffect(() => {
    if (currentUser) {
      fetchPageData();
    }
  }, [currentUser, slug, fetchPageData]);

  // Handle input
  const handleInputChange = (field, value) => {
    setPageData(prev => ({ ...prev, [field]: value }));
  };

  // Menu items
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

  // Save page
  const savePage = async () => {
    if (!pageData.title || !pageData.nmsite || !pageData.slug) {
      setError('Semua field wajib diisi!');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
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
        setSuccess('Data berhasil disimpan!');
        setTimeout(() => {
          navigate('/post/' + pageData.slug);
        }, 1500);
      } else {
        setError('Gagal menyimpan: ' + response.data.error);
      }
    } catch (err) {
      setError('Error menyimpan: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Cancel
  const cancelEditing = () => {
    navigate('/post/' + (pageData.slug || 'beranda'));
  };

  // Delete
  const deletePage = async () => {
    if (!pageData.id) return;

    if (window.confirm('Yakin ingin menghapus?')) {
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
          setSuccess('Halaman berhasil dihapus!');
          setTimeout(() => {
            navigate('/post');
          }, 1500);
        } else {
          setError('Gagal menghapus: ' + response.data.error);
        }
      } catch (err) {
        setError('Error menghapus: ' + (err.response?.data?.error || err.message));
      } finally {
        setLoading(false);
      }
    }
  };

  // Preview
  const previewPage = () => {
    const win = window.open('', '_blank');
    if (win) {
      const html = '<!DOCTYPE html><html><head><title>Preview</title>' +
        '<style>body{font-family:Arial,sans-serif;margin:20px;background:#f5f5f5}' +
        '.container{max-width:800px;margin:0 auto;background:white;padding:30px;border-radius:8px}' +
        '</style></head><body><div class="container"><h1>' + 
        pageData.title + '</h1><div>' + pageData.post + '</div></div></body></html>';
      win.document.write(html);
      win.document.close();
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    navigate('/login');
  };

  // Loading
  if (!currentUser) return null;

  if (loading && !pageData.title) {
    return (
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div>Muat data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ color: 'red' }}>{error}</div>
        <button onClick={fetchPageData}>Coba Lagi</button>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div style={{ padding: '20px' }}>
        <div>Data tidak ditemukan</div>
      </div>
    );
  }

  const tabs = [
    { id: 'basic', label: 'Dasar' },
    { id: 'content', label: 'Konten' },
    { id: 'seo', label: 'SEO' },
    { id: 'advanced', label: 'Lanjutan' }
  ];

  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ 
        padding: '20px', 
        borderBottom: '1px solid #ddd',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <h1>Edit Halaman: {pageData.title}</h1>
        <div>
          <span>Welcome, {currentUser.username}</span>
          <button onClick={handleLogout}>Logout</button>
          <button onClick={cancelEditing}>Kembali</button>
        </div>
      </div>

      {/* Messages */}
      {error && <div style={{ color: 'red', margin: '15px 20px' }}>{error}</div>}
      {success && <div style={{ color: 'green', margin: '15px 20px' }}>{success}</div>}

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid #ddd', display: 'flex' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '15px 20px',
              border: 'none',
              backgroundColor: activeTab === tab.id ? 'white' : 'transparent',
              borderBottom: activeTab === tab.id ? '3px solid #007bff' : 'none'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        {/* Basic Tab */}
        {activeTab === 'basic' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label>Judul *</label>
                <input
                  type="text"
                  value={pageData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  style={{ width: '100%', padding: '10px' }}
                />
              </div>
              <div>
                <label>Nama Situs *</label>
                <input
                  type="text"
                  value={pageData.nmsite}
                  onChange={(e) => handleInputChange('nmsite', e.target.value)}
                  style={{ width: '100%', padding: '10px' }}
                />
              </div>
              <div>
                <label>Favicon URL</label>
                <input
                  type="url"
                  value={pageData.favicon}
                  onChange={(e) => handleInputChange('favicon', e.target.value)}
                  style={{ width: '100%', padding: '10px' }}
                />
              </div>
              <div>
                <label>Slug URL *</label>
                <input
                  type="text"
                  value={pageData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  style={{ width: '100%', padding: '10px' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label>Status</label>
                <select
                  value={pageData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  style={{ width: '100%', padding: '10px' }}
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Tidak Aktif</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div>
                <label>Template</label>
                <select
                  value={pageData.template}
                  onChange={(e) => handleInputChange('template', e.target.value)}
                  style={{ width: '100%', padding: '10px' }}
                >
                  <option value="default">Default</option>
                  <option value="blog">Blog</option>
                </select>
              </div>
              <div>
                <label>Canonical URL</label>
                <input
                  type="url"
                  value={pageData.canonical_url}
                  onChange={(e) => handleInputChange('canonical_url', e.target.value)}
                  style={{ width: '100%', padding: '10px' }}
                />
              </div>
              <div>
                <label>Robots Meta</label>
                <select
                  value={pageData.robots}
                  onChange={(e) => handleInputChange('robots', e.target.value)}
                  style={{ width: '100%', padding: '10px' }}
                >
                  <option value="index, follow">index, follow</option>
                  <option value="noindex, follow">noindex, follow</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label>Konten Utama</label>
              <textarea
                value={pageData.post}
                onChange={(e) => handleInputChange('post', e.target.value)}
                style={{ width: '100%', padding: '10px', minHeight: '300px' }}
              />
            </div>
            <div>
              <label>Footer</label>
              <textarea
                value={pageData.footer}
                onChange={(e) => handleInputChange('footer', e.target.value)}
                style={{ width: '100%', padding: '10px', minHeight: '300px' }}
              />
            </div>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === 'seo' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label>Meta Description</label>
                <textarea
                  value={pageData.meta_description}
                  onChange={(e) => handleInputChange('meta_description', e.target.value)}
                  style={{ width: '100%', padding: '10px', minHeight: '100px' }}
                />
              </div>
              <div>
                <label>Meta Keywords</label>
                <input
                  type="text"
                  value={pageData.meta_keywords}
                  onChange={(e) => handleInputChange('meta_keywords', e.target.value)}
                  style={{ width: '100%', padding: '10px' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label>OG Title</label>
                <input
                  type="text"
                  value={pageData.og_title}
                  onChange={(e) => handleInputChange('og_title', e.target.value)}
                  style={{ width: '100%', padding: '10px' }}
                />
              </div>
              <div>
                <label>OG Description</label>
                <textarea
                  value={pageData.og_description}
                  onChange={(e) => handleInputChange('og_description', e.target.value)}
                  style={{ width: '100%', padding: '10px', minHeight: '100px' }}
                />
              </div>
              <div>
                <label>OG Image URL</label>
                <input
                  type="url"
                  value={pageData.og_image}
                  onChange={(e) => handleInputChange('og_image', e.target.value)}
                  style={{ width: '100%', padding: '10px' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Advanced Tab */}
        {activeTab === 'advanced' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Menu Items */}
            <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <h3>Menu Header</h3>
                <button onClick={addMenuItem}>Tambah Item</button>
              </div>
              {menuItems.length === 0 ? (
                <div>Belum ada menu item</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {menuItems.map((item, index) => (
                    <div key={index} style={{ border: '1px solid #eee', borderRadius: '4px', padding: '10px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px', marginBottom: '10px' }}>
                        <div>
                          <label>Judul</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updateMenuItem(index, 'title', e.target.value)}
                            style={{ width: '100%', padding: '5px' }}
                          />
                        </div>
                        <div>
                          <label>URL</label>
                          <input
                            type="text"
                            value={item.url}
                            onChange={(e) => updateMenuItem(index, 'url', e.target.value)}
                            style={{ width: '100%', padding: '5px' }}
                          />
                        </div>
                        <div>
                          <label>Urutan</label>
                          <input
                            type="number"
                            value={item.order}
                            onChange={(e) => updateMenuItem(index, 'order', parseInt(e.target.value) || 0)}
                            style={{ width: '100%', padding: '5px' }}
                            min="1"
                          />
                        </div>
                      </div>
                      <button onClick={() => removeMenuItem(index)} style={{ width: '100%' }}>
                        Hapus
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Custom Code */}
            <div>
              <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '15px', marginBottom: '20px' }}>
                <h3>Custom CSS</h3>
                <textarea
                  value={pageData.css_custom}
                  onChange={(e) => handleInputChange('css_custom', e.target.value)}
                  style={{ width: '100%', padding: '10px', minHeight: '200px', backgroundColor: '#f8f9fa' }}
                />
              </div>
              <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '15px' }}>
                <h3>Custom JavaScript</h3>
                <textarea
                  value={pageData.js_custom}
                  onChange={(e) => handleInputChange('js_custom', e.target.value)}
                  style={{ width: '100%', padding: '10px', minHeight: '200px', backgroundColor: '#f8f9fa' }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div style={{ padding: '20px', borderTop: '1px solid #ddd', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <button onClick={previewPage}>Preview</button>
          {pageData.id && <button onClick={deletePage} disabled={loading}>Hapus</button>}
        </div>
        <div>
          <button onClick={cancelEditing}>Batal</button>
          <button onClick={savePage} disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPage;