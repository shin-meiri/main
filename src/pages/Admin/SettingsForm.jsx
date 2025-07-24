import React, { useState, useEffect } from 'react';

const SettingsForm = () => {
  const [settings, setSettings] = useState({
    siteTitle: 'My Professional Site',
    bgColor: '#f8f9fa',
    textColor: '#212529',
    favicon: '/favicon.ico',
  });

  useEffect(() => {
    const saved = localStorage.getItem('siteSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    } else {
      fetch('/settings.json')
        .then(res => res.json())
        .then(data => setSettings(data));
    }
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = settings.bgColor;
    document.body.style.color = settings.textColor;
    document.title = settings.siteTitle;
    const link = document.querySelector("link[rel='icon']");
    if (link) link.href = settings.favicon;
  }, [settings]);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const saveSettings = () => {
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    alert('✅ Setting berhasil disimpan!');
  };

  return (
    <div>
      <h2>Pengaturan Situs</h2>
      <form>
        <div style={formStyle.field}>
          <label>Site Title</label>
          <input type="text" name="siteTitle" value={settings.siteTitle} onChange={handleChange} style={formStyle.input} />
        </div>

        <div style={formStyle.field}>
          <label>Background Color</label>
          <input type="color" name="bgColor" value={settings.bgColor} onChange={handleChange} />
        </div>

        <div style={formStyle.field}>
          <label>Text Color</label>
          <input type="color" name="textColor" value={settings.textColor} onChange={handleChange} />
        </div>

        <div style={formStyle.field}>
          <label>Favicon URL</label>
          <input type="text" name="favicon" value={settings.favicon} onChange={handleChange} style={formStyle.input} />
        </div>

        <button type="button" onClick={saveSettings} style={formStyle.button}>
          Simpan Pengaturan
        </button>
      </form>
    </div>
  );
};

const formStyle = {
  field: { marginBottom: '20px' },
  input: { width: '100%', padding: '8px' },
  button: { padding: '10px 20px', backgroundColor: '#2c3e50', color: 'white', border: 'none', cursor: 'pointer' },
};

export default SettingsForm;
