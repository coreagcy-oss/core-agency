import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base указывает на имя репозитория GitHub Pages — сайт открывается по адресу
// https://<username>.github.io/core-agency/. При смене имени репозитория поменяйте здесь.
export default defineConfig({
  base: '/core-agency/',
  plugins: [react()],
  server: { port: 5173, host: true },
});
