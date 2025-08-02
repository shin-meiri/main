import React, { useEffect } from 'react';

const QrScanner = ({ onScan }) => {
  useEffect(() => {
    const html5QrCode = new window.Html5Qrcode("qr-reader");

    return () => {
      html5QrCode.stop().catch(() => {});
    };
  }, []);

  const startScan = () => {
    const config = { fps: 10, qrbox: 250 };
    const successCallback = (decodedText) => {
      try {
        const data = JSON.parse(decodedText);
        if (data.username && data.password) {
          onScan(data.username, data.password);
        }
      } catch (e) {
        console.error("Invalid QR data");
      }
    };

    html5QrCode.start({ facingMode: "environment" }, config, successCallback);
  };

  return (
    <div>
      <div id="qr-reader" style={{ width: "100%" }}></div>
      <button onClick={startScan} style={{ display: 'block', margin: '10px auto' }}>
        Mulai Scan
      </button>
    </div>
  );
};

export default QrScanner;