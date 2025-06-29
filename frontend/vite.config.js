// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { // Este é o prefixo que o frontend usará para todas as chamadas de API
        target: 'http://localhost:8010', // <-- CORRIGIDO: O TARGET DEVE APONTAR APENAS PARA A BASE URL DO SEU BACKEND
        changeOrigin: true, // Necessário para CORS
        // rewrite: (path) => path.replace(/^\/api/, ''), // Mantenha esta linha comentada ou remova
      },
    },
  },
});
