// src/pages/Connect.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Connect = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Cek apakah user sudah login
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Fungsi untuk mengambil data dari API
  const fetchData = async () => {
    try {
      const response = await axios.get('/api/dat.json');
      setData(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Load data saat komponen pertama kali dimuat
  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  // Fungsi untuk logout
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    navigate('/login');
  };

  // Fungsi untuk kembali ke halaman utama
  const handleBackToHome = () => {
    navigate('/');
  };

  // Jika belum login, jangan tampilkan konten
  if (!currentUser) {
    return null;
  }

  if (loading) return (
    <div style={{ 
      color: 'pink', 
      backgroundColor: 'black', 
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      Loading...
    </div>
  );

  if (error) return (
    <div style={{ 
      color: 'pink', 
      backgroundColor: 'black', 
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      Error: {error}
    </div>
  );

  return (
    <div style={{ 
      color: 'pink', 
      backgroundColor: 'black', 
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
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
          Database Connection
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '14px', color: '#aaa' }}>
            Welcome, {currentUser.username}
          </span>
          <button
            onClick={handleBackToHome}
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
            Back to Home
          </button>
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

      {/* Main Content */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto'
      }}>
        {/* Welcome Message */}
        <div style={{ 
          textAlign: 'center', 
          fontSize: '1.5rem', 
          marginBottom: '30px',
          padding: '20px',
          backgroundColor: '#222',
          border: '1px solid #444',
          borderRadius: '8px'
        }}>
          {data?.message || 'Welcome to Database Connection'}
        </div>

        {/* Users Data */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ 
            textAlign: 'center', 
            marginBottom: '20px',
            fontSize: '1.8rem'
          }}>
            Users Data ({data?.users?.length || 0} users)
          </h2>
          
          {data?.users && data.users.length > 0 ? (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
              gap: '20px' 
            }}>
              {data.users.map(user => (
                <div 
                  key={user.id}
                  style={{
                    padding: '20px',
                    backgroundColor: '#222',
                    border: '1px solid #444',
                    borderRadius: '8px'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '15px',
                    paddingBottom: '10px',
                    borderBottom: '1px solid #444'
                  }}>
                    <h3 style={{ margin: 0, color: 'pink' }}>User ID: {user.id}</h3>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px' }}>
                    <div><strong>Username:</strong></div>
                    <div>{user.username}</div>
                    
                    <div><strong>Password:</strong></div>
                    <div>••••••••</div>
                    
                    {user.host && (
                      <>
                        <div><strong>Host:</strong></div>
                        <div>{user.host}</div>
                      </>
                    )}
                    
                    {user.dbname && (
                      <>
                        <div><strong>Database:</strong></div>
                        <div>{user.dbname}</div>
                      </>
                    )}
                    
                    {user.tabel && (
                      <>
                        <div><strong>Table:</strong></div>
                        <div>{user.tabel}</div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px',
              backgroundColor: '#222',
              border: '1px solid #444',
              borderRadius: '8px'
            }}>
              <p>No users found in the database</p>
            </div>
          )}
        </div>

        {/* Raw JSON Data */}
        <div>
          <h2 style={{ 
            textAlign: 'center', 
            marginBottom: '20px',
            fontSize: '1.8rem'
          }}>
            Raw JSON Data
          </h2>
          <div style={{
            backgroundColor: '#111',
            border: '1px solid #444',
            borderRadius: '8px',
            padding: '20px',
            overflow: 'auto'
          }}>
            <pre style={{
              color: 'pink',
              margin: 0,
              fontSize: '14px',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word'
            }}>
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connect;