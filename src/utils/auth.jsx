// Fungsi untuk login (cek username & password)
export const login = (username, password) => {
  return fetch('/data/user.json')
    .then(res => res.json())
    .then(user => {
      if (user.username === username && user.password === password) {
        localStorage.setItem('admin', JSON.stringify(user));
        return { success: true, user };
      }
      return { success: false, message: 'Username atau password salah' };
    })
    .catch(() => ({ success: false, message: 'Gagal memuat data' }));
};

// Cek apakah user sudah login
export const isAuthenticated = () => {
  return !!localStorage.getItem('admin');
};

// Logout
export const logout = () => {
  localStorage.removeItem('admin');
};