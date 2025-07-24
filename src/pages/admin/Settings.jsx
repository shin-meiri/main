import React, { useState } from 'react';

export default function Settings() {
  const [bgColor, setBgColor] = useState('#ffffff');
  const [favicon, setFavicon] = useState('');

  const applySettings = () => {
    document.body.style.backgroundColor = bgColor;
    // Simpan ke localStorage
    localStorage.setItem('website_bg_color', bgColor);
    alert('Pengaturan diterapkan!');
  };

  React.useEffect(() => {
    const savedColor = localStorage.getItem('website_bg_color');
    if (savedColor) {
      document.body.style.backgroundColor = savedColor;
      setBgColor(savedColor);
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
      <button onClick={applySettings}>Terapkan</button>
    </div>
  );
}