import { defineConfig } from 'vite';

export default defineConfig({ 
  base: '/rickandmortyexplorer/',
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler', 
      },
    },
  },
});