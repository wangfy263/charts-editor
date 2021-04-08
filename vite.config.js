import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const { resolve } = require('path');

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [vue()],
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
  server: {
    hmr: { overlay: false },
    port: 8009,
    proxy: {
      '/api': 'http://47.104.199.74:7001',
    },
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          lodash: ['lodash'],
          echarts: ['echarts'],
          element: ['element-plus'],
          html2canvas: ['html2canvas'],
          vuedraggable: ['vuedraggable'],
        },
      },
    },
    terserOptions: {
      ecma: 5, // specify one of: 5, 2015, 2016, etc.
    },
  },
});
