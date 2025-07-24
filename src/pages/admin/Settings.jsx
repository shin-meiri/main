// src/pages/Admin/Settings.jsx
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

  const saveSettings = () => {
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    alert('Setting berhasil disimpan!');
  };

  return (
    <div>
      <form>
        <label>Site Title:<br/>
          <input type="text" name="siteTitle" value={settings.siteTitle} onChange={(e) => setSettings({...settings, siteTitle: e.target.value})} style={inputStyle} />
        </label><br/><br/>

        <label>Background Color:<br/>
          <input type="color" name="bgColor" value={settings.bgColor} onChange={(e) => setSettings({...settings, bgColor: e.target.value})} />
        </label><br/><br/>

        <label>Text Color:<br/>
          <input type="color" name="textColor" value={settings.textColor} onChange={(e) => setSettings({...settings, textColor: e.target.value})} />
        </label><br/><br/>

        <label>Favicon URL:<br/>
          <input type="text" name="favicon" value={settings.favicon} onChange={(e) => setSettings({...settings, favicon: e.target.value})} style={inputStyle} />
        </label><br/><br/>

        <button type="button" onClick={saveSettings} style={btnStyle}>
          Save Settings
        </button>
      </form>
    </div>
  );
};

const inputStyle = { width: '100%', padding: '8px', margin: '5px 0' };
const btnStyle = { backgroundColor: '#2c3e50', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer' };

export default Settings;