// src/AdminPanel.jsx
import React, { useState, useEffect } from 'react';

const API_URL = 'https://bos.free.nf/api/crud.php';

export default function AdminPanel() {
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [activePage, setActivePage] = useState('dashboard');
  const [pages, setPages] = useState([]);
  const [menu, setMenu] = useState([]);
  const [settings, setSettings] = useState({});
  const [loginForm, setLoginForm] = useState({ password: '' });
  const [editPage, setEditPage] = useState(null);
  const [addMenuForm, setAddMenuForm] = useState({ label: '', slug: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    // 🔑 GANTI PASSWORD DI SINI!
    if (loginForm.password === 'amymeiri') {
      localStorage.setItem('admin_token', 'logged_in');
      setToken('logged_in');
    } else {
      alert('Password salah!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
  };

  const fetchData = async () => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getAdminData' })
      });
      const data = await res.json();
      if (data.success) {
        setPages(data.pages);
        setMenu(data.menu);
        setSettings(data.settings);
      }
    } catch (err) {
      alert('Gagal ambil data: ' + err.message);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const savePage = async () => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editPage, action: 'savePage' })
    });
    const result = await res.json();
    if (result.success) {
      alert('✅ Halaman disimpan!');
      setEditPage(null);
      fetchData();
    }
  };

  const addNewMenu = async () => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...addMenuForm, action: 'addMenu' })
    });
    const result = await res.json();
    if (result.success) {
      alert('✅ Menu ditambahkan!');
      setAddMenuForm({ label: '', slug: '' });
      fetchData();
    }
  };

  const deleteMenu = async (id) => {
    if (!window.confirm('Yakin hapus menu ini?')) return;
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'deleteMenu' })
    });
    const result = await res.json();
    if (result.success) {
      fetchData();
    }
  };

  const saveSettings = async () => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...settings, action: 'saveSettings' })
    });
    const result = await res.json();
    if (result.success) {
      alert('✅ Pengaturan disimpan!');
    }
  };

  if (!token) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginBox}>
          <h2>🔐 Login Admin</h2>
          <form onSubmit={handleLogin} style={styles.form}>
            <input
              type="password"
              placeholder="Masukkan password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              style={styles.input}
              required
            />
            <button type="submit" style={styles.button}>Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h3>🛠️ Admin Panel</h3>
        <nav>
          {[
            ['dashboard', '📊 Dashboard'],
            ['pages', '📄 Kelola Halaman'],
            ['menu', '🔗 Kelola Menu'],
            ['settings', '⚙️ Pengaturan'],
          ].map(([key, label]) => (
            <div
              key={key}
              onClick={() => setActivePage(key)}
              style={activePage === key ? styles.sidebarItemActive : styles.sidebarItem}
            >
              {label}
            </div>
          ))}
        </nav>
        <button onClick={handleLogout} style={styles.logoutButton}>🔴 Logout</button>
      </div>

      <div style={styles.content}>
        {activePage === 'dashboard' && (
          <div>
            <h2>🏠 Dashboard</h2>
            <p>Selamat datang di panel admin.</p>
            <div style={styles.stats}>
              <div style={styles.statCard}>📄 {pages.length} Halaman</div>
              <div style={styles.statCard}>🔗 {menu.length} Menu</div>
            </div>
          </div>
        )}

        {activePage === 'pages' && (
          <div>
            <h2>📄 Kelola Halaman</h2>
            <table style={styles.table}>
              <tr>
                <th>Slug</th>
                <th>Judul</th>
                <th>Aksi</th>
              </tr>
              {pages.map(p => (
                <tr key={p.slug}>
                  <td>{p.slug}</td>
                  <td>{p.title}</td>
                  <td>
                    <button onClick={() => setEditPage({ ...p })} style={styles.button}>Edit</button>
                  </td>
                </tr>
              ))}
            </table>

            {editPage && (
              <div style={styles.modal}>
                <h3>Edit: {editPage.title}</h3>
                <input
                  type="text"
                  placeholder="Judul"
                  value={editPage.title}
                  onChange={e => setEditPage({ ...editPage, title: e.target.value })}
                  style={styles.input}
                />
                <textarea
                  placeholder="Konten (HTML boleh)"
                  value={editPage.content}
                  onChange={e => setEditPage({ ...editPage, content: e.target.value })}
                  rows="8"
                  style={{ ...styles.input, height: '200px' }}
                />
                <div style={styles.modalButtons}>
                  <button onClick={() => setEditPage(null)} style={styles.cancelButton}>Batal</button>
                  <button onClick={savePage} style={styles.button}>Simpan</button>
                </div>
              </div>
            )}
          </div>
        )}

        {activePage === 'menu' && (
          <div>
            <h2>🔗 Kelola Menu</h2>
            <table style={styles.table}>
              <tr>
                <th>ID</th>
                <th>Label</th>
                <th>Slug</th>
                <th>Aksi</th>
              </tr>
              {menu.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.label}</td>
                  <td>{item.slug}</td>
                  <td>
                    <button onClick={() => deleteMenu(item.id)} style={{ ...styles.button, backgroundColor: '#dc3545' }}>
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </table>

            <h3>➕ Tambah Menu Baru</h3>
            <input
              type="text"
              placeholder="Label"
              value={addMenuForm.label}
              onChange={e => setAddMenuForm({ ...addMenuForm, label: e.target.value })}
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Slug (contoh: blog)"
              value={addMenuForm.slug}
              onChange={e => setAddMenuForm({ ...addMenuForm, slug: e.target.value })}
              style={styles.input}
            />
            <button onClick={addNewMenu} style={styles.button}>Tambah Menu</button>
          </div>
        )}

        {activePage === 'settings' && (
          <div>
            <h2>⚙️ Pengaturan Situs</h2>
            <input
              type="text"
              placeholder="Nama Situs"
              value={settings.site_name || ''}
              onChange={e => setSettings({ ...settings, site_name: e.target.value })}
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Deskripsi"
              value={settings.site_description || ''}
              onChange={e => setSettings({ ...settings, site_description: e.target.value })}
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Footer"
              value={settings.footer_text || ''}
              onChange={e => setSettings({ ...settings, footer_text: e.target.value })}
              style={styles.input}
            />
            <button onClick={saveSettings} style={styles.button}>Simpan Pengaturan</button>
          </div>
        )}
      </div>
    </div>
  );
}

// === STYLES ===
const styles = {
  container: { display: 'flex', minHeight: '100vh', fontFamily: 'Arial' },
  sidebar: { width: '250px', backgroundColor: '#2c3e50', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column' },
  sidebarItem: { padding: '12px 15px', cursor: 'pointer', borderRadius: '5px', marginBottom: '8px' },
  sidebarItemActive: { padding: '12px 15px', cursor: 'pointer', borderRadius: '5px', marginBottom: '8px', backgroundColor: '#3498db', fontWeight: 'bold' },
  logoutButton: { marginTop: 'auto', padding: '12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  content: { flex: 1, padding: '30px', backgroundColor: '#f8f9fa' },
  loginContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8f9fa' },
  loginBox: { padding: '40px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center' },
  form: { marginTop: '20px' },
  input: { padding: '12px', width: '100%', border: '1px solid #ddd', borderRadius: '5px', marginBottom: '10px', fontSize: '16px' },
  button: { padding: '12px 20px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' },
  cancelButton: { padding: '12px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' },
  table: { width: '100%', borderCollapse: 'collapse', marginBottom: '30px' },
  modal: { marginTop: '30px', padding: '20px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  modalButtons: { marginTop: '20px', textAlign: 'right' },
  stats: { display: 'flex', gap: '20px', margin: '20px 0' },
  statCard: { padding: '15px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', flex: 1, textAlign: 'center', fontWeight: 'bold' },
};