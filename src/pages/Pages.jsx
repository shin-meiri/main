// /pages/Pages.jsx
import React, { useState, useEffect } from 'react';

const Pages = () => {
  // State untuk data CRUD
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    user: '',
    password: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data dari API saat komponen pertama kali dimuat
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dat.php');
      if (!response.ok) throw new Error('Gagal memuat data');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle perubahan input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle submit form (tambah/edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.user || !formData.password) {
      alert('User dan Password harus diisi!');
      return;
    }

    try {
      let response;
      
      if (editingId) {
        // Update data yang ada
        response = await fetch('/api/dat.php', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: editingId,
            user: formData.user,
            password: formData.password
          })
        });
      } else {
        // Tambah data baru
        response = await fetch('/api/dat.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: formData.user,
            password: formData.password
          })
        });
      }

      if (!response.ok) throw new Error('Gagal menyimpan data');
      
      // Reset form dan reload data
      setFormData({ id: '', user: '', password: '' });
      setEditingId(null);
      await loadData();
      
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle edit
  const handleEdit = (user) => {
    setFormData({
      id: user.id,
      user: user.user,
      password: user.password
    });
    setEditingId(user.id);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        const response = await fetch('/api/dat.php', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: id })
        });

        if (!response.ok) throw new Error('Gagal menghapus data');
        
        await loadData(); // Reload data setelah delete
        
        // Reset form jika sedang edit data yang dihapus
        if (editingId === id) {
          setFormData({ id: '', user: '', password: '' });
          setEditingId(null);
        }
        
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Handle cancel edit
  const handleCancel = () => {
    setFormData({ id: '', user: '', password: '' });
    setEditingId(null);
  };

  if (loading) return (
    <div style={{ 
      backgroundColor: 'black', 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      color: 'white'
    }}>
      Loading...
    </div>
  );

  if (error) return (
    <div style={{ 
      backgroundColor: 'black', 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      color: 'red'
    }}>
      Error: {error}
    </div>
  );

  return (
    <div style={{
      backgroundColor: 'black',
      minHeight: '100vh',
      color: 'white',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px'
      }}>
        {/* Header Welcome */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px',
          padding: '20px',
          backgroundColor: '#333',
          borderRadius: '10px'
        }}>
          <h1 style={{
            color: 'pink',
            fontSize: '2.5rem',
            margin: '0'
          }}>
            Welcome
          </h1>
          <p style={{ color: '#ccc', marginTop: '10px' }}>
            CRUD User Management System
          </p>
        </div>

        {/* Form Input */}
        <div style={{
          backgroundColor: '#222',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '30px'
        }}>
          <h2 style={{ color: 'pink', marginBottom: '20px' }}>
            {editingId ? 'Edit User' : 'Tambah User Baru'}
          </h2>
          
          <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                Username:
              </label>
              <input
                type="text"
                name="user"
                value={formData.user}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#444',
                  border: '1px solid #666',
                  borderRadius: '5px',
                  color: 'white'
                }}
                placeholder="Masukkan username"
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                Password:
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#444',
                  border: '1px solid #666',
                  borderRadius: '5px',
                  color: 'white'
                }}
                placeholder="Masukkan password"
              />
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                style={{
                  backgroundColor: 'pink',
                  color: 'black',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {editingId ? 'Update' : 'Tambah'}
              </button>
              
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    backgroundColor: '#666',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tabel Data */}
        <div style={{
          backgroundColor: '#222',
          padding: '20px',
          borderRadius: '10px'
        }}>
          <h2 style={{ color: 'pink', marginBottom: '20px' }}>
            Daftar Users ({users.length})
          </h2>
          
          {users.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#ccc' }}>
              Tidak ada data user
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                backgroundColor: '#333'
              }}>
                <thead>
                  <tr>
                    <th style={{ 
                      border: '1px solid #555', 
                      padding: '12px', 
                      textAlign: 'left' 
                    }}>ID</th>
                    <th style={{ 
                      border: '1px solid #555', 
                      padding: '12px', 
                      textAlign: 'left' 
                    }}>Username</th>
                    <th style={{ 
                      border: '1px solid #555', 
                      padding: '12px', 
                      textAlign: 'left' 
                    }}>Password</th>
                    <th style={{ 
                      border: '1px solid #555', 
                      padding: '12px', 
                      textAlign: 'center' 
                    }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td style={{ 
                        border: '1px solid #555', 
                        padding: '12px' 
                      }}>
                        {user.id}
                      </td>
                      <td style={{ 
                        border: '1px solid #555', 
                        padding: '12px' 
                      }}>
                        {user.user}
                      </td>
                      <td style={{ 
                        border: '1px solid #555', 
                        padding: '12px' 
                      }}>
                        ••••••••
                      </td>
                      <td style={{ 
                        border: '1px solid #555', 
                        padding: '12px', 
                        textAlign: 'center' 
                      }}>
                        <button
                          onClick={() => handleEdit(user)}
                          style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            marginRight: '5px'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          style={{
                            backgroundColor: '#f44336',
                            color: 'white',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '3px',
                            cursor: 'pointer'
                          }}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pages;
