// src/pages/admin/Settings.jsx

import React, { useState } from 'react';

export default function Settings() {
  const [bgColor, setBgColor] = useState('#ffffff');
  const [favicon, setFavicon] = useState(''); // URL favicon

  const applySettings = () => {
    // Ubah background
    document.body.style.backgroundColor = bgColor;
    localStorage.setItem('website_bg_color', bgColor);

    // Ubah favicon
    if (favicon) {
      const link = document.querySelector("link[rel='icon']");
      if (link) {
        link.href = favicon;
      } else {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = favicon;
        document.head.appendChild(newLink);
      }
      localStorage.setItem('website_favicon', favicon);
    }

    alert('Pengaturan diterapkan!');
  };

  React.useEffect(() => {
    const savedColor = localStorage.getItem('website_bg_color');
    const savedFavicon = localStorage.getItem('website_favicon');

    if (savedColor) {
      document.body.style.backgroundColor = savedColor;
      setBgColor(savedColor);
    }
    if (savedFavicon) {
      setFavicon(savedFavicon);
      const link = document.querySelector("link[rel='icon']");
      if (link) {
        link.href = savedFavicon;
      }
    }
  }, []);

  return (
    <div className="admin-settings">
      <h2>Pengaturan Website</h2>

      <div>
        <label>Warna Background: </label>
        <input
          type="color"
          value={bgColor}
          onChange={(e) => setBgColor(e.target.value)}
        />
      </div>

      <div>
        <label>Favicon URL: </label>
        <input
          type="text"
          placeholder="https://example.com/favicon.ico"
          value={favicon}
          onChange={(e) => setFavicon(e.target.value)}
        />
      </div>

      <button onClick={applySettings}>Terapkan</button>
    </div>
  );
}