import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5563,
    proxy: {
      '/api': 'http://localhost:5562'
    }
  },
  build: {
    outDir: 'dist'
  }
});
