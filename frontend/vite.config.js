import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
export default defineConfig({
  plugins: [react()],
  server: { host: '0.0.0.0', port: 5173 },
  preview: { host: '0.0.0.0', port: 4173 },
  build: { rollupOptions: { output: { manualChunks(id) { if (!id.includes('node_modules')) return; return /node_modules\/(?:@apollo|graphql|rxjs)\//.test(id) ? 'graphql' : 'vendor'; } } } },
});
