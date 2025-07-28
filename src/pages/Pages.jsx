// src/pages/Pages.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Pages = () => {
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({ username: '', password: '' });

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
    fetchData();
  }, []);

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
    handleAddUser();
  };

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
      {/* Welcome Message di atas */}
      <div style={{ 
        textAlign: 'center', 
        fontSize: '2.5rem', 
        marginBottom: '30px',
        paddingTop: '20px'
      }}>
        {data?.message || 'welcome'}
      </div>

      {/* Form untuk menambah user */}
      <div style={{ 
        maxWidth: '500px', 
        margin: '0 auto 30px auto',
        padding: '20px',
        border: '1px solid pink',
        borderRadius: '8px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Tambah User Baru</h2>
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
            <input
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#333',
                color: 'pink',
                border: '1px solid #555',
                borderRadius: '4px'
              }}
              placeholder="Masukkan password"
            />
          </div>
          <button
            type="submit"
            style={{
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
            Save User
          </button>
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
                style={{
                  padding: '15px',
                  backgroundColor: '#222',
                  border: '1px solid #444',
                  borderRadius: '6px',
                  position: 'relative'
                }}
              >
                <div><strong>ID:</strong> {user.id}</div>
                <div><strong>Username:</strong> {user.username}</div>
                <div><strong>Password:</strong> {user.password}</div>
                <button
                  onClick={() => handleDeleteUser(user.id)}
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