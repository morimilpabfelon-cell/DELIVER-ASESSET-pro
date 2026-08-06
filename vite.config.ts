import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/DELIVER-ASESSET-pro/',
  plugins: [react()],
  build: {
    target: 'es2022',
    sourcemap: false,
  },
});
