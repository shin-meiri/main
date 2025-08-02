/* eslint-disable no-undef */

import React, { useEffect, useRef } from 'react';

const QrScanner = ({ onScan }) => {
  const qrRef = useRef(null);

  useEffect(() => {
    let html5QrCode;

    if (window.Html5Qrcode) {
      html5QrCode = new window.Html5Qrcode("qr-reader");

      const config = { fps: 10, qrbox: 250 };

      const successCallback = (decodedText) => {
        try {
          const data = JSON.parse(decodedText);
          if (data.username && data.password) {
            onScan(data.username, data.password);
          }
        } catch (e) {
          console.error("QR Code tidak valid");
        }
      };

      html5QrCode.start({ facingMode: "environment" }, config, successCallback)
        .catch(err => {
          console.error("Gagal mulai scanner:", err);
        });
    }

    return () => {
      if (html5QrCode) {
        html5QrCode.stop().catch(() => {});
      }
    };
  }, [onScan]);

  return (
    <div>
      <div id="qr-reader" ref={qrRef} style={{ width: "100%" }}></div>
      <button 
        type="button" 
        style={{ display: 'block', margin: '10px auto', padding: '10px', cursor: 'pointer' }}
      >
        Mulai Scan
      </button>
    </div>
  );
};

export default QrScanner;