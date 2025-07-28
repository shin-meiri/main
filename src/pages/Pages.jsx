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
      const response = await axios.get('/api/users.php');
      setUsers(response.data);
      setError('');
    } catch (err) {
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
        setError('Gagal menghapus data');
      }
    }
  };

  const handleCancel = () => {
    setFormData({ user: '', password: '' });
    setEditingId(null);
    setError('');
  };

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>User Management</h1>
      
      {error && (
        <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
          {error}
        </div>
      )}
      
      <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ color: '#555', marginBottom: '15px' }}>{editingId ? 'Edit User' : 'Add New User'}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={formData.user}
            onChange={(e) => setFormData({...formData, user: e.target.value})}
            placeholder="Username"
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', flex: 1, minWidth: '150px' }}
            required
          />
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            placeholder="Password"
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', flex: 1, minWidth: '150px' }}
            required
          />
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {editingId ? 'Update' : 'Add'}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancel} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Cancel
            </button>
          )}
        </form>
      </div>

      <div style={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
        <h2 style={{ backgroundColor: '#007bff', color: 'white', margin: 0, padding: '15px', fontSize: '18px' }}>
          Users List ({users.length})
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>ID</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Username</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Password</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{user.id}</td>
                  <td style={{ padding: '12px' }}>{user.user}</td>
                  <td style={{ padding: '12px' }}>••••••••</td>
                  <td style={{ padding: '12px' }}>
                    <button 
                      onClick={() => handleEdit(user)}
                      style={{ padding: '6px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id)}
                      disabled={users.length <= 1}
                      style={{ padding: '6px 12px', backgroundColor: users.length <= 1 ? '#dc3545' : '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: users.length <= 1 ? 'not-allowed' : 'pointer', opacity: users.length <= 1 ? 0.5 : 1 }}
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
