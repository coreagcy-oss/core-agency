import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Сайт обслуживается с собственного домена core-agency.pro (корень),
// поэтому base = '/'. Для project-страницы GitHub Pages здесь был '/core-agency/'.
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: { port: 5173, host: true },
});
