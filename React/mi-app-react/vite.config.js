import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Cargar .env desde la raíz del proyecto
  const env = loadEnv(mode, path.resolve(__dirname, '../../'), '')
  
  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(
        env.VITE_API_URL || `http://localhost:${env.PORT || 5000}/api`
      ),
    },
  }
})
