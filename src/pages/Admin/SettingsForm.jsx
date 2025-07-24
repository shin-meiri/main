import React, { useState, useEffect } from 'react';

const Settings = () => {
  const [settings, setSettings] = useState({
    siteTitle: 'My Professional Site',
    bgColor: '#f8f9fa',
    textColor: '#212529',
    favicon: '/favicon.ico'
  });

  useEffect(() => {
    const saved = localStorage.getItem('siteSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
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
    alert('Setting berhasil disimpan!');
  };

  return (
    <div>
      <h2>⚙️ Pengaturan Situs</h2>
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
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
};

const inputStyle = { width: '100%', padding: '8px', margin: '5px 0', fontSize: '14px' };
const btnStyle = {
  backgroundColor: '#2c3e50',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default Settings;