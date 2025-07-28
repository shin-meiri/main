// src/pages/Pages.jsx (bagian header diperbarui)
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Pages = () => {
  // ... (kode sebelumnya tetap sama)

  // Tambahkan useLocation untuk mengetahui route saat ini
  const location = useLocation();

  // ... (kode sebelumnya tetap sama)

  return (
    <div style={{ 
      color: 'pink', 
      backgroundColor: 'black', 
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header dengan welcome message dan tombol */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '10px 0',
        borderBottom: '1px solid #444'
      }}>
        <div style={{ 
          fontSize: '2rem' 
        }}>
          {data?.message || 'welcome'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '14px', color: '#aaa' }}>
            Welcome, {currentUser.username}
          </span>
          {/* Tombol Connect hanya muncul di halaman utama */}
          {location.pathname === '/' && (
            <button
              onClick={() => navigate('/connect')}
              style={{
                padding: '8px 15px',
                backgroundColor: 'pink',
                color: 'black',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Connect MySQL
            </button>
          )}
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 15px',
              backgroundColor: '#555',
              color: 'pink',
              border: '1px solid pink',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* ... (sisa kode tetap sama) */}
    </div>
  );
};

export default Pages;