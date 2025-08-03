import axios from 'axios';

const API_BASE = 'https://bos.free.nf/api'; // Ganti dengan domain InfinityFree kamu

const api = axios.create({
  baseURL: API_BASE,
});

// Interceptor untuk tambahkan token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;