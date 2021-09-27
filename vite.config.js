import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { svgBuilder } from './src/plugins/svgBuilder'; 

const { resolve } = require('path');

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [vue(), svgBuilder('./src/assets/fonts/svg/')],
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
  server: {
    hmr: { overlay: false },
    port: 8009,
    proxy: {
      '/test': 'http://47.104.199.74:7001',
      '/api': 'http://220.194.160.6:38082',
      '/wz': 'https://img02.mysteelcdn.com',
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
