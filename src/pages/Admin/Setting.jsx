import React, { useState, useEffect } from 'react';

const Settings = () => {
  const [formData, setFormData] = useState({
    logo: '',
    homeTitle: '',
    homeContent: '',
    footerText: '',
    loginUsername: '',
    loginPassword: '',
  });

  const [menuLinks, setMenuLinks] = useState([]);
  const [adminMenu, setAdminMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/data.php')
      .then(res => res.json())
      .then(data => {
        setFormData({
          logo: data.logo || '',
          homeTitle: data.home?.title || '',
          homeContent: data.home?.content || '',
          footerText: data.footer?.text || '',
          loginUsername: data.login?.username || '',
          loginPassword: data.login?.password || '',
        });
        setMenuLinks(data.header?.links || []);
        setAdminMenu(data.admin?.menu || []);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLinkChange = (index, field, value, isHeader = true) => {
    const update = isHeader ? [...menuLinks] : [...adminMenu];
    update[index][field] = value;
    isHeader ? setMenuLinks(update) : setAdminMenu(update);
  };

  const addLink = (isHeader) => {
    const newLink = { name: '', url: '' };
    if (isHeader) setMenuLinks([...menuLinks, newLink]);
    else setAdminMenu([...adminMenu, { ...newLink, icon: '📄' }]);
  };

  const removeLink = (index, isHeader) => {
    if (isHeader) {
      setMenuLinks(menuLinks.filter((_, i) => i !== index));
    } else {
      setAdminMenu(adminMenu.filter((_, i) => i !== index));
    }
  };

  const saveSettings = () => {
    const updatedData = {
      logo: formData.logo,
      home: {
        title: formData.homeTitle,
        content: formData.homeContent,
      },
      footer: {
        text: formData.footerText,
      },
      login: {
        username: formData.loginUsername,
        password: formData.loginPassword,
      },
      header: {
        links: menuLinks,
      },
      admin: {
        menu: adminMenu,
      },
    };

    fetch('/api/data.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setMessage('✅ Data berhasil disimpan!');
          setTimeout(() => setMessage(''), 3000);
        } else {
          setMessage('❌ Gagal menyimpan: ' + result.message);
        }
      })
      .catch(err => {
        setMessage('❌ Error: Tidak bisa simpan data.');
        console.error(err);
      });
  };

  if (loading) return <div style={styles.container}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h1>Pengaturan Website</h1>
      {message && <p style={styles.message}>{message}</p>}

      <div style={styles.section}>
        <h2>Logo</h2>
        <input
          type="text"
          placeholder="URL Logo"
          value={formData.logo}
          name="logo"
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.section}>
        <h2>Halaman Utama</h2>
        <input
          type="text"
          placeholder="Judul Home"
          value={formData.homeTitle}
          name="homeTitle"
          onChange={handleChange}
          style={styles.input}
        />
        <textarea
          placeholder="Konten Home"
          value={formData.homeContent}
          name="homeContent"
          onChange={handleChange}
          style={{ ...styles.input, height: '80px' }}
        />
      </div>

      <div style={styles.section}>
        <h2>Footer</h2>
        <input
          type="text"
          placeholder="Teks Footer"
          value={formData.footerText}
          name="footerText"
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.section}>
        <h2>Login (Username & Password)</h2>
        <input
          type="text"
          placeholder="Username"
          value={formData.loginUsername}
          name="loginUsername"
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.loginPassword}
          name="loginPassword"
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.section}>
        <h2>Menu Header</h2>
        {menuLinks.map((link, index) => (
          <div key={index} style={styles.linkItem}>
            <input
              placeholder="Nama"
              value={link.name}
              onChange={(e) => handleLinkChange(index, 'name', e.target.value)}
              style={{ ...styles.input, width: '40%' }}
            />
            <input
              placeholder="URL"
              value={link.url}
              onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
              style={{ ...styles.input, width: '40%' }}
            />
            <button onClick={() => removeLink(index, true)} style={styles.removeBtn}>
              ×
            </button>
          </div>
        ))}
        <button onClick={() => addLink(true)} style={styles.addBtn}>
          + Tambah Link
        </button>
      </div>

      <div style={styles.section}>
        <h2>Menu Admin</h2>
        {adminMenu.map((item, index) => (
          <div key={index} style={styles.linkItem}>
            <span style={{ width: '5%' }}>{item.icon}</span>
            <input
              placeholder="Nama"
              value={item.name}
              onChange={(e) => handleLinkChange(index, 'name', e.target.value, false)}
              style={{ ...styles.input, width: '35%' }}
            />
            <input
              placeholder="URL"
              value={item.url}
              onChange={(e) => handleLinkChange(index, 'url', e.target.value, false)}
              style={{ ...styles.input, width: '35%' }}
            />
            <button onClick={() => removeLink(index, false)} style={styles.removeBtn}>
              ×
            </button>
          </div>
        ))}
        <button onClick={() => addLink(false)} style={styles.addBtn}>
          + Tambah Menu
        </button>
      </div>

      <button onClick={saveSettings} style={styles.saveBtn}>
        💾 Simpan Semua Perubahan
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
  },
  section: {
    marginBottom: '2rem',
    padding: '1.5rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    border: '1px solid #eee',
  },
  input: {
    padding: '0.7rem',
    width: '100%',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginBottom: '0.5rem',
  },
  linkItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  },
  removeBtn: {
    padding: '0.5rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '50px',
  },
  addBtn: {
    padding: '0.5rem',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  saveBtn: {
    padding: '1rem 2rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    marginTop: '1rem',
  },
  message: {
    padding: '1rem',
    backgroundColor: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
};

export default Settings;