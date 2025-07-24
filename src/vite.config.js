import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  // Tambahkan ini agar SPA support
  preview: {
    port: 3000,
  },
});