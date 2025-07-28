// src/pages/Pages.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Pages = () => {
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({ username: '', password: '' });
  const [editingUser, setEditingUser] = useState(null);
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
      setUsers(response.data.users || []);
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

  // Fungsi untuk menambah user baru dengan auto increment ID
  const handleAddUser = async () => {
    if (!newUser.username || !newUser.password) {
      alert('Username dan Password harus diisi!');
      return;
    }

    try {
      // Tentukan ID baru (auto increment)
      const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
      
      // Buat user baru
      const userToAdd = {
        id: newId,
        username: newUser.username,
        password: newUser.password
      };

      // Kirim data ke API
      const response = await axios.post('/api/dat.php', {
        message: 'welcome',
        users: [...users, userToAdd]
      });

      if (response.data.status === 'success') {
        // Refresh data setelah berhasil menyimpan
        fetchData();
        // Reset form
        setNewUser({ username: '', password: '' });
        setEditingUser(null);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Fungsi untuk mengedit user
  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser({
      username: user.username,
      password: user.password
    });
  };

  // Fungsi untuk update user yang sudah ada
  const handleUpdateUser = async () => {
    if (!newUser.username || !newUser.password || !editingUser) {
      alert('Username dan Password harus diisi!');
      return;
    }

    try {
      // Update user yang diedit
      const updatedUsers = users.map(user => 
        user.id === editingUser.id 
          ? { ...user, username: newUser.username, password: newUser.password }
          : user
      );

      // Kirim data yang sudah diperbarui ke API
      const response = await axios.post('/api/dat.php', {
        message: 'welcome',
        users: updatedUsers
      });

      if (response.data.status === 'success') {
        // Refresh data setelah berhasil mengupdate
        fetchData();
        // Reset form
        setNewUser({ username: '', password: '' });
        setEditingUser(null);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Fungsi untuk menghapus user
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      try {
        // Filter user yang tidak dihapus
        const updatedUsers = users.filter(user => user.id !== userId);
        
        // Kirim data yang sudah diperbarui ke API
        const response = await axios.post('/api/dat.php', {
          message: 'welcome',
          users: updatedUsers
        });

        if (response.data.status === 'success') {
          // Refresh data setelah berhasil menghapus
          fetchData();
          // Jika sedang mengedit user yang dihapus, reset form
          if (editingUser && editingUser.id === userId) {
            setNewUser({ username: '', password: '' });
            setEditingUser(null);
          }
        }
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Fungsi untuk handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Fungsi untuk handle submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      handleUpdateUser();
    } else {
      handleAddUser();
    }
  };

  // Fungsi untuk cancel edit
  const handleCancelEdit = () => {
    setNewUser({ username: '', password: '' });
    setEditingUser(null);
  };

  // Jika belum login, jangan tampilkan konten
  if (!currentUser) {
    return null;
  }

  if (loading) return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f5f7fa'
    }}>
      <div style={{ 
        textAlign: 'center',
        padding: '30px',
        backgroundColor: 'white',
        borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          fontSize: '2rem',
          marginBottom: '15px'
        }}>🔄</div>
        <div style={{ 
          fontSize: '1.2rem',
          color: '#666'
        }}>Loading...</div>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f5f7fa'
    }}>
      <div style={{ 
        textAlign: 'center',
        padding: '30px',
        backgroundColor: '#fee',
        borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        border: '1px solid #fcc'
      }}>
        <div style={{ 
          fontSize: '2rem',
          marginBottom: '15px',
          color: '#c33'
        }}>❌</div>
        <div style={{ 
          fontSize: '1.2rem',
          color: '#c33',
          marginBottom: '15px'
        }}>Error: {error}</div>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Reload
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f7fa',
      padding: '20px'
    }}>
      {/* Header dengan welcome message dan tombol logout */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '15px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
        border: '1px solid #e1e5e9'
      }}>
        <div style={{ 
          fontSize: '2rem',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {data?.message || 'welcome'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '14px', color: '#666' }}>
            👤 Welcome, <strong style={{ color: '#667eea' }}>{currentUser.username}</strong>
          </span>
          <button
            onClick={() => navigate('/connect')}
            style={{
              padding: '10px 20px',
              backgroundColor: 'linear-gradient(45deg, #4CAF50, #45a049)',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 5px 15px rgba(76, 175, 80, 0.3)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            🚀 Connect DB
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              backgroundColor: 'linear-gradient(45deg, #f44336, #d32f2f)',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 5px 15px rgba(244, 67, 54, 0.3)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            🔒 Logout
          </button>
        </div>
      </div>

      {/* Form untuk menambah/edit user */}
      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto 30px auto',
        padding: '30px',
        backgroundColor: 'white',
        borderRadius: '15px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
        border: '1px solid #e1e5e9'
      }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '25px',
          color: '#333',
          fontSize: '1.8rem'
        }}>
          {editingUser ? '✏️ Edit User' : '➕ Tambah User Baru'}
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333'
            }}>
              Username
            </label>
            <input
              type="text"
              name="username"
              value={newUser.username}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '14px',
                border: '2px solid #e1e5e9',
                borderRadius: '10px',
                fontSize: '16px',
                transition: 'border-color 0.3s ease',
                outline: 'none'
              }}
              placeholder="Masukkan username"
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
            />
          </div>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333'
            }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '14px',
                border: '2px solid #e1e5e9',
                borderRadius: '10px',
                fontSize: '16px',
                transition: 'border-color 0.3s ease',
                outline: 'none'
              }}
              placeholder="Masukkan password"
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
            />
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '16px',
                backgroundColor: 'linear-gradient(45deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 10px 20px rgba(102, 126, 234, 0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {editingUser ? '💾 Update' : 'Save User'}
            </button>
            {editingUser && (
              <button
                type="button"
                onClick={handleCancelEdit}
                style={{
                  flex: 1,
                  padding: '16px',
                  backgroundColor: '#f5f7fa',
                  color: '#666',
                  border: '2px solid #e1e5e9',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#e1e5e9';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#f5f7fa';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Daftar user yang sudah ada */}
      <div style={{ 
        maxWidth: '1000px', 
        margin: '0 auto',
        padding: '30px',
        backgroundColor: 'white',
        borderRadius: '15px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
        border: '1px solid #e1e5e9'
      }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '25px',
          color: '#333',
          fontSize: '1.8rem'
        }}>
          📋 Daftar User ({users.length})
        </h2>
        {users.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '50px',
            backgroundColor: '#f8f9fa',
            borderRadius: '10px',
            border: '2px dashed #e1e5e9'
          }}>
            <div style={{ 
              fontSize: '3rem',
              marginBottom: '15px',
              color: '#ccc'
            }}>📭</div>
            <div style={{ 
              fontSize: '1.2rem',
              color: '#666'
            }}>Belum ada user yang ditambahkan</div>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '20px' 
          }}>
            {users.map(user => (
              <div 
                key={user.id}
                onClick={() => handleEditUser(user)}
                style={{
                  padding: '20px',
                  backgroundColor: editingUser?.id === user.id ? '#e3f2fd' : '#f8f9fa',
                  border: editingUser?.id === user.id ? '2px solid #667eea' : '1px solid #e1e5e9',
                  borderRadius: '12px',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: editingUser?.id === user.id ? '0 5px 15px rgba(102, 126, 234, 0.2)' : 'none'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = editingUser?.id === user.id ? '0 5px 15px rgba(102, 126, 234, 0.2)' : 'none';
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '15px' 
                }}>
                  <div style={{ 
                    width: '45px', 
                    height: '45px', 
                    backgroundColor: '#667eea',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '15px',
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: '1.2rem'
                  }}>
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ 
                      fontSize: '1.2rem', 
                      fontWeight: 'bold', 
                      color: '#333' 
                    }}>
                      {user.username}
                    </div>
                    <div style={{ 
                      fontSize: '0.9rem', 
                      color: '#666' 
                    }}>
                      ID: {user.id}
                    </div>
                  </div>
                </div>
                
                <div style={{ 
                  marginBottom: '20px',
                  padding: '12px',
                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(102, 126, 234, 0.2)'
                }}>
                  <div style={{ 
                    fontSize: '0.9rem', 
                    color: '#666', 
                    marginBottom: '5px' 
                  }}>
                    🔐 Password:
                  </div>
                  <div style={{ 
                    fontSize: '1rem', 
                    fontWeight: '500',
                    color: '#333',
                    wordBreak: 'break-all'
                  }}>
                    {user.password}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteUser(user.id);
                  }}
                  style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    backgroundColor: '#ff4757',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '35px',
                    height: '35px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'scale(1.1)';
                    e.target.style.boxShadow = '0 5px 15px rgba(255, 71, 87, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Pages;