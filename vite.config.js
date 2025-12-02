import { defineConfig } from 'vite'

export default defineConfig({
  root: '.', // garante que o index.html está na raiz
  build: {
    outDir: 'dist'
  },
  server: {
    port: 5173
  }
})
