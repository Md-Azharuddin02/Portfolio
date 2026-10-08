import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  define: {
    __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)),
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'icons-vendor': ['react-icons'],
        },
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  optimizeDeps: {
    // Pre-bundle the lazily imported 3D/animation deps so dev never re-optimizes mid-session
    // (a mid-session re-optimize loads two React copies and throws invalid-hook errors).
    include: ['react', 'react-dom', 'react-router-dom', 'react-icons', 'three', '@react-three/fiber', 'gsap', 'gsap/ScrollTrigger', '@gsap/react'],
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true,
  }
})