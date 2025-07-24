import React, { useState, useEffect } from 'react';

const Admin = () => {
  const [settings, setSettings] = useState({
    siteTitle: 'My Site',
    bgColor: '#f4f4f4',
    textColor: '#333',
    favicon: '/favicon.ico'
  });

  // Load dari settings.json di public
  useEffect(() => {
    fetch('/settings.json')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => console.log("Gunakan default"));
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const saveSettings = () => {
    // Simpan ke localStorage (karena InfinityFree tidak bisa simpan ke server)
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    alert('Setting disimpan di browser (localStorage). Untuk production, gunakan PHP atau external JSON.');
  };

  // Terapkan setting ke tampilan
  useEffect(() => {
    document.body.style.backgroundColor = settings.bgColor;
    document.body.style.color = settings.textColor;
    document.title = settings.siteTitle;

    const link = document.querySelector("link[rel='icon']");
    if (link) {
      link.href = settings.favicon;
    }
  }, [settings]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Panel</h2>
      <form>
        <label>Site Title:<br/>
          <input type="text" name="siteTitle" value={settings.siteTitle} onChange={handleChange} style={inputStyle} />
        </label><br/><br/>

        <label>Background Color:<br/>
          <input type="color" name="bgColor" value={settings.bgColor} onChange={handleChange} />
        </label><br/><br/>

        <label>Text Color:<br/>
          <input type="color" name="textColor" value={settings.textColor} onChange={handleChange} />
        </label><br/><br/>

        <label>Favicon URL:<br/>
          <input type="text" name="favicon" value={settings.favicon} onChange={handleChange} style={inputStyle} />
        </label><br/><br/>

        <button type="button" onClick={saveSettings} style={btnStyle}>
          Save Settings
        </button>
      </form>

      <p><small>Setting disimpan di localStorage. Hanya berlaku di browser ini.</small></p>
    </div>
  );
};

const inputStyle = { width: '100%', padding: '8px', margin: '5px 0' };
const btnStyle = { backgroundColor: '#2c3e50', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer' };

export default Admin;