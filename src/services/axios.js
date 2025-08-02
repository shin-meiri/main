import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost/api', // Sesuaikan dengan lokasi PHP
  withCredentials: true, // Jika pakai session PHP
});

export default api;