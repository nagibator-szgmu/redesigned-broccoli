import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'three-spiral-emblem': path.resolve(__dirname, './src/lib/threeSpiralEmblem.js')
    }
  },
  base: "/",
  server: {
    port: 3000,
    open: true,
  },
});
