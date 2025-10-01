import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/galfredev-blurry-loading/', // 👈 debe coincidir con el nombre del repo
  plugins: [react()],
})
