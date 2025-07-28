import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Pages = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ user: '', password: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load data dari API
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await axios.get('/api/dat.php');
      setUsers(response.data);
      setError('');
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const getNextId = () => {
    return users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.user.trim() || !formData.password.trim()) {
      setError('Username dan Password tidak boleh kosong');
      return;
    }

    try {
      const userData = {
        id: editingId || getNextId(),
        user: formData.user.trim(),
        password: formData.password.trim(),
        action: editingId ? 'update' : 'create'
      };

      await axios.post('/api/users.php', userData);
      await loadData(); // Reload data
      setFormData({ user: '', password: '' });
      setEditingId(null);
      setError('');
    } catch (err) {
      console.error('Error saving data:', err);
      setError('Gagal menyimpan data');
    }
  };

  const handleEdit = (user) => {
    setFormData({ user: user.user, password: user.password });
    setEditingId(user.id);
    setError('');
  };

  const handleDelete = async (id) => {
    if (users.length <= 1) {
      setError('Tidak bisa menghapus user terakhir');
      return;
    }
    
    if (window.confirm('Yakin ingin menghapus user ini?')) {
      try {
        await axios.post('/api/users.php', { id, action: 'delete' });
        await loadData(); // Reload data
        if (editingId === id) {
          setFormData({ user: '', password: '' });
          setEditingId(null);
        }
        setError('');
      } catch (err) {
        console.error('Error deleting data:', err);
        setError('Gagal menghapus data');
      }
    }
  };

  const handleCancel = () => {
    setFormData({ user: '', password: '' });
    setEditingId(null);
    setError('');
  };

  // Simple inline styles
  const containerStyle = {
    padding: '20px',
    maxWidth: '1000px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh'
  };

  const titleStyle = {
    textAlign: 'center',
    color: '#333',
    marginBottom: '30px'
  };

  const errorStyle = {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '15px'
  };

  const formContainerStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const formStyle = {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  };

  const inputStyle = {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    flex: 1,
    minWidth: '150px'
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  };

  const cancelButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  };

  const tableContainerStyle = {
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden'
  };

  const tableHeaderStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    margin: 0,
    padding: '15px',
    fontSize: '18px'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse'
  };

  const thStyle = {
    padding: '12px',
    textAlign: 'left',
    borderBottom: '2px solid #ddd',
    backgroundColor: '#f8f9fa'
  };

  const tdStyle = {
    padding: '12px',
    borderBottom: '1px solid #eee'
  };

  const editButtonStyle = {
    padding: '6px 12px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '5px'
  };

  const deleteButtonStyle = {
    padding: '6px 12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '50px', color: '#333' }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>User Management</h1>
      
      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}
      
      <div style={formContainerStyle}>
        <h2 style={{ color: '#555', marginBottom: '15px' }}>
          {editingId ? 'Edit User' : 'Add New User'}
        </h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="text"
            value={formData.user}
            onChange={(e) => setFormData({...formData, user: e.target.value})}
            placeholder="Username"
            style={inputStyle}
            required
          />
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            placeholder="Password"
            style={inputStyle}
            required
          />
          <button type="submit" style={buttonStyle}>
            {editingId ? 'Update' : 'Add'}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancel} style={cancelButtonStyle}>
              Cancel
            </button>
          )}
        </form>
      </div>

      <div style={tableContainerStyle}>
        <h2 style={tableHeaderStyle}>
          Users List ({users.length})
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Username</th>
                <th style={thStyle}>Password</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={tdStyle}>{user.id}</td>
                  <td style={tdStyle}>{user.user}</td>
                  <td style={tdStyle}>••••••••</td>
                  <td style={tdStyle}>
                    <button 
                      onClick={() => handleEdit(user)}
                      style={editButtonStyle}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id)}
                      disabled={users.length <= 1}
                      style={{
                        ...deleteButtonStyle,
                        opacity: users.length <= 1 ? 0.5 : 1,
                        cursor: users.length <= 1 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Pages;
