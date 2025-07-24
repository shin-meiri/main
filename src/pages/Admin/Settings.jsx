import React, { useState, useEffect } from 'react';

const Settings = ({ settings, setSettings }) => {
  const saveSettings = () => {
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    alert('Pengaturan berhasil disimpan!');
  };

  return (
    <div style={containerStyle}>
      <h2>Pengaturan Tampilan</h2>

      <div style={formGroup}>
        <label>Site Title</label>
        <input
          type="text"
          value={settings.siteTitle}
          onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
          style={inputStyle}
        />
      </div>

      <div style={formGroup}>
        <label>Background Color</label>
        <input
          type="color"
          value={settings.bgColor}
          onChange={(e) => setSettings({ ...settings, bgColor: e.target.value })}
        />
      </div>

      <div style={formGroup}>
        <label>Text Color</label>
        <input
          type="color"
          value={settings.textColor}
          onChange={(e) => setSettings({ ...settings, textColor: e.target.value })}
        />
      </div>

      <div style={formGroup}>
        <label>Favicon URL</label>
        <input
          type="text"
          value={settings.favicon}
          onChange={(e) => setSettings({ ...settings, favicon: e.target.value })}
          placeholder="/favicon.ico"
          style={inputStyle}
        />
      </div>

      <button onClick={saveSettings} style={btnStyle}>
        Simpan Pengaturan
      </button>
    </div>
  );
};

// Styling
const containerStyle = { padding: '20px', marginLeft: '270px' };
const formGroup = { marginBottom: '20px' };
const inputStyle = { width: '100%', padding: '8px', boxSizing: 'border-box' };
const btnStyle = {
  backgroundColor: '#2c3e50',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default Settings;