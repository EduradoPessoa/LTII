import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Garante que o Vite substitua corretamente as variáveis de ambiente
    'process.env': process.env
  }
})
