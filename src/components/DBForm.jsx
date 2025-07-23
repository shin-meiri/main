import React, { useState, useEffect } from 'react';

const DbManager = () => {
  const [form, setForm] = useState({
    host: '',
    user: '',
    pass: '',
    dbname: ''
  });
  const [status, setStatus] = useState('loading'); // loading, disconnected, connected, failed
  const [error, setError] = useState('');

  // Cek status koneksi saat load
  useEffect(() => {
    fetch('/crudb.php')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'error') {
          setError(data.message);
          setStatus('disconnected');
        } else {
          setStatus(data.status);
          if (data.config) setForm(data.config);
        }
      })
      .catch(() => {
        setError('Gagal load konfigurasi');
        setStatus('disconnected');
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('loading');

    // Simpan ke db.json via PHP
    fetch('/crudb.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'saved') {
          setStatus(data.connection?.status || 'disconnected');
        } else {
          setError(data.message);
          setStatus('failed');
        }
      })
      .catch(() => {
        setError('Gagal menyimpan');
        setStatus('failed');
      });
  };

  const handleDelete = () => {
    if (window.confirm('⚠️ Hapus konfigurasi database?')) {
      fetch('/crudb.php', { method: 'DELETE' })
        .then(() => {
          setForm({ host: '', user: '', pass: '', dbname: '' });
          setStatus('disconnected');
        });
    }
  };

  // Render UI berdasarkan status
  const renderStatus = () => {
    switch (status) {
      case 'connected':
        return (
          <div style={styles.status.success}>
            🟢 <strong>KONEKSI BERHASIL!</strong> Database siap digunakan.
          </div>
        );
      case 'failed':
        return (
          <div style={styles.status.failed}>
            🔴 <strong>GAGAL KONEKSI:</strong> {error || 'Periksa host, user, atau password.'}
          </div>
        );
      case 'disconnected':
        return (
          <div style={styles.status.disconnected}>
            ⚪ <strong>BELUM KONEKSI</strong> – Silakan simpan konfigurasi.
          </div>
        );
      case 'loading':
        return (
          <div style={styles.status.loading}>
            🔍 Sedang memuat status...
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>💾 Manajer Database</h2>

      {/* Status */}
      {renderStatus()}

      {/* Form */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>🌐 Host</label>
          <input
            type="text"
            name="host"
            value={form.host}
            onChange={handleChange}
            placeholder="localhost atau sql123.epizy.com"
            required
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>👤 Username</label>
          <input
            type="text"
            name="user"
            value={form.user}
            onChange={handleChange}
            placeholder="epiz_xxxxxxxx_user"
            required
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>🔐 Password</label>
          <input
            type="password"
            name="pass"
            value={form.pass}
            onChange={handleChange}
            placeholder="••••••••"
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>📁 Database Name (opsional)</label>
          <input
            type="text"
            name="dbname"
            value={form.dbname}
            onChange={handleChange}
            placeholder="myapp_db"
            style={styles.input}
          />
        </div>

        <div style={styles.buttons}>
          <button type="submit" style={styles.btn.save}>
            💾 Simpan & Cek Koneksi
          </button>
          {status !== 'disconnected' && (
            <button type="button" onClick={handleDelete} style={styles.btn.delete}>
              🗑️ Hapus
            </button>
          )}
        </div>
      </form>

      {/* Info */}
      <div style={styles.info}>
        <p>📝 Konfigurasi disimpan di <code>db.json</code></p>
        <p>🔒 Hanya untuk testing – jangan gunakan di production!</p>
      </div>
    </div>
  );
};

// === STYLES ===
const styles = {
  container: {
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    maxWidth: '600px',
    margin: '30px auto',
    padding: '25px',
    backgroundColor: '#f9f9fb',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    border: '1px solid #e0e0e0'
  },
  title: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '20px',
    fontSize: '28px'
  },
  status: {
    success: {
      padding: '15px',
      backgroundColor: '#d4edda',
      color: '#155724',
      borderRadius: '8px',
      marginBottom: '20px',
      fontSize: '16px',
      textAlign: 'center',
      fontWeight: 'bold',
      border: '1px solid #c3e6cb'
    },
    failed: {
      padding: '15px',
      backgroundColor: '#f8d7da',
      color: '#721c24',
      borderRadius: '8px',
      marginBottom: '20px',
      fontSize: '16px',
      textAlign: 'center',
      fontWeight: 'bold',
      border: '1px solid #f5c6cb'
    },
    disconnected: {
      padding: '15px',
      backgroundColor: '#fff3cd',
      color: '#856404',
      borderRadius: '8px',
      marginBottom: '20px',
      fontSize: '16px',
      textAlign: 'center',
      fontWeight: 'bold',
      border: '1px solid #ffeaa7'
    },
    loading: {
      padding: '15px',
      backgroundColor: '#d1ecf1',
      color: '#0c5460',
      borderRadius: '8px',
      marginBottom: '20px',
      fontSize: '16px',
      textAlign: 'center',
      fontWeight: 'bold'
    }
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  field: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#495057',
    marginBottom: '6px'
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ced4da',
    borderRadius: '6px',
    outline: 'none',
    transition: 'border 0.3s'
  },
  buttons: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px'
  },
  btn: {
    save: {
      flex: 1,
      backgroundColor: '#007bff',
      color: 'white',
      padding: '12px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold'
    },
    delete: {
      backgroundColor: '#dc3545',
      color: 'white',
      padding: '12px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold'
    }
  },
  info: {
    marginTop: '20px',
    fontSize: '14px',
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: '1.5'
  }
};

export default DbManager;
