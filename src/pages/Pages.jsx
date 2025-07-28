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
  const [showPasswords, setShowPasswords] = useState({});
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

  // Fungsi untuk toggle visibility password
  const togglePasswordVisibility = (userId) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
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

  if (loading) return <div style={{ color: 'pink', backgroundColor: 'black', padding: '20px' }}>Loading...</div>;
  if (error) return <div style={{ color: 'pink', backgroundColor: 'black', padding: '20px' }}>Error: {error}</div>;

  return (
    <div style={{ 
      color: 'pink', 
      backgroundColor: 'black', 
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header dengan welcome message dan tombol logout */}
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

      {/* Form untuk menambah/edit user */}
      <div style={{ 
        maxWidth: '500px', 
        margin: '0 auto 30px auto',
        padding: '20px',
        border: '1px solid pink',
        borderRadius: '8px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
          {editingUser ? 'Edit User' : 'Tambah User Baru'}
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
            <input
              type="text"
              name="username"
              value={newUser.username}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#333',
                color: 'pink',
                border: '1px solid #555',
                borderRadius: '4px'
              }}
              placeholder="Masukkan username"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="password"
                name="password"
                value={newUser.password}
                onChange={handleInputChange}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#333',
                  color: 'pink',
                  border: '1px solid #555',
                  borderRadius: '4px'
                }}
                placeholder="Masukkan password"
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: 'pink',
                color: 'black',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
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
                  padding: '12px',
                  backgroundColor: '#555',
                  color: 'pink',
                  border: '1px solid pink',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
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
        maxWidth: '800px', 
        margin: '0 auto',
        padding: '20px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Daftar User ({users.length})</h2>
        {users.length === 0 ? (
          <p style={{ textAlign: 'center' }}>Belum ada user yang ditambahkan</p>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '15px' 
          }}>
            {users.map(user => (
              <div 
                key={user.id}
                onClick={() => handleEditUser(user)}
                style={{
                  padding: '15px',
                  backgroundColor: editingUser?.id === user.id ? '#444' : '#222',
                  border: editingUser?.id === user.id ? '2px solid pink' : '1px solid #444',
                  borderRadius: '6px',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div><strong>ID:</strong> {user.id}</div>
                <div><strong>Username:</strong> {user.username}</div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <strong>Password:</strong>
                  <span style={{ marginLeft: '5px' }}>
                    {showPasswords[user.id] ? user.password : '•'.repeat(user.password.length)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePasswordVisibility(user.id);
                    }}
                    style={{
                      marginLeft: '10px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'pink',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    {showPasswords[user.id] ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteUser(user.id);
                  }}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'pink',
                    fontSize: '18px',
                    cursor: 'pointer',
                    padding: '5px'
                  }}
                  title="Hapus User"
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