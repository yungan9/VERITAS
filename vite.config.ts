import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'index.html'),
        content: resolve(__dirname, 'src/content.ts')
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === 'content') return 'content.js';
          return 'assets/[name].js';
        }
      }
    }
  }
});
