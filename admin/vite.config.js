import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {fileURLToPath} from 'url';
import {defineConfig} from 'vite';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: rootDir,
  envDir: path.resolve(rootDir, '..'),
  base: '/',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: path.resolve(rootDir, '../dist-admin'),
    emptyOutDir: true,
  },
  server: {
    host: '0.0.0.0',
    port: 3001,
    strictPort: true,
  },
});
