import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  },
  define: {
    // This bridges Vercel's hidden WORKER_URL straight into your React app
    'import.meta.env.WORKER_URL': JSON.stringify(process.env.WORKER_URL)
  }
});