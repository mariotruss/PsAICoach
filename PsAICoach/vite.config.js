import { defineConfig } from 'vite';

export default defineConfig({
  root: 'web',
  server: {
    port: 5173,
    open: '/index.html' // Open main app by default
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'web/index.html',
        voice: 'web/index-voice.html'
      }
    }
  }
});

