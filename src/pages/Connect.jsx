// src/pages/Connect.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Connect = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('users'); // users, connections
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
          Database Connections
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
          {data?.message || 'Welcome to Database Connections'}
        </div>

        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '20px',
          borderBottom: '1px solid #444'
        }}>
          <button
            onClick={() => setActiveTab('users')}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === 'users' ? 'pink' : '#333',
              color: activeTab === 'users' ? 'black' : 'pink',
              border: '1px solid pink',
              borderBottom: activeTab === 'users' ? 'none' : '1px solid pink',
              borderTopLeftRadius: '4px',
              borderTopRightRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Users ({data?.users?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('connections')}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === 'connections' ? 'pink' : '#333',
              color: activeTab === 'connections' ? 'black' : 'pink',
              border: '1px solid pink',
              borderBottom: activeTab === 'connections' ? 'none' : '1px solid pink',
              borderTopLeftRadius: '4px',
              borderTopRightRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Database Connections ({data?.users?.filter(u => u.host || u.dbname || u.tabel)?.length || 0})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'users' && (
          <div>
            <h2 style={{ 
              textAlign: 'center', 
              marginBottom: '20px',
              fontSize: '1.8rem'
            }}>
              Users Table
            </h2>
            
            {data?.users && data.users.length > 0 ? (
              <div style={{
                overflowX: 'auto',
                backgroundColor: '#222',
                border: '1px solid #444',
                borderRadius: '8px',
                marginBottom: '30px'
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  color: 'pink'
                }}>
                  <thead>
                    <tr style={{ backgroundColor: '#333' }}>
                      <th style={{ 
                        padding: '12px', 
                        textAlign: 'left', 
                        border: '1px solid #444' 
                      }}>ID</th>
                      <th style={{ 
                        padding: '12px', 
                        textAlign: 'left', 
                        border: '1px solid #444' 
                      }}>Username</th>
                      <th style={{ 
                        padding: '12px', 
                        textAlign: 'left', 
                        border: '1px solid #444' 
                      }}>Password</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.users.map(user => (
                      <tr key={user.id} style={{ borderBottom: '1px solid #444' }}>
                        <td style={{ padding: '12px', border: '1px solid #444' }}>{user.id}</td>
                        <td style={{ padding: '12px', border: '1px solid #444' }}>{user.username}</td>
                        <td style={{ padding: '12px', border: '1px solid #444' }}>••••••••</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
        )}

        {activeTab === 'connections' && (
          <div>
            <h2 style={{ 
              textAlign: 'center', 
              marginBottom: '20px',
              fontSize: '1.8rem'
            }}>
              Database Connections Table
            </h2>
            
            {data?.users && data.users.some(u => u.host || u.dbname || u.tabel) ? (
              <div style={{
                overflowX: 'auto',
                backgroundColor: '#222',
                border: '1px solid #444',
                borderRadius: '8px'
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  color: 'pink'
                }}>
                  <thead>
                    <tr style={{ backgroundColor: '#333' }}>
                      <th style={{ 
                        padding: '12px', 
                        textAlign: 'left', 
                        border: '1px solid #444' 
                      }}>User ID</th>
                      <th style={{ 
                        padding: '12px', 
                        textAlign: 'left', 
                        border: '1px solid #444' 
                      }}>Username</th>
                      <th style={{ 
                        padding: '12px', 
                        textAlign: 'left', 
                        border: '1px solid #444' 
                      }}>Host</th>
                      <th style={{ 
                        padding: '12px', 
                        textAlign: 'left', 
                        border: '1px solid #444' 
                      }}>Database</th>
                      <th style={{ 
                        padding: '12px', 
                        textAlign: 'left', 
                        border: '1px solid #444' 
                      }}>Table</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.users
                      .filter(user => user.host || user.dbname || user.tabel)
                      .map(user => (
                        <tr key={user.id} style={{ borderBottom: '1px solid #444' }}>
                          <td style={{ padding: '12px', border: '1px solid #444' }}>{user.id}</td>
                          <td style={{ padding: '12px', border: '1px solid #444' }}>{user.username}</td>
                          <td style={{ padding: '12px', border: '1px solid #444' }}>{user.host || '-'}</td>
                          <td style={{ padding: '12px', border: '1px solid #444' }}>{user.dbname || '-'}</td>
                          <td style={{ padding: '12px', border: '1px solid #444' }}>{user.tabel || '-'}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px',
                backgroundColor: '#222',
                border: '1px solid #444',
                borderRadius: '8px'
              }}>
                <p>No database connections found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Connect;