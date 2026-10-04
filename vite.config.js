import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api/gigachat/oauth': {
        target: 'https://ngw.devices.sberbank.ru:9443',
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/api\/gigachat\/oauth/, '/api/v2/oauth'),
      },
      '/api/gigachat/v1': {
        target: 'https://gigachat.devices.sberbank.ru',
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/api\/gigachat\/v1/, '/api/v1'),
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('three')) {
            return 'vendor-three';
          }
        }
      }
    }
  }
});
