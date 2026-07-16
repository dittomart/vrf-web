import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ command }) => ({
  // Production is deployed under a sub-path (…/vrf-web/), so every built asset
  // URL must carry that prefix — without it the browser requests /assets/… at
  // the domain root and 404s. Dev server stays at root for convenience.
  // Override with `VITE_BASE=/` (root deploy) or another path as needed.
  base: process.env.VITE_BASE ?? (command === 'build' ? '/vrf-web/' : '/'),
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5180,
    strictPort: true,
  },
}));
