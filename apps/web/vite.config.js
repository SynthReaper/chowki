// ============================================================
// Project CHOWKI — Campus Outbreak Surveillance System
// Made by Synthreaper | github.com/synthreaper/chowki
// File: apps/web/vite.config.js | Last Modified: 2026-08-22
// ============================================================

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      }
    }
  }
});
