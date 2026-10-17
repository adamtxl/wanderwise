import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    outDir: 'build',
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
    },
    historyApiFallback: true, // Ensures index.html is served for all routes
  },
  plugins: [react()],
});
