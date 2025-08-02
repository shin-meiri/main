// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/', // Karena di-host bareng
  withCredentials: false, // Sesuaikan
});

export default api;